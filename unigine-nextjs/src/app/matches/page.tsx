'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import MatchCard from '@/components/matches/MatchCard'
import { Calendar, Filter } from 'lucide-react'

interface Match {
  id: string
  tournament: {
    name: string
  }
  team1: {
    name: string
    logo_url: string | null
  }
  team2: {
    name: string
    logo_url: string | null
  }
  scheduled_time: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  team1_score: number | null
  team2_score: number | null
  winner_id: string | null
  round: string | null
  stream_url: string | null
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchMatches()
  }, [filter])

  const fetchMatches = async () => {
    try {
      let query = supabase
        .from('matches')
        .select(`
          *,
          tournament:tournaments(name),
          team1:teams!matches_team1_id_fkey(name, logo_url),
          team2:teams!matches_team2_id_fkey(name, logo_url)
        `)
        .order('scheduled_time', { ascending: true })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setMatches(data || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-purple pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple mx-auto"></div>
            <p className="text-gainsboro mt-4">Loading matches...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-purple pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Matches</h1>
          <p className="text-gainsboro max-w-2xl mx-auto">
            Follow live matches and catch up on recent results from tournaments around the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-oxford-blue-alpha-90 border border-purple-alpha-30 rounded px-4 py-2 text-white focus:outline-none focus:border-purple"
            >
              <option value="all">All Matches</option>
              <option value="live">Live</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center text-champagne-pink">
            <Calendar className="w-5 h-5 mr-2 text-purple" />
            <span>Today's Schedule</span>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gainsboro text-lg">No matches found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}