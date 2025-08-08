import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'player' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'player' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'player' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          description: string | null
          captain_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          description?: string | null
          captain_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          description?: string | null
          captain_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          player_id: string
          position: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          player_id: string
          position?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          player_id?: string
          position?: string | null
          joined_at?: string
        }
      }
      tournaments: {
        Row: {
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
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          game: string
          max_teams: number
          prize_pool?: number | null
          start_date: string
          end_date: string
          registration_deadline: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          game?: string
          max_teams?: number
          prize_pool?: number | null
          start_date?: string
          end_date?: string
          registration_deadline?: string
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          tournament_id: string
          team1_id: string
          team2_id: string
          scheduled_time: string
          status: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score: number | null
          team2_score: number | null
          winner_id: string | null
          round: string | null
          stream_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          team1_id: string
          team2_id: string
          scheduled_time: string
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score?: number | null
          team2_score?: number | null
          winner_id?: string | null
          round?: string | null
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          team1_id?: string
          team2_id?: string
          scheduled_time?: string
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score?: number | null
          team2_score?: number | null
          winner_id?: string | null
          round?: string | null
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          featured_image: string | null
          category: string
          author_id: string
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          category: string
          author_id: string
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          category?: string
          author_id?: string
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}