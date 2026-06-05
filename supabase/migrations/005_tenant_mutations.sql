-- ============================================================================
-- Migration 005: Secure Tenant Schema Mutation RPCs & Initialization
-- ============================================================================
-- These functions enable client-side CRUD operations on isolated Postgres
-- tenant schemas. They validate ownership based on the active Clerk JWT org_id,
-- validate the target tables against a strict whitelist, and dynamically cast
-- inputs using jsonb_populate_record for type safety.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Function: public.org_insert
-- Securely inserts a record into an authorized organization table.
-- ---------------------------------------------------------------------------
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
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_columns TEXT;
  v_query TEXT;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name (prevent SQL injection)
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify the requesting user belongs to this organization
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org := public.requesting_org_id();

  IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
    RAISE EXCEPTION 'Access denied: you do not belong to this organization';
  END IF;

  -- Build safe columns list from JSONB payload keys
  SELECT string_agg(quote_ident(key), ', ')
  INTO v_columns
  FROM jsonb_each(p_data)
  WHERE key ~ '^[a-zA-Z_][a-zA-Z0-9_]*$';

  IF v_columns IS NULL OR v_columns = '' THEN
    RAISE EXCEPTION 'No valid data columns provided for insert';
  END IF;

  -- Construct and execute the insert statement
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

-- ---------------------------------------------------------------------------
-- Function: public.org_update
-- Securely updates a record by ID inside an authorized organization table.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.org_update(
  p_schema_name TEXT,
  p_table_name  TEXT,
  p_id          UUID,
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
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_set_clause TEXT;
  v_query TEXT;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name (prevent SQL injection)
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify the requesting user belongs to this organization
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org := public.requesting_org_id();

  IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
    RAISE EXCEPTION 'Access denied: you do not belong to this organization';
  END IF;

  -- Build safe set clause from JSONB keys (excluding primary key id)
  SELECT string_agg(format('%1$I = s.%1$I', key), ', ')
  INTO v_set_clause
  FROM jsonb_each(p_data)
  WHERE key ~ '^[a-zA-Z_][a-zA-Z0-9_]*$' AND key != 'id';

  IF v_set_clause IS NULL OR v_set_clause = '' THEN
    RAISE EXCEPTION 'No valid columns to update';
  END IF;

  -- Construct and execute the update statement
  v_query := format(
    'UPDATE %1$I.%2$I t
     SET %3$s
     FROM jsonb_populate_record(NULL::%1$I.%2$I, $1) s
     WHERE t.id = $2
     RETURNING row_to_json(t.*)::jsonb',
    v_schema, v_table, v_set_clause
  );

  EXECUTE v_query INTO v_result USING p_data, p_id;
  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------------
-- Function: public.org_delete
-- Securely deletes a record by ID inside an authorized organization table.
-- ---------------------------------------------------------------------------
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
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name (prevent SQL injection)
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify the requesting user belongs to this organization
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org := public.requesting_org_id();

  IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
    RAISE EXCEPTION 'Access denied: you do not belong to this organization';
  END IF;

  -- Construct and execute the delete statement
  EXECUTE format(
    'DELETE FROM %I.%I t WHERE t.id = $1 RETURNING row_to_json(t.*)::jsonb',
    v_schema, v_table
  )
  INTO v_result USING p_id;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------------
-- Function: public.create_initial_event
-- Securely inserts the initial event row inside the schema on creator's behalf.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_initial_event(
  p_clerk_org_id TEXT,
  p_title        TEXT,
  p_short_name   TEXT,
  p_theme_color  TEXT,
  p_logo_url     TEXT,
  p_start_date   DATE,
  p_end_date     DATE,
  p_sponsors     JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_owner_id TEXT;
  v_event_id UUID;
  v_user_uuid UUID;
BEGIN
  -- Resolve schema name and owner clerk ID
  SELECT schema_name, owner_clerk_id INTO v_schema, v_owner_id
  FROM public.organizations
  WHERE clerk_org_id = p_clerk_org_id;

  IF v_schema IS NULL THEN
    RAISE EXCEPTION 'Organization not found for Clerk ID %', p_clerk_org_id;
  END IF;

  -- Verify ownership
  IF v_owner_id != public.requesting_user_id() THEN
    RAISE EXCEPTION 'Access denied: you are not the owner of this organization';
  END IF;

  -- Ensure the owner user exists in the schema's users table.
  EXECUTE format('
    SELECT id FROM %I.users WHERE clerk_user_id = $1
  ', v_schema)
  INTO v_user_uuid
  USING v_owner_id;

  -- If for some reason the user doesn't exist, we insert them as admin
  IF v_user_uuid IS NULL THEN
    SELECT public._internal_insert_org_user(v_schema, v_owner_id, '', '', 'admin') INTO v_user_uuid;
  END IF;

  -- Insert the event
  EXECUTE format('
    INSERT INTO %I.events (title, short_name, start_date, end_date, cover_image_url, settings, created_by, status)
    VALUES ($1, $2, $3, $4, $5, jsonb_build_object(''themeColor'', $6, ''sponsors'', $7), $8, ''published'')
    RETURNING id
  ', v_schema)
  INTO v_event_id
  USING p_title, p_short_name, p_start_date, p_end_date, p_logo_url, p_theme_color, p_sponsors, v_user_uuid;

  RETURN v_event_id;
END;
$$;
