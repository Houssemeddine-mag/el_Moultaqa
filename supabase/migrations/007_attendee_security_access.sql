-- ============================================================================
-- Migration 007: Attendee Security Access & Decoupled RLS/RPC Policies
-- ============================================================================
-- Updates org_query, org_insert, org_update, and org_delete to support
-- public attendee access without requiring Clerk organization membership.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Function: public.org_query (REPLACE)
-- ---------------------------------------------------------------------------
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
  v_allowed_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets'];
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_requesting_user TEXT;
  v_query TEXT;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name is in the allowed list
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Validate order direction
  IF p_order_dir NOT IN ('ASC', 'DESC', 'asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid order direction: %', p_order_dir;
  END IF;

  -- Verify schema exists and get its clerk_org_id
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  -- Verify user is authenticated
  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- 1. If the user is a member of the organization, they have full access to query any table in this schema.
  IF v_requesting_org IS NOT NULL AND v_requesting_org = v_org_clerk_id THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.%I ORDER BY %I %s LIMIT $1 OFFSET $2) t',
      v_schema, v_table, p_order_by, p_order_dir
    )
    INTO v_result
    USING p_limit, p_offset;
    RETURN v_result;
  END IF;

  -- 2. If the user is an attendee (not in the org):
  -- A. Read public tables: events, sessions, speakers
  IF v_table IN ('events', 'sessions', 'speakers') THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.%I ORDER BY %I %s LIMIT $1 OFFSET $2) t',
      v_schema, v_table, p_order_by, p_order_dir
    )
    INTO v_result
    USING p_limit, p_offset;
    RETURN v_result;
  END IF;

  -- B. Read users table (only own profile)
  IF v_table = 'users' THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (SELECT * FROM %I.users WHERE clerk_user_id = $3 LIMIT $1 OFFSET $2) t',
      v_schema
    )
    INTO v_result
    USING p_limit, p_offset, v_requesting_user;
    RETURN v_result;
  END IF;

  -- C. Read tickets table (only own tickets)
  IF v_table = 'tickets' THEN
    EXECUTE format(
      'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
       FROM (
         SELECT t.* FROM %1$I.tickets t
         JOIN %1$I.users u ON t.user_id = u.id
         WHERE u.clerk_user_id = $3
         LIMIT $1 OFFSET $2
       ) t',
      v_schema
    )
    INTO v_result
    USING p_limit, p_offset, v_requesting_user;
    RETURN v_result;
  END IF;

  RAISE EXCEPTION 'Access denied: unauthorized query';
END;
$$;


-- ---------------------------------------------------------------------------
-- Function: public.org_insert (REPLACE)
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
  v_requesting_user TEXT;
  v_columns TEXT;
  v_query TEXT;
  v_user_uuid UUID;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify schema exists and get its clerk_org_id
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  -- Verify user is authenticated
  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Authorize: if user is not in the org, they can only write to users or tickets table for themselves
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    IF v_table = 'users' THEN
      IF p_data ->> 'clerk_user_id' IS NULL OR p_data ->> 'clerk_user_id' != v_requesting_user THEN
        RAISE EXCEPTION 'Access denied: cannot insert profile for another user';
      END IF;
    ELSIF v_table = 'tickets' THEN
      -- Resolve user uuid from users table
      EXECUTE format(
        'SELECT id FROM %I.users WHERE clerk_user_id = $1',
        v_schema
      ) INTO v_user_uuid USING v_requesting_user;

      IF v_user_uuid IS NULL OR (p_data ->> 'user_id')::uuid != v_user_uuid THEN
        RAISE EXCEPTION 'Access denied: cannot register ticket for another user';
      END IF;
    ELSE
      RAISE EXCEPTION 'Access denied: you do not have permission to write to this table';
    END IF;
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
-- Function: public.org_update (REPLACE)
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
  v_requesting_user TEXT;
  v_authorized BOOLEAN;
  v_set_clause TEXT;
  v_query TEXT;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify schema exists and get its clerk_org_id
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  -- Verify user is authenticated
  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Authorize: if user is not in the org, they can only write to users or tickets table for themselves
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    IF v_table = 'users' THEN
      EXECUTE format(
        'SELECT EXISTS (SELECT 1 FROM %I.users WHERE id = $1 AND clerk_user_id = $2)',
        v_schema
      ) INTO v_authorized USING p_id, v_requesting_user;

      IF NOT coalesce(v_authorized, false) THEN
        RAISE EXCEPTION 'Access denied: cannot update profile for another user';
      END IF;
    ELSIF v_table = 'tickets' THEN
      EXECUTE format(
        'SELECT EXISTS (
           SELECT 1 FROM %1$I.tickets t
           JOIN %1$I.users u ON t.user_id = u.id
           WHERE t.id = $1 AND u.clerk_user_id = $2
         )',
        v_schema
      ) INTO v_authorized USING p_id, v_requesting_user;

      IF NOT coalesce(v_authorized, false) THEN
        RAISE EXCEPTION 'Access denied: cannot update ticket for another user';
      END IF;
    ELSE
      RAISE EXCEPTION 'Access denied: you do not have permission to write to this table';
    END IF;
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
-- Function: public.org_delete (REPLACE)
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
  v_requesting_user TEXT;
  v_authorized BOOLEAN;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify schema exists and get its clerk_org_id
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  -- Verify user is authenticated
  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Authorize: if user is not in the org, they can only write to users or tickets table for themselves
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    IF v_table = 'tickets' THEN
      EXECUTE format(
        'SELECT EXISTS (
           SELECT 1 FROM %1$I.tickets t
           JOIN %1$I.users u ON t.user_id = u.id
           WHERE t.id = $1 AND u.clerk_user_id = $2
         )',
        v_schema
      ) INTO v_authorized USING p_id, v_requesting_user;

      IF NOT coalesce(v_authorized, false) THEN
        RAISE EXCEPTION 'Access denied: cannot delete ticket for another user';
      END IF;
    ELSE
      RAISE EXCEPTION 'Access denied: you do not have permission to delete from this table';
    END IF;
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
