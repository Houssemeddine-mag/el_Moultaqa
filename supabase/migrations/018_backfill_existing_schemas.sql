-- ============================================================================
-- Migration 018: Comprehensive backfill for existing org schemas
-- ============================================================================
-- Creates any missing tables (notifications, questions, feedback),
-- adds missing columns (tickets.updated_at), adds missing updated_at triggers,
-- and adds performance indexes — all in a single pass.
--
-- This is safe to run regardless of which intermediate migrations (009-017)
-- have been applied, since every operation uses IF NOT EXISTS / ADD COLUMN IF
-- NOT EXISTS / CREATE OR REPLACE.
-- ============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schema_name FROM public.organizations
  LOOP
    -- ========================================================================
    -- 1. notifications table (migration 009)
    -- ========================================================================
    EXECUTE format('
      CREATE TABLE IF NOT EXISTS %I.notifications (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        title       TEXT        NOT NULL,
        message     TEXT        NOT NULL,
        type        TEXT        NOT NULL DEFAULT ''info''
          CHECK (type IN (''info'', ''warning'', ''urgent'', ''session'')),
        is_pinned   BOOLEAN     NOT NULL DEFAULT false,
        created_by  UUID,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    ', r.schema_name);

    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_notifications_updated_at
        BEFORE UPDATE ON %I.notifications
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    -- ========================================================================
    -- 2. questions table (migration 009)
    -- ========================================================================
    EXECUTE format('
      CREATE TABLE IF NOT EXISTS %I.questions (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name   TEXT        NOT NULL DEFAULT ''Attendee'',
        clerk_user_id TEXT,
        message       TEXT        NOT NULL,
        is_answered   BOOLEAN     NOT NULL DEFAULT false,
        is_pinned     BOOLEAN     NOT NULL DEFAULT false,
        session_id    UUID,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    ', r.schema_name);

    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_questions_updated_at
        BEFORE UPDATE ON %I.questions
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    -- ========================================================================
    -- 3. feedback table (migration 015)
    -- ========================================================================
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
    ', r.schema_name);

    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_feedback_updated_at
        BEFORE UPDATE ON %I.feedback
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    -- ========================================================================
    -- 4. tickets.updated_at column + trigger (migration 017)
    -- ========================================================================
    EXECUTE format('
      ALTER TABLE %I.tickets
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    ', r.schema_name);

    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_tickets_updated_at
        BEFORE UPDATE ON %I.tickets
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    -- ========================================================================
    -- 5. Performance indexes (migration 017)
    -- ========================================================================
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_notifications_created_at ON %I.notifications (created_at DESC)', r.schema_name, r.schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_notifications_type ON %I.notifications (type)', r.schema_name, r.schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_session_id ON %I.questions (session_id)', r.schema_name, r.schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_created_at ON %I.questions (created_at DESC)', r.schema_name, r.schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_questions_clerk_user_id ON %I.questions (clerk_user_id)', r.schema_name, r.schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_feedback_created_at ON %I.feedback (created_at DESC)', r.schema_name, r.schema_name);

    RAISE NOTICE 'Backfilled schema: %', r.schema_name;
  END LOOP;
END;
$$;
