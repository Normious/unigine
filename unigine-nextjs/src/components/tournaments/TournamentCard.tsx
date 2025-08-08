'use client'

import { Calendar, Trophy, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

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

interface TournamentCardProps {
  tournament: Tournament
  onRegister?: (tournamentId: string) => void
}

export default function TournamentCard({ tournament, onRegister }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400'
      case 'ongoing': return 'text-green-400'
      case 'completed': return 'text-gray-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gainsboro'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500 bg-opacity-20'
      case 'ongoing': return 'bg-green-500 bg-opacity-20'
      case 'completed': return 'bg-gray-500 bg-opacity-20'
      case 'cancelled': return 'bg-red-500 bg-opacity-20'
      default: return 'bg-purple bg-opacity-20'
    }
  }

  return (
    <div className="bg-oxford-blue-alpha-90 rounded-lg p-6 shadow-lg border border-purple-alpha-30 hover:border-purple transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBg(tournament.status)} ${getStatusColor(tournament.status)}`}>
          {tournament.status.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gainsboro mb-4 line-clamp-2">{tournament.description}</p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-champagne-pink">
          <Trophy className="w-4 h-4 mr-2 text-purple" />
          <span className="text-sm">{tournament.game}</span>
        </div>
        
        <div className="flex items-center text-champagne-pink">
          <Users className="w-4 h-4 mr-2 text-purple" />
          <span className="text-sm">Max {tournament.max_teams} teams</span>
        </div>
        
        {tournament.prize_pool && (
          <div className="flex items-center text-champagne-pink">
            <DollarSign className="w-4 h-4 mr-2 text-purple" />
            <span className="text-sm">${tournament.prize_pool.toLocaleString()} Prize Pool</span>
          </div>
        )}
        
        <div className="flex items-center text-champagne-pink">
          <Calendar className="w-4 h-4 mr-2 text-purple" />
          <span className="text-sm">
            {format(new Date(tournament.start_date), 'MMM dd, yyyy')} - {format(new Date(tournament.end_date), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
      
      {tournament.status === 'upcoming' && onRegister && (
        <button
          onClick={() => onRegister(tournament.id)}
          className="w-full btn"
        >
          Register Team
        </button>
      )}
    </div>
  )
}