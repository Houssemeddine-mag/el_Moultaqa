-- ============================================================================
-- Migration 008: Gated Organization Registration
-- ============================================================================
-- Enforces strict tenant user isolation:
--   • Users can ONLY access an org's data if they exist in that org's users table
--   • Orgs choose between PUBLIC (anyone with the link) or PRIVATE (code required)
--   • New register_attendee() RPC is the ONLY way for non-org-members to join
--   • org_query/org_insert/org_update/org_delete updated to enforce membership
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Schema changes: Add registration columns to public.organizations
-- ---------------------------------------------------------------------------
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS registration_mode TEXT NOT NULL DEFAULT 'public'
    CHECK (registration_mode IN ('public', 'private'));

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS registration_code TEXT;

-- ---------------------------------------------------------------------------
-- 2. RPC: get_org_public_info
-- Returns minimal info for the auth page. No membership required.
-- Does NOT expose registration_code, schema_name, or clerk_org_id.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_org_public_info(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'name', o.name,
    'slug', o.slug,
    'registration_mode', o.registration_mode,
    'logo_url', o.logo_url
  )
  INTO v_result
  FROM public.organizations o
  WHERE o.slug = p_slug;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Organization not found for slug: %', p_slug;
  END IF;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. RPC: register_attendee
-- The ONLY way for a non-org-member to join an organization.
-- Checks registration_mode and verifies code for private orgs.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_attendee(
  p_slug              TEXT,
  p_clerk_user_id     TEXT,
  p_email             TEXT,
  p_full_name         TEXT DEFAULT '',
  p_registration_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_record RECORD;
  v_schema TEXT;
  v_existing_user JSONB;
  v_new_user JSONB;
  v_requesting_user TEXT;
BEGIN
  -- 1. Verify the caller is the user they claim to be
  v_requesting_user := public.requesting_user_id();
  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  IF v_requesting_user != p_clerk_user_id THEN
    RAISE EXCEPTION 'Access denied: cannot register as another user';
  END IF;

  -- 2. Resolve the org from the slug
  SELECT id, clerk_org_id, name, schema_name, registration_mode, registration_code
  INTO v_org_record
  FROM public.organizations
  WHERE slug = p_slug;

  IF v_org_record IS NULL THEN
    RAISE EXCEPTION 'Organization not found for slug: %', p_slug;
  END IF;

  v_schema := v_org_record.schema_name;

  -- 3. Check if user is already registered in this org
  EXECUTE format(
    'SELECT row_to_json(u.*)::jsonb FROM %I.users u WHERE u.clerk_user_id = $1',
    v_schema
  ) INTO v_existing_user USING p_clerk_user_id;

  IF v_existing_user IS NOT NULL THEN
    -- Already registered — return existing user
    RETURN jsonb_build_object(
      'success', true,
      'already_registered', true,
      'user', v_existing_user
    );
  END IF;

  -- 4. Check registration mode
  IF v_org_record.registration_mode = 'private' THEN
    -- Private org: verify registration code
    IF p_registration_code IS NULL OR p_registration_code = '' THEN
      RAISE EXCEPTION 'Registration code is required for this private conference';
    END IF;

    IF v_org_record.registration_code IS NULL OR
       upper(trim(p_registration_code)) != upper(trim(v_org_record.registration_code)) THEN
      RAISE EXCEPTION 'Invalid registration code';
    END IF;
  END IF;
  -- Public org: no code check needed

  -- 5. Insert the user as an attendee
  EXECUTE format(
    'INSERT INTO %I.users (clerk_user_id, email, full_name, role)
     VALUES ($1, $2, $3, ''attendee'')
     RETURNING row_to_json(%I.users.*)::jsonb',
    v_schema, v_schema
  ) INTO v_new_user USING p_clerk_user_id, p_email, p_full_name;

  RETURN jsonb_build_object(
    'success', true,
    'already_registered', false,
    'user', v_new_user
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. RPC: update_registration_settings
-- Admin-only: updates registration mode and code for an org.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_registration_settings(
  p_slug              TEXT,
  p_registration_mode TEXT,
  p_registration_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_result JSONB;
BEGIN
  -- Validate mode
  IF p_registration_mode NOT IN ('public', 'private') THEN
    RAISE EXCEPTION 'Invalid registration mode: %. Must be "public" or "private".', p_registration_mode;
  END IF;

  -- Look up the org
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE slug = p_slug;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization not found for slug: %', p_slug;
  END IF;

  -- Verify the requesting user is an admin of this org
  v_requesting_org := public.requesting_org_id();
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    RAISE EXCEPTION 'Access denied: you are not an admin of this organization';
  END IF;

  -- Update the settings
  UPDATE public.organizations
  SET registration_mode = p_registration_mode,
      registration_code = p_registration_code,
      updated_at = now()
  WHERE slug = p_slug
  RETURNING jsonb_build_object(
    'slug', slug,
    'registration_mode', registration_mode,
    'registration_code', registration_code
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. REPLACE org_query — enforce user membership for attendees
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
  v_is_registered BOOLEAN;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Validate order direction
  IF p_order_dir NOT IN ('ASC', 'DESC', 'asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid order direction: %', p_order_dir;
  END IF;

  -- Verify schema exists
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

  -- PATH 1: Org member (admin) — full access
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

  -- PATH 2: Attendee — must be registered in this org's users table
  EXECUTE format(
    'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
    v_schema
  ) INTO v_is_registered USING v_requesting_user;

  IF NOT coalesce(v_is_registered, false) THEN
    RAISE EXCEPTION 'Access denied: you are not a registered user of this organization. Use the registration link to join.';
  END IF;

  -- Registered attendee: scoped access
  -- A. Public tables: events, sessions, speakers (full read)
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

  -- B. Users table: own profile only
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

  -- C. Tickets table: own tickets only
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
-- 6. REPLACE org_insert — block direct user self-registration
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
  v_is_registered BOOLEAN;
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Verify schema exists
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Authorize
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    -- Non-org-member (attendee)

    -- BLOCK: direct user self-registration — must use register_attendee()
    IF v_table = 'users' THEN
      RAISE EXCEPTION 'Access denied: use register_attendee() to join this organization';
    END IF;

    -- Verify membership before allowing any other operation
    EXECUTE format(
      'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
      v_schema
    ) INTO v_is_registered USING v_requesting_user;

    IF NOT coalesce(v_is_registered, false) THEN
      RAISE EXCEPTION 'Access denied: you are not a registered user of this organization';
    END IF;

    -- Tickets: can only insert for yourself
    IF v_table = 'tickets' THEN
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

  -- Execute insert
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
-- 7. REPLACE org_update — add membership gate for attendees
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
  v_is_registered BOOLEAN;
  v_set_clause TEXT;
  v_query TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Non-org-member: verify membership + scoped access
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    -- Must be registered
    EXECUTE format(
      'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
      v_schema
    ) INTO v_is_registered USING v_requesting_user;

    IF NOT coalesce(v_is_registered, false) THEN
      RAISE EXCEPTION 'Access denied: you are not a registered user of this organization';
    END IF;

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

  -- Build SET clause
  SELECT string_agg(format('%1$I = s.%1$I', key), ', ')
  INTO v_set_clause
  FROM jsonb_each(p_data)
  WHERE key ~ '^[a-zA-Z_][a-zA-Z0-9_]*$' AND key != 'id';

  IF v_set_clause IS NULL OR v_set_clause = '' THEN
    RAISE EXCEPTION 'No valid columns to update';
  END IF;

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
-- 8. REPLACE org_delete — add membership gate for attendees
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
  v_is_registered BOOLEAN;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  IF v_org_clerk_id IS NULL THEN
    RAISE EXCEPTION 'Organization schema not found';
  END IF;

  v_requesting_org := public.requesting_org_id();
  v_requesting_user := public.requesting_user_id();

  IF v_requesting_user IS NULL THEN
    RAISE EXCEPTION 'Access denied: user is not authenticated';
  END IF;

  -- Non-org-member: verify membership + scoped access
  IF v_requesting_org IS NULL OR v_requesting_org != v_org_clerk_id THEN
    -- Must be registered
    EXECUTE format(
      'SELECT EXISTS (SELECT 1 FROM %I.users WHERE clerk_user_id = $1)',
      v_schema
    ) INTO v_is_registered USING v_requesting_user;

    IF NOT coalesce(v_is_registered, false) THEN
      RAISE EXCEPTION 'Access denied: you are not a registered user of this organization';
    END IF;

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

  -- Execute delete
  EXECUTE format(
    'DELETE FROM %I.%I t WHERE t.id = $1 RETURNING row_to_json(t.*)::jsonb',
    v_schema, v_table
  )
  INTO v_result USING p_id;

  RETURN v_result;
END;
$$;
