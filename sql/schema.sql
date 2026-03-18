-- Schema for TorneoApp
BEGIN;

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  city TEXT,
  country TEXT,
  founded_year INTEGER,
  president_name TEXT,
  colors JSONB,
  stats JSONB
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'teams_name_unique'
  ) THEN
    ALTER TABLE teams ADD CONSTRAINT teams_name_unique UNIQUE (name);
  END IF;
END
$$;

-- Users (created early because many tables reference it)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name TEXT,
  image TEXT,
  password_hash TEXT,
  cedula TEXT,
  team_id BIGINT REFERENCES teams(id),
  role TEXT
);

-- NextAuth compatible tables
CREATE TABLE IF NOT EXISTS accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Password reset tokens for email-based reset flows
CREATE TABLE IF NOT EXISTS password_resets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Players
CREATE TABLE IF NOT EXISTS players (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  number INTEGER,
  position TEXT,
  team_id BIGINT REFERENCES teams(id),
  stats JSONB
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'players_name_team_unique'
  ) THEN
    ALTER TABLE players ADD CONSTRAINT players_name_team_unique UNIQUE (name, team_id);
  END IF;
END
$$;

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id BIGSERIAL PRIMARY KEY,
  challenger_team_id BIGINT REFERENCES teams(id),
  challenged_team_id BIGINT REFERENCES teams(id),
  status TEXT,
  proposed_date DATE,
  proposed_time TEXT,
  venue TEXT,
  bet_amount BIGINT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  counter_proposal JSONB,
  result JSONB
);

-- Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  type TEXT,
  status TEXT,
  start_date DATE,
  end_date DATE,
  teams JSONB,
  standings JSONB
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tournaments_name_unique'
  ) THEN
    ALTER TABLE tournaments ADD CONSTRAINT tournaments_name_unique UNIQUE (name);
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS tournament_matches (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT REFERENCES tournaments(id),
  home_team_id BIGINT REFERENCES teams(id),
  away_team_id BIGINT REFERENCES teams(id),
  date DATE,
  time TEXT,
  venue TEXT,
  status TEXT,
  home_score INTEGER,
  away_score INTEGER,
  round INTEGER
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  type TEXT,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE,
  data JSONB
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_user_title_unique'
  ) THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_user_title_unique UNIQUE (user_id, title);
  END IF;
END
$$;

COMMIT;

-- Team invites table
BEGIN;
CREATE TABLE IF NOT EXISTS team_invites (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  inviter_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  role TEXT DEFAULT 'player',
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename='team_invites' and indexname='team_invites_token_idx'
  ) THEN
    CREATE INDEX team_invites_token_idx ON team_invites(token);
  END IF;
END
$$;
COMMIT;

