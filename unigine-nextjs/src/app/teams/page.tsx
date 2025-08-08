'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TeamCard from '@/components/teams/TeamCard'
import { Plus, Search } from 'lucide-react'

interface Team {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  captain: {
    username: string
    full_name: string | null
  }
  members: Array<{
    player: {
      username: string
      full_name: string | null
    }
    position: string | null
  }>
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          captain:profiles!teams_captain_id_fkey(username, full_name),
          members:team_members(
            position,
            player:profiles!team_members_player_id_fkey(username, full_name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captain.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (teamId: string) => {
    // TODO: Navigate to team details page
    console.log('View team details:', teamId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-purple pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple mx-auto"></div>
            <p className="text-gainsboro mt-4">Loading teams...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-purple pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Teams</h1>
          <p className="text-gainsboro max-w-2xl mx-auto">
            Discover professional esports teams and their rosters competing in various tournaments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-oxford-blue-alpha-90 border border-purple-alpha-30 rounded text-white placeholder-gainsboro focus:outline-none focus:border-purple"
            />
          </div>

          <button className="btn flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </button>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gainsboro text-lg">
              {searchTerm ? 'No teams found matching your search.' : 'No teams found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}