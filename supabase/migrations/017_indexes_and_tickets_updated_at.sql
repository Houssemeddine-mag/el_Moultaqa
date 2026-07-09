-- ============================================================================
-- Migration 017: Missing indexes & tickets updated_at
-- ============================================================================
-- Adds performance indexes for notifications, questions, and feedback tables
-- (which lacked indexes on commonly filtered/sorted columns).
-- Also adds updated_at column and trigger to tickets (was missing).
-- Patches create_org_schema() for future schemas.
-- ============================================================================

-- ============================================================================
-- 1. Patch existing org schemas
-- ============================================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schema_name FROM public.organizations
  LOOP
    -- tickets: add updated_at column if missing
    EXECUTE format('
      ALTER TABLE %I.tickets
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    ', r.schema_name);

    -- tickets: add updated_at trigger if missing
    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_tickets_updated_at
        BEFORE UPDATE ON %I.tickets
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    -- notifications: index on created_at for sorting
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_notifications_created_at
        ON %I.notifications (created_at DESC)
    ', r.schema_name, r.schema_name);

    -- notifications: index on type for filtering
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_notifications_type
        ON %I.notifications (type)
    ', r.schema_name, r.schema_name);

    -- questions: index on session_id for joining/filtering
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_questions_session_id
        ON %I.questions (session_id)
    ', r.schema_name, r.schema_name);

    -- questions: index on created_at for sorting
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_questions_created_at
        ON %I.questions (created_at DESC)
    ', r.schema_name, r.schema_name);

    -- questions: index on clerk_user_id for user lookups
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_questions_clerk_user_id
        ON %I.questions (clerk_user_id)
    ', r.schema_name, r.schema_name);

    -- feedback: index on created_at for sorting
    EXECUTE format('
      CREATE INDEX IF NOT EXISTS idx_%s_feedback_created_at
        ON %I.feedback (created_at DESC)
    ', r.schema_name, r.schema_name);

    RAISE NOTICE 'Added indexes and tickets updated_at in schema: %', r.schema_name;
  END LOOP;
END;
$$;


-- ============================================================================
-- 2. Patch create_org_schema() for future schemas
-- ============================================================================
-- Replaces the function to include tickets updated_at and all missing indexes.

CREATE OR REPLACE FUNCTION public.create_org_schema(p_schema_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_schema TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  IF v_schema IS NULL OR v_schema = '' THEN
    RAISE EXCEPTION 'Invalid schema name: %', p_schema_name;
  END IF;

  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

  -- users
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
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON %I.users (clerk_user_id)', v_schema);

  -- events
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

  -- speakers
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

  -- sessions
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
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON %I.sessions (event_id)', v_schema);

  -- tickets (now with updated_at)
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
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema, v_schema);
  EXECUTE format('
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_user_event
      ON %I.tickets (user_id, event_id)
      WHERE status != ''cancelled''
  ', v_schema);

  -- notifications
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.notifications (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT        NOT NULL,
      message     TEXT        NOT NULL,
      type        TEXT        NOT NULL DEFAULT ''info''
        CHECK (type IN (''info'', ''warning'', ''urgent'', ''session'')),
      is_pinned   BOOLEAN     NOT NULL DEFAULT false,
      created_by  UUID        REFERENCES %I.users(id) ON DELETE SET NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_notifications_created_at ON %I.notifications (created_at DESC)', v_schema, v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_notifications_type ON %I.notifications (type)', v_schema, v_schema);

  -- questions (with updated_at)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.questions (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      author_name   TEXT        NOT NULL DEFAULT ''Attendee'',
      clerk_user_id TEXT,
      message       TEXT        NOT NULL,
      is_answered   BOOLEAN     NOT NULL DEFAULT false,
      is_pinned     BOOLEAN     NOT NULL DEFAULT false,
      session_id    UUID        REFERENCES %I.sessions(id) ON DELETE SET NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_session_id ON %I.questions (session_id)', v_schema, v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_created_at ON %I.questions (created_at DESC)', v_schema, v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_clerk_user_id ON %I.questions (clerk_user_id)', v_schema, v_schema);

  -- feedback (with updated_at)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.feedback (
      id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      session_title       TEXT,
      presenter_rating    NUMERIC(2,1),
      presentation_rating NUMERIC(2,1),
      comment             TEXT,
      user_email          TEXT,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_feedback_created_at ON %I.feedback (created_at DESC)', v_schema, v_schema);

  -- updated_at triggers
  EXECUTE format('CREATE TRIGGER trg_%s_users_updated_at BEFORE UPDATE ON %I.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_events_updated_at BEFORE UPDATE ON %I.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_speakers_updated_at BEFORE UPDATE ON %I.speakers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_sessions_updated_at BEFORE UPDATE ON %I.sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_tickets_updated_at BEFORE UPDATE ON %I.tickets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_notifications_updated_at BEFORE UPDATE ON %I.notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_questions_updated_at BEFORE UPDATE ON %I.questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_feedback_updated_at BEFORE UPDATE ON %I.feedback FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);

  RAISE NOTICE 'Schema "%" created successfully with all tables.', v_schema;
END;
$$;
