-- ============================================================================
-- Migration 002: Per-Organization Schema Template
-- ============================================================================
-- PL/pgSQL function that creates a full, isolated schema for a new org.
-- Called by the Clerk webhook Edge Function when an organization is created.
--
-- Each org gets their own Postgres schema with:
--   users, events, sessions, speakers, tickets
--
-- Usage:  SELECT public.create_org_schema('org_2abc123');
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_org_schema(p_schema_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER  -- Runs with the privileges of the function owner (superuser)
AS $$
DECLARE
  -- Sanitize the schema name to prevent SQL injection.
  -- Only allow lowercase alphanumeric characters and underscores.
  v_schema TEXT;
BEGIN
  -- Validate & sanitize schema name
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  IF v_schema IS NULL OR v_schema = '' THEN
    RAISE EXCEPTION 'Invalid schema name: %', p_schema_name;
  END IF;

  -- =========================================================================
  -- Create the schema
  -- =========================================================================
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

  -- =========================================================================
  -- Table: users
  -- Stores all users belonging to this organization (admin, speakers, attendees).
  -- =========================================================================
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.users (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_user_id   TEXT        UNIQUE NOT NULL,
      email           TEXT        NOT NULL,
      full_name       TEXT        NOT NULL DEFAULT '''',
      role            TEXT        NOT NULL DEFAULT ''attendee''
        CHECK (role IN (''admin'', ''speaker'', ''attendee'', ''moderator'')),
      avatar_url      TEXT,
      phone           TEXT,
      institution     TEXT,
      bio             TEXT,
      metadata        JSONB       NOT NULL DEFAULT ''{}''::jsonb,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema);

  -- Index for fast Clerk user lookups
  EXECUTE format('
    CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON %I.users (clerk_user_id)
  ', v_schema);

  -- =========================================================================
  -- Table: events
  -- Each org can host multiple conferences/events.
  -- =========================================================================
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.events (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title           TEXT        NOT NULL,
      description     TEXT,
      short_name      TEXT,
      start_date      DATE,
      end_date        DATE,
      location        TEXT,
      venue           TEXT,
      cover_image_url TEXT,
      status          TEXT        NOT NULL DEFAULT ''draft''
        CHECK (status IN (''draft'', ''published'', ''ongoing'', ''completed'', ''cancelled'')),
      settings        JSONB       NOT NULL DEFAULT ''{}''::jsonb,
      created_by      UUID        REFERENCES %I.users(id),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema);

  -- =========================================================================
  -- Table: speakers
  -- Speaker profiles linked to the org's user table.
  -- =========================================================================
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.speakers (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id         UUID        REFERENCES %I.users(id) ON DELETE SET NULL,
      full_name       TEXT        NOT NULL,
      bio             TEXT,
      title           TEXT,
      company         TEXT,
      photo_url       TEXT,
      social_links    JSONB       NOT NULL DEFAULT ''{}''::jsonb,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema);

  -- =========================================================================
  -- Table: sessions
  -- Individual talks/workshops within an event.
  -- =========================================================================
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.sessions (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id        UUID        NOT NULL REFERENCES %I.events(id) ON DELETE CASCADE,
      title           TEXT        NOT NULL,
      description     TEXT,
      speaker_id      UUID        REFERENCES %I.speakers(id) ON DELETE SET NULL,
      start_time      TIMESTAMPTZ,
      end_time        TIMESTAMPTZ,
      room            TEXT,
      track           TEXT,
      session_type    TEXT        NOT NULL DEFAULT ''talk''
        CHECK (session_type IN (''talk'', ''workshop'', ''panel'', ''keynote'', ''break'', ''networking'')),
      status          TEXT        NOT NULL DEFAULT ''scheduled''
        CHECK (status IN (''scheduled'', ''live'', ''completed'', ''cancelled'')),
      metadata        JSONB       NOT NULL DEFAULT ''{}''::jsonb,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema, v_schema);

  -- Index for fetching sessions by event
  EXECUTE format('
    CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON %I.sessions (event_id)
  ', v_schema);

  -- =========================================================================
  -- Table: tickets
  -- Attendee registration / ticketing for events.
  -- =========================================================================
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.tickets (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id        UUID        NOT NULL REFERENCES %I.events(id) ON DELETE CASCADE,
      user_id         UUID        NOT NULL REFERENCES %I.users(id) ON DELETE CASCADE,
      ticket_type     TEXT        NOT NULL DEFAULT ''general''
        CHECK (ticket_type IN (''general'', ''vip'', ''speaker'', ''organizer'')),
      status          TEXT        NOT NULL DEFAULT ''active''
        CHECK (status IN (''active'', ''checked_in'', ''cancelled'', ''refunded'')),
      qr_code         TEXT        UNIQUE,
      purchased_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      checked_in_at   TIMESTAMPTZ,
      metadata        JSONB       NOT NULL DEFAULT ''{}''::jsonb,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema, v_schema);

  -- Unique constraint: one ticket per user per event
  EXECUTE format('
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_user_event
      ON %I.tickets (user_id, event_id)
      WHERE status != ''cancelled''
  ', v_schema);

  -- =========================================================================
  -- Updated_at triggers for all tables
  -- =========================================================================
  EXECUTE format('
    CREATE TRIGGER trg_%s_users_updated_at
      BEFORE UPDATE ON %I.users
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
  ', v_schema, v_schema);

  EXECUTE format('
    CREATE TRIGGER trg_%s_events_updated_at
      BEFORE UPDATE ON %I.events
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
  ', v_schema, v_schema);

  EXECUTE format('
    CREATE TRIGGER trg_%s_speakers_updated_at
      BEFORE UPDATE ON %I.speakers
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
  ', v_schema, v_schema);

  EXECUTE format('
    CREATE TRIGGER trg_%s_sessions_updated_at
      BEFORE UPDATE ON %I.sessions
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
  ', v_schema, v_schema);

  RAISE NOTICE 'Schema "%" created successfully with all tables.', v_schema;
END;
$$;

-- ============================================================================
-- Companion function: Drop an org schema (used on org deletion)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.drop_org_schema(p_schema_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  IF v_schema IS NULL OR v_schema = '' THEN
    RAISE EXCEPTION 'Invalid schema name: %', p_schema_name;
  END IF;

  -- Safety: never allow dropping public, auth, or storage schemas
  IF v_schema IN ('public', 'auth', 'storage', 'extensions', 'graphql', 'graphql_public', 'realtime', 'supabase_functions') THEN
    RAISE EXCEPTION 'Cannot drop protected schema: %', v_schema;
  END IF;

  EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', v_schema);
  RAISE NOTICE 'Schema "%" dropped.', v_schema;
END;
$$;
