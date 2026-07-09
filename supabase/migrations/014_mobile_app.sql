-- ============================================================================
-- Migration 014: Mobile App Build Status & Integration
-- ============================================================================

-- 1. Add mobile app metadata columns to public.organizations
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS mobile_app_url TEXT,
  ADD COLUMN IF NOT EXISTS mobile_built_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mobile_config_hash TEXT,
  ADD COLUMN IF NOT EXISTS mobile_build_status TEXT NOT NULL DEFAULT 'not_built'
    CHECK (mobile_build_status IN ('not_built', 'building', 'ready', 'failed')),
  ADD COLUMN IF NOT EXISTS mobile_build_error TEXT,
  ADD COLUMN IF NOT EXISTS mobile_build_requested_at TIMESTAMPTZ;

-- 2. RPC: begin_mobile_build(p_org_slug TEXT)
-- Gated by user JWT: verifies organization membership and admin role.
CREATE OR REPLACE FUNCTION public.begin_mobile_build(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org public.organizations;
  v_requesting_org TEXT;
  v_user_role TEXT;
  v_requesting_user TEXT;
BEGIN
  -- 1. Fetch organization
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'org_not_found');
  END IF;

  -- 2. Verify organization context in JWT
  v_requesting_org := auth.jwt() ->> 'org_id';
  IF v_requesting_org IS NULL OR v_requesting_org != v_org.clerk_org_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden_org_mismatch');
  END IF;

  -- 3. Verify user is admin (check org_role claim OR check if they are the owner)
  v_user_role := auth.jwt() ->> 'org_role';
  v_requesting_user := auth.jwt() ->> 'sub';
  
  IF NOT (
    v_user_role = 'org:admin' 
    OR v_requesting_user = v_org.owner_clerk_id
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden_not_admin');
  END IF;

  -- 4+5. Atomically claim the build slot (single conditional UPDATE eliminates the TOCTOU race)
  UPDATE public.organizations
  SET
    mobile_build_status = 'building',
    mobile_build_requested_at = now(),
    mobile_build_error = NULL
  WHERE slug = p_org_slug
    AND (mobile_build_status != 'building' OR mobile_build_requested_at <= now() - interval '15 minutes');

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_building');
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- 3. RPC: set_mobile_build_result(...)
-- Called by GitHub Actions via the service role key.
CREATE OR REPLACE FUNCTION public.set_mobile_build_result(
  p_org_slug TEXT,
  p_success BOOLEAN,
  p_app_url TEXT,
  p_error TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config JSONB;
  v_hash TEXT;
  v_org public.organizations;
BEGIN
  -- Fetch org
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RAISE EXCEPTION 'Organization not found: %', p_org_slug;
  END IF;

  IF p_success THEN
    -- Validate that the schema belongs to a known organization
    IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = v_org.schema_name) THEN
      RAISE EXCEPTION 'Schema "%" does not belong to any known organization', v_org.schema_name;
    END IF;

    -- Fetch the branding themeColor dynamically from the tenant's events table
    EXECUTE format('
      SELECT jsonb_build_object(
        ''name'', %L,
        ''logo_url'', %L,
        ''theme_color'', (SELECT settings->>''themeColor'' FROM %I.events LIMIT 1)
      )
    ', v_org.name, v_org.logo_url, v_org.schema_name)
    INTO v_config;

    v_hash := encode(digest(v_config::text, 'sha256'), 'hex');

    UPDATE public.organizations
    SET
      mobile_app_url = p_app_url,
      mobile_built_at = now(),
      mobile_config_hash = v_hash,
      mobile_build_status = 'ready',
      mobile_build_error = NULL
    WHERE slug = p_org_slug;
  ELSE
    UPDATE public.organizations
    SET
      mobile_build_status = 'failed',
      mobile_build_requested_at = NULL,
      mobile_build_error = p_error
    WHERE slug = p_org_slug;
  END IF;
END;
$$;

-- 3b. Update resolve_org_slug to include mobile_app_url (now that the column exists)
-- Must drop first because the return type is changing
DROP FUNCTION IF EXISTS public.resolve_org_slug(TEXT);

CREATE OR REPLACE FUNCTION public.resolve_org_slug(p_slug TEXT)
RETURNS TABLE (
  organization_id UUID,
  clerk_org_id    TEXT,
  name            TEXT,
  schema_name     TEXT,
  logo_url        TEXT,
  blocked         BOOLEAN,
  theme_color     TEXT,
  mobile_app_url  TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, clerk_org_id, name, schema_name, logo_url,
         blocked_at IS NOT NULL AS blocked,
         theme_color,
         mobile_app_url
  FROM public.organizations
  WHERE slug = p_slug
  LIMIT 1;
$$;

-- 4. RPC: get_mobile_build_status(p_org_slug TEXT)
-- Returns build status for an org; callers MUST be authenticated via Clerk.
-- Without the auth check below, SECURITY DEFINER would let any anon-key
-- bearer enumerate every org's build state (enumeration + disclosure hole).
CREATE OR REPLACE FUNCTION public.get_mobile_build_status(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org public.organizations;
  v_requesting_user TEXT;
  v_requesting_org TEXT;
BEGIN
  -- Refuse anonymous callers (no Clerk JWT attached)
  v_requesting_user := auth.jwt() ->> 'sub';
  v_requesting_org  := auth.jwt() ->> 'org_id';
  IF v_requesting_user IS NULL OR v_requesting_org IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Ensure the caller actually belongs to this org
  IF v_org.clerk_org_id != v_requesting_org THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'status', v_org.mobile_build_status,
    'app_url', v_org.mobile_app_url,
    'built_at', v_org.mobile_built_at,
    'config_hash', v_org.mobile_config_hash,
    'error', v_org.mobile_build_error,
    'requested_at', v_org.mobile_build_requested_at
  );
END;
$$;
