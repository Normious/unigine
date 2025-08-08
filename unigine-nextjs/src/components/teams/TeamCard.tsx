'use client'

import { Users, Crown } from 'lucide-react'
import Image from 'next/image'

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

interface TeamCardProps {
  team: Team
  onViewDetails?: (teamId: string) => void
}

export default function TeamCard({ team, onViewDetails }: TeamCardProps) {
  return (
    <div className="bg-oxford-blue-alpha-90 rounded-lg p-6 shadow-lg border border-purple-alpha-30 hover:border-purple transition-colors">
      <div className="flex items-center mb-4">
        {team.logo_url ? (
          <Image
            src={team.logo_url}
            alt={`${team.name} logo`}
            width={60}
            height={60}
            className="rounded-full mr-4"
          />
        ) : (
          <div className="w-15 h-15 bg-purple bg-opacity-30 rounded-full flex items-center justify-center mr-4">
            <Users className="w-8 h-8 text-purple" />
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-bold text-white">{team.name}</h3>
          <div className="flex items-center text-champagne-pink">
            <Crown className="w-4 h-4 mr-1 text-purple" />
            <span className="text-sm">
              {team.captain.full_name || team.captain.username}
            </span>
          </div>
        </div>
      </div>
      
      {team.description && (
        <p className="text-gainsboro mb-4 line-clamp-2">{team.description}</p>
      )}
      
      <div className="mb-4">
        <h4 className="text-white font-semibold mb-2">Members ({team.members.length})</h4>
        <div className="space-y-1">
          {team.members.slice(0, 3).map((member, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gainsboro">
                {member.player.full_name || member.player.username}
              </span>
              {member.position && (
                <span className="text-purple">{member.position}</span>
              )}
            </div>
          ))}
          {team.members.length > 3 && (
            <div className="text-sm text-champagne-pink">
              +{team.members.length - 3} more members
            </div>
          )}
        </div>
      </div>
      
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(team.id)}
          className="w-full btn"
        >
          View Details
        </button>
      )}
    </div>
  )
}