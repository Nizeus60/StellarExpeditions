/*
  # Stellar Expeditions Database Schema

  ## Overview
  Database schema for Stellar Expeditions idle strategy game, supporting player progression,
  mission tracking, squad management, artifact collection, and prestige system.

  ## New Tables
    
  ### `players`
  - `id` (uuid, primary key) - Player unique identifier
  - `user_id` (uuid, references auth.users) - Authentication user ID
  - `credits` (bigint) - In-game currency
  - `reputation` (bigint) - Player progression metric
  - `fragments` (integer) - Artifact crafting currency
  - `energy` (integer) - Mission launch resource
  - `max_energy` (integer) - Maximum energy capacity
  - `prestige_count` (integer) - Number of prestiges completed
  - `prestige_multiplier` (numeric) - Permanent bonus multiplier
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `missions`
  - `id` (uuid, primary key) - Mission unique identifier
  - `player_id` (uuid, references players) - Owner player
  - `mission_type` (text) - Type: exploration, combat, mining, diplomacy
  - `name` (text) - Mission display name
  - `duration` (integer) - Duration in seconds
  - `zone` (text) - Galaxy zone location
  - `danger_level` (text) - Danger: safe, risky, dangerous, deadly
  - `status` (text) - Status: available, active, completed
  - `assigned_squad_id` (uuid) - Assigned squad reference
  - `start_time` (timestamptz) - Mission start timestamp
  - `reward_credits` (integer) - Credit reward
  - `reward_reputation` (integer) - Reputation reward
  - `reward_fragments` (integer) - Fragment reward
  - `artifact_drop_chance` (numeric) - Artifact probability
  - `tier` (integer) - Mission difficulty tier
  - `created_at` (timestamptz)

  ### `squads`
  - `id` (uuid, primary key) - Squad unique identifier
  - `player_id` (uuid, references players) - Owner player
  - `name` (text) - Squad display name
  - `squad_type` (text) - Type: explorers, commandos, miners, diplomats, versatile
  - `level` (integer) - Squad level
  - `is_available` (boolean) - Availability status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `artifacts`
  - `id` (uuid, primary key) - Artifact unique identifier
  - `player_id` (uuid, references players) - Owner player
  - `name` (text) - Artifact display name
  - `rarity` (text) - Rarity: common, rare, epic, legendary, mythic
  - `description` (text) - Artifact description
  - `effects` (jsonb) - Artifact effects and bonuses
  - `equipped` (boolean) - Equipment status
  - `acquired_at` (timestamptz) - Acquisition timestamp

  ### `zones`
  - `id` (uuid, primary key) - Zone unique identifier
  - `player_id` (uuid, references players) - Owner player
  - `name` (text) - Zone display name
  - `danger_level` (text) - Danger level
  - `unlocked` (boolean) - Unlock status
  - `unlock_cost` (integer) - Reputation cost to unlock
  - `description` (text) - Zone description

  ## Security
  - Enable RLS on all tables
  - Players can only access their own data
  - All operations require authentication
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  credits bigint DEFAULT 1000,
  reputation bigint DEFAULT 0,
  fragments integer DEFAULT 0,
  energy integer DEFAULT 5,
  max_energy integer DEFAULT 5,
  prestige_count integer DEFAULT 0,
  prestige_multiplier numeric(10,4) DEFAULT 1.0000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create squads table
CREATE TABLE IF NOT EXISTS squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  squad_type text NOT NULL CHECK (squad_type IN ('explorers', 'commandos', 'miners', 'diplomats', 'versatile')),
  level integer DEFAULT 1,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  rarity text NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
  description text DEFAULT '',
  effects jsonb DEFAULT '[]'::jsonb,
  equipped boolean DEFAULT false,
  acquired_at timestamptz DEFAULT now()
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  danger_level text NOT NULL CHECK (danger_level IN ('safe', 'risky', 'dangerous', 'deadly')),
  unlocked boolean DEFAULT false,
  unlock_cost integer DEFAULT 0,
  description text DEFAULT ''
);

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  mission_type text NOT NULL CHECK (mission_type IN ('exploration', 'combat', 'mining', 'diplomacy')),
  name text NOT NULL,
  duration integer NOT NULL,
  zone text NOT NULL,
  danger_level text NOT NULL CHECK (danger_level IN ('safe', 'risky', 'dangerous', 'deadly')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'active', 'completed')),
  assigned_squad_id uuid REFERENCES squads(id) ON DELETE SET NULL,
  start_time timestamptz,
  reward_credits integer DEFAULT 0,
  reward_reputation integer DEFAULT 0,
  reward_fragments integer DEFAULT 0,
  artifact_drop_chance numeric(5,4) DEFAULT 0.3000,
  tier integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Users can view own player data"
  ON players FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player data"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own player data"
  ON players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Squads policies
CREATE POLICY "Users can view own squads"
  ON squads FOR SELECT
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own squads"
  ON squads FOR INSERT
  TO authenticated
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own squads"
  ON squads FOR UPDATE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own squads"
  ON squads FOR DELETE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Artifacts policies
CREATE POLICY "Users can view own artifacts"
  ON artifacts FOR SELECT
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own artifacts"
  ON artifacts FOR INSERT
  TO authenticated
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own artifacts"
  ON artifacts FOR UPDATE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own artifacts"
  ON artifacts FOR DELETE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Zones policies
CREATE POLICY "Users can view own zones"
  ON zones FOR SELECT
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own zones"
  ON zones FOR INSERT
  TO authenticated
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own zones"
  ON zones FOR UPDATE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Missions policies
CREATE POLICY "Users can view own missions"
  ON missions FOR SELECT
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own missions"
  ON missions FOR INSERT
  TO authenticated
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own missions"
  ON missions FOR UPDATE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own missions"
  ON missions FOR DELETE
  TO authenticated
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_squads_player_id ON squads(player_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_player_id ON artifacts(player_id);
CREATE INDEX IF NOT EXISTS idx_zones_player_id ON zones(player_id);
CREATE INDEX IF NOT EXISTS idx_missions_player_id ON missions(player_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_artifacts_equipped ON artifacts(equipped);
