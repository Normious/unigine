/*
  # Create Esports Platform Database Schema

  1. New Tables
    - `profiles` - User profiles with authentication data
    - `teams` - Team information and management
    - `team_members` - Team roster and member positions
    - `tournaments` - Tournament management system
    - `matches` - Match scheduling and results
    - `news` - News articles and blog posts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Proper foreign key relationships

  3. Features
    - User roles (admin, player, viewer)
    - Tournament status tracking
    - Match scheduling with live updates
    - News publishing system
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'viewer' CHECK (role IN ('admin', 'player', 'viewer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  logo_url text,
  description text,
  captain_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  position text,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, player_id)
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  game text NOT NULL,
  max_teams integer NOT NULL DEFAULT 16,
  prize_pool numeric,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  registration_deadline timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team1_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  team2_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  team1_score integer,
  team2_score integer,
  winner_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  round text,
  stream_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Anyone can read teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team captains can update their teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = captain_id);

CREATE POLICY "Authenticated users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = captain_id);

-- Team members policies
CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team captains can manage members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.captain_id = auth.uid()
    )
  );

-- Tournaments policies
CREATE POLICY "Anyone can read tournaments"
  ON tournaments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tournaments"
  ON tournaments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Matches policies
CREATE POLICY "Anyone can read matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage matches"
  ON matches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- News policies
CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  TO authenticated
  USING (published = true);

CREATE POLICY "Authors can read their own news"
  ON news
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can manage their own news"
  ON news
  FOR ALL
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_captain ON teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_player ON team_members(player_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON tournaments(start_date);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled_time ON matches(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);

-- Insert sample data
INSERT INTO profiles (id, email, username, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@unigine.com', 'admin', 'Admin User', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'player1@unigine.com', 'player1', 'John Doe', 'player'),
  ('550e8400-e29b-41d4-a716-446655440002', 'player2@unigine.com', 'player2', 'Jane Smith', 'player')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teams (id, name, description, captain_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'Purple Death Cadets', 'Elite gaming team specializing in FPS games', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Trigger Brain Squad', 'Strategic team focused on tactical gameplay', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tournaments (id, name, description, game, max_teams, prize_pool, start_date, end_date, registration_deadline, status, created_by) VALUES
  ('770e8400-e29b-41d4-a716-446655440000', 'Battles Extreme Masters', 'Premier esports tournament featuring the best teams', 'Counter-Strike 2', 16, 50000, '2024-12-01', '2024-12-15', '2024-11-25', 'upcoming', '550e8400-e29b-41d4-a716-446655440000'),
  ('770e8400-e29b-41d4-a716-446655440001', 'Winter Championship', 'Seasonal championship with multiple game modes', 'Valorant', 32, 25000, '2024-12-20', '2025-01-05', '2024-12-15', 'upcoming', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO matches (id, tournament_id, team1_id, team2_id, scheduled_time, status, round) VALUES
  ('880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', '2024-12-01 18:00:00+00', 'scheduled', 'Group Stage')
ON CONFLICT (id) DO NOTHING;

INSERT INTO news (id, title, content, excerpt, category, author_id, published, published_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440000', 'Tournament Registration Now Open', 'The Battles Extreme Masters tournament registration is now open for all teams. This premier esports event will feature the best teams competing for a $50,000 prize pool.', 'Registration opens for the biggest esports tournament of the year', 'tournament', '550e8400-e29b-41d4-a716-446655440000', true, now()),
  ('990e8400-e29b-41d4-a716-446655440001', 'New Team Joins the League', 'Purple Death Cadets have officially joined our esports platform and are ready to compete in upcoming tournaments.', 'Welcome our newest team to the competitive scene', 'team', '550e8400-e29b-41d4-a716-446655440000', true, now())
ON CONFLICT (id) DO NOTHING;