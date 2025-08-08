'use client'

import { Calendar, Clock, Trophy, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

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

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400'
      case 'live': return 'text-green-400'
      case 'completed': return 'text-gray-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gainsboro'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500 bg-opacity-20'
      case 'live': return 'bg-green-500 bg-opacity-20'
      case 'completed': return 'bg-gray-500 bg-opacity-20'
      case 'cancelled': return 'bg-red-500 bg-opacity-20'
      default: return 'bg-purple bg-opacity-20'
    }
  }

  const TeamLogo = ({ team }: { team: { name: string; logo_url: string | null } }) => (
    team.logo_url ? (
      <Image
        src={team.logo_url}
        alt={`${team.name} logo`}
        width={50}
        height={50}
        className="rounded-full"
      />
    ) : (
      <div className="w-12 h-12 bg-purple bg-opacity-30 rounded-full flex items-center justify-center">
        <Trophy className="w-6 h-6 text-purple" />
      </div>
    )
  )

  return (
    <div className="bg-oxford-blue-alpha-90 rounded-lg p-6 shadow-lg border border-purple-alpha-30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{match.tournament.name}</h3>
          {match.round && (
            <p className="text-champagne-pink text-sm">{match.round}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBg(match.status)} ${getStatusColor(match.status)}`}>
          {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TeamLogo team={match.team1} />
          <div className="text-center">
            <p className="text-white font-semibold">{match.team1.name}</p>
            {match.status === 'completed' && match.team1_score !== null && (
              <p className="text-2xl font-bold text-purple">{match.team1_score}</p>
            )}
          </div>
        </div>
        
        <div className="text-center px-4">
          <p className="text-gainsboro text-sm">VS</p>
          {match.status === 'scheduled' && (
            <div className="text-center mt-2">
              <div className="flex items-center justify-center text-champagne-pink">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {format(new Date(match.scheduled_time), 'MMM dd')}
                </span>
              </div>
              <div className="flex items-center justify-center text-champagne-pink">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {format(new Date(match.scheduled_time), 'HH:mm')}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <p className="text-white font-semibold">{match.team2.name}</p>
            {match.status === 'completed' && match.team2_score !== null && (
              <p className="text-2xl font-bold text-purple">{match.team2_score}</p>
            )}
          </div>
          <TeamLogo team={match.team2} />
        </div>
      </div>
      
      {match.stream_url && match.status === 'live' && (
        <div className="mt-4">
          <a
            href={match.stream_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch Live
          </a>
        </div>
      )}
    </div>
  )
}