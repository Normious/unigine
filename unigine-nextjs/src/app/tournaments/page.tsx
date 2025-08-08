'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TournamentCard from '@/components/tournaments/TournamentCard'
import { Plus, Filter } from 'lucide-react'

interface Tournament {
  id: string
  name: string
  description: string | null
  game: string
  max_teams: number
  prize_pool: number | null
  start_date: string
  end_date: string
  registration_deadline: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchTournaments()
  }, [filter])

  const fetchTournaments = async () => {
    try {
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setTournaments(data || [])
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (tournamentId: string) => {
    // TODO: Implement tournament registration logic
    console.log('Register for tournament:', tournamentId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-purple pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple mx-auto"></div>
            <p className="text-gainsboro mt-4">Loading tournaments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-purple pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Tournaments</h1>
          <p className="text-gainsboro max-w-2xl mx-auto">
            Join competitive tournaments and prove your skills against the best teams in esports.
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
              <option value="all">All Tournaments</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button className="btn flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Tournament
          </button>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gainsboro text-lg">No tournaments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}