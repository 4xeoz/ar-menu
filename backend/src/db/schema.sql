-- Run this once to set up the database.
-- psql -d your_db_name -f src/db/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin users (you + any WeTrends staff)
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per restaurant you onboard (each = one tenant)
CREATE TABLE IF NOT EXISTS restaurants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,  -- used in URL: /menu/joes-pizza
  logo_url    TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- All menu items across all restaurants, scoped by restaurant_id
CREATE TABLE IF NOT EXISTS menu_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL,
  image_url       TEXT,
  model_url       TEXT,   -- .glb file path/url
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refresh tokens (lets us invalidate sessions)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token       TEXT UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
