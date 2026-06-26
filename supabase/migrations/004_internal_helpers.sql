-- ============================================================================
-- Migration 004: Internal Helper Functions
-- ============================================================================
-- Utility functions used by Edge Functions to interact with dynamic schemas.
-- These are SECURITY DEFINER functions — only callable by service_role.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Insert a user into a dynamic org schema
-- Used by the clerk-webhook Edge Function when provisioning an org.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._internal_insert_org_user(
  p_schema_name  TEXT,
  p_clerk_user_id TEXT,
  p_email        TEXT,
  p_full_name    TEXT,
  p_role         TEXT DEFAULT 'attendee'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_user_id UUID;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  IF v_schema IS NULL OR v_schema = '' THEN
    RAISE EXCEPTION 'Invalid schema name: %', p_schema_name;
  END IF;

  EXECUTE format('
    INSERT INTO %I.users (clerk_user_id, email, full_name, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      updated_at = now()
    RETURNING id
  ', v_schema)
  INTO v_user_id
  USING p_clerk_user_id, p_email, p_full_name, p_role;

  RETURN v_user_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Resolve an org slug to its schema name
-- Used by the frontend (via RPC) to resolve path-prefix routing.
-- e.g. /c/my-conference → schema_name = "org_2abc123"
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.resolve_org_slug(p_slug TEXT)
RETURNS TABLE (
  organization_id UUID,
  clerk_org_id    TEXT,
  name            TEXT,
  schema_name     TEXT,
  logo_url        TEXT,
  blocked         BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, clerk_org_id, name, schema_name, logo_url,
         blocked_at IS NOT NULL AS blocked
  FROM public.organizations
  WHERE slug = p_slug
    AND (blocked_at IS NULL OR auth.jwt() ->> 'sub' IN (
      SELECT clerk_user_id FROM public.super_admins
    ))
  LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- Query data from a dynamic org schema
-- Generic function that allows the frontend to query any table in the
-- resolved org schema. Used via supabase.rpc().
--
-- IMPORTANT: This function validates the schema ownership against the JWT
-- so it cannot be used to access another org's data.
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
BEGIN
  -- Sanitize inputs
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));
  v_table := lower(regexp_replace(p_table_name, '[^a-z0-9_]', '_', 'g'));

  -- Validate table name is in the allowed list (prevent SQL injection)
  IF NOT (v_table = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table "%" is not allowed', p_table_name;
  END IF;

  -- Validate order direction
  IF p_order_dir NOT IN ('ASC', 'DESC', 'asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid order direction: %', p_order_dir;
  END IF;

  -- Verify the requesting user belongs to this org
  SELECT clerk_org_id INTO v_org_clerk_id
  FROM public.organizations
  WHERE schema_name = v_schema;

  v_requesting_org := public.requesting_org_id();

  IF v_org_clerk_id IS NULL OR v_org_clerk_id != v_requesting_org THEN
    RAISE EXCEPTION 'Access denied: you do not belong to this organization';
  END IF;

  -- Execute the query
  EXECUTE format(
    'SELECT coalesce(jsonb_agg(row_to_json(t.*)), ''[]''::jsonb)
     FROM (SELECT * FROM %I.%I ORDER BY %I %s LIMIT $1 OFFSET $2) t',
    v_schema, v_table, p_order_by, p_order_dir
  )
  INTO v_result
  USING p_limit, p_offset;

  RETURN v_result;
END;
$$;
