-- ============================================================================
-- Migration 009: Notifications & Stream Questions Tables
-- ============================================================================
-- Adds two new tables to every org schema:
--   notifications  — push/live announcements from admins to attendees
--   questions      — attendee questions submitted during live streams
--
-- Also patches:
--   create_org_schema()  — adds both tables to new org schema creation
--   org_query()          — adds both tables to the allowed list
--   org_insert()         — adds both tables to the allowed list
--   org_delete()         — adds notifications to the allowed admin list
-- ============================================================================

-- ============================================================================
-- 1. Patch existing org schemas — add tables to any already-created schemas
-- ============================================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schema_name FROM public.organizations
  LOOP
    -- notifications table
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
    ', r.schema_name, r.schema_name);

    -- questions table
    EXECUTE format('
      CREATE TABLE IF NOT EXISTS %I.questions (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name TEXT        NOT NULL DEFAULT ''Attendee'',
        clerk_user_id TEXT,
        message     TEXT        NOT NULL,
        is_answered BOOLEAN     NOT NULL DEFAULT false,
        is_pinned   BOOLEAN     NOT NULL DEFAULT false,
        session_id  UUID        REFERENCES %I.sessions(id) ON DELETE SET NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    ', r.schema_name, r.schema_name);

    -- updated_at trigger for notifications
    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%s_notifications_updated_at
        BEFORE UPDATE ON %I.notifications
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()
    ', r.schema_name, r.schema_name);

    RAISE NOTICE ''Added notifications/questions tables to schema: %'', r.schema_name;
  END LOOP;
END;
$$;


-- ============================================================================
-- 2. Patch create_org_schema() to include the new tables for future orgs
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_org_schema(p_schema_name TEXT)
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

  -- tickets
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
  EXECUTE format('
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_user_event
      ON %I.tickets (user_id, event_id)
      WHERE status != ''cancelled''
  ', v_schema);

  -- notifications (NEW)
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

  -- questions (NEW)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.questions (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      author_name   TEXT        NOT NULL DEFAULT ''Attendee'',
      clerk_user_id TEXT,
      message       TEXT        NOT NULL,
      is_answered   BOOLEAN     NOT NULL DEFAULT false,
      is_pinned     BOOLEAN     NOT NULL DEFAULT false,
      session_id    UUID        REFERENCES %I.sessions(id) ON DELETE SET NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  ', v_schema, v_schema);

  -- updated_at triggers
  EXECUTE format('CREATE TRIGGER trg_%s_users_updated_at BEFORE UPDATE ON %I.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_events_updated_at BEFORE UPDATE ON %I.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_speakers_updated_at BEFORE UPDATE ON %I.speakers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_sessions_updated_at BEFORE UPDATE ON %I.sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);
  EXECUTE format('CREATE TRIGGER trg_%s_notifications_updated_at BEFORE UPDATE ON %I.notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', v_schema, v_schema);

  RAISE NOTICE 'Schema "%" created successfully with all tables.', v_schema;
END;
$$;


-- ============================================================================
-- 3. Patch org_query to allow querying notifications and questions
-- ============================================================================
CREATE OR REPLACE FUNCTION public.org_query(
  p_schema_name TEXT,
  p_table_name  TEXT,
  p_filters     JSONB DEFAULT '{}'::jsonb,
  p_limit       INT DEFAULT 100,
  p_offset      INT DEFAULT 0,
  p_order_by    TEXT DEFAULT 'created_at',
  p_order_dir   TEXT DEFAULT 'DESC'
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_table  TEXT;
  v_result JSONB;
  -- Added notifications and questions to allowed list
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets', 'notifications', 'questions'];
  v_public_tables  TEXT[] := ARRAY['events', 'sessions', 'speakers', 'notifications', 'questions'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_requesting_user TEXT;
  v_is_registered BOOLEAN;
  v_query TEXT;
  v_filter_clause TEXT := '';
  v_filter_key TEXT;
  v_filter_val TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table  := lower(regexp_replace(p_table_name,  '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  IF p_order_dir NOT IN ('ASC', 'DESC', 'asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid order direction: %', p_order_dir;
  END IF;

  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org  := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Build filter clause from p_filters JSONB (simple equality only)
  IF p_filters IS NOT NULL AND p_filters != '{}'::jsonb THEN
    FOR v_filter_key, v_filter_val IN
      SELECT key, value #>> '{}' FROM jsonb_each(p_filters)
      WHERE key ~ '^[a-zA-Z_][a-zA-Z0-9_]*$'
    LOOP
      v_filter_clause := v_filter_clause ||
        format(' AND %I = %L', v_filter_key, v_filter_val);
    END LOOP;
  END IF;

  -- Org members: full access
  IF v_requesting_org IS NOT NULL AND v_requesting_org = v_org_clerk_id THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.%I WHERE true %s ORDER BY %I %s LIMIT $1 OFFSET $2) t',
      v_schema, v_table, v_filter_clause, p_order_by, p_order_dir
    )
    INTO v_result
    USING p_limit, p_offset;
    RETURN v_result;
  END IF;

  -- Attendees: read public tables if registered member
  IF v_table = ANY(v_public_tables) THEN
    -- Verify they are a registered attendee in this schema
    EXECUTE format(
      'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
      v_schema
    ) INTO v_is_registered USING v_requesting_user;

    IF NOT v_is_registered THEN
      RAISE EXCEPTION 'Access denied: you are not registered for this organization';
    END IF;

    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.%I WHERE true %s ORDER BY %I %s LIMIT $1 OFFSET $2) t',
      v_schema, v_table, v_filter_clause, p_order_by, p_order_dir
    )
    INTO v_result
    USING p_limit, p_offset;
    RETURN v_result;
  END IF;

  -- Attendees: own user profile
  IF v_table = 'users' THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.users WHERE clerk_user_id = $1 %s LIMIT $2 OFFSET $3) t',
      v_schema, v_filter_clause
    )
    INTO v_result
    USING v_requesting_user, p_limit, p_offset;
    RETURN v_result;
  END IF;

  -- Attendees: own tickets
  IF v_table = 'tickets' THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (
         SELECT tk.* FROM %I.tickets tk
         JOIN %I.users u ON u.id = tk.user_id
         WHERE u.clerk_user_id = $1 %s
         ORDER BY %I %s LIMIT $2 OFFSET $3
       ) t',
      v_schema, v_schema, v_filter_clause, p_order_by, p_order_dir
    )
    INTO v_result
    USING v_requesting_user, p_limit, p_offset;
    RETURN v_result;
  END IF;

  RAISE EXCEPTION 'Access denied for table %', p_table_name;
END;
$$;


-- ============================================================================
-- 4. Patch org_insert to allow inserting questions (attendees) and
--    notifications (admins only)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.org_insert(
  p_schema_name TEXT,
  p_table_name  TEXT,
  p_data        JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_table  TEXT;
  v_result JSONB;
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets', 'notifications', 'questions'];
  v_admin_only_tables TEXT[] := ARRAY['events', 'sessions', 'speakers', 'notifications'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_requesting_user TEXT;
  v_is_registered BOOLEAN;
  v_columns TEXT;
  v_query TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table  := lower(regexp_replace(p_table_name,  '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org  := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Admin-only tables: must be org member
  IF v_table = ANY(v_admin_only_tables) THEN
    IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
      RAISE EXCEPTION 'Access denied: you do not belong to this organization';
    END IF;
  END IF;

  -- questions: any registered attendee can insert
  IF v_table = 'questions' THEN
    EXECUTE format(
      'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
      v_schema
    ) INTO v_is_registered USING v_requesting_user;

    IF NOT v_is_registered AND (v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org) THEN
      RAISE EXCEPTION 'Access denied: you are not registered for this organization';
    END IF;
  END IF;

  -- users table: allow self-insert only (for registration flow)
  IF v_table = 'users' THEN
    IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
      -- Attendee self-insert: clerk_user_id must match caller
      IF (p_data->>'clerk_user_id') IS DISTINCT FROM v_requesting_user THEN
        RAISE EXCEPTION 'Access denied: you can only register yourself';
      END IF;
    END IF;
  END IF;

  SELECT string_agg(quote_ident(key), ', ')
  INTO v_columns
  FROM jsonb_each(p_data)
  WHERE key ~ '^[a-zA-Z_][a-zA-Z0-9_]*$';

  IF v_columns IS NULL OR v_columns = '' THEN
    RAISE EXCEPTION 'No valid data columns provided for insert';
  END IF;

  v_query := format(
    'INSERT INTO %1$I.%2$I (%3$s)
     SELECT %3$s FROM jsonb_populate_record(NULL::%1$I.%2$I, $1)
     RETURNING row_to_json(%1$I.%2$I.*)::jsonb',
    v_schema, v_table, v_columns
  );

  EXECUTE v_query INTO v_result USING p_data;
  RETURN v_result;
END;
$$;


-- ============================================================================
-- 5. Patch org_delete to allow deleting notifications (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.org_delete(
  p_schema_name TEXT,
  p_table_name  TEXT,
  p_id          UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_table  TEXT;
  v_result JSONB;
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets', 'notifications', 'questions'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table  := lower(regexp_replace(p_table_name,  '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org := public.requesting_org_id();

  IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
    RAISE EXCEPTION 'Access denied: you do not belong to this organization';
  END IF;

  EXECUTE format(
    'DELETE FROM %I.%I t WHERE t.id = $1 RETURNING row_to_json(t.*)::jsonb',
    v_schema, v_table
  )
  INTO v_result USING p_id;

  RETURN v_result;
END;
$$;
