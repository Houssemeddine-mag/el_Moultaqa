-- ============================================================================
-- Migration 015: Mobile Build Rollback, Logging & VersionCode
-- ============================================================================

-- 1. Add rollback slot and build counter to public.organizations
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS prev_app_url TEXT,
  ADD COLUMN IF NOT EXISTS build_number INTEGER DEFAULT 0;

-- 2. Build logs table for observability
CREATE TABLE IF NOT EXISTS public.mobile_build_logs (
  id BIGSERIAL PRIMARY KEY,
  org_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('building', 'ready', 'failed')),
  duration_seconds INTEGER,
  error_message TEXT,
  app_url TEXT,
  build_number INTEGER,
  triggered_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Update set_mobile_build_result to save previous URL and track build_number
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
  v_old_url TEXT;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RAISE EXCEPTION 'Organization not found: %', p_org_slug;
  END IF;

  IF p_success THEN
    -- Save current URL before overwriting
    v_old_url := v_org.mobile_app_url;

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
      prev_app_url = COALESCE(v_old_url, prev_app_url),
      mobile_built_at = now(),
      mobile_config_hash = v_hash,
      mobile_build_status = 'ready',
      mobile_build_error = NULL,
      build_number = COALESCE(build_number, 0) + 1
    WHERE slug = p_org_slug;

    -- Log the successful build
    INSERT INTO public.mobile_build_logs
      (org_slug, status, app_url, build_number, triggered_by)
    VALUES
      (p_org_slug, 'ready', p_app_url, COALESCE(v_org.build_number, 0) + 1, 'github_actions');
  ELSE
    UPDATE public.organizations
    SET
      mobile_build_status = 'failed',
      mobile_build_requested_at = NULL,
      mobile_build_error = p_error
    WHERE slug = p_org_slug;

    -- Log the failed build
    INSERT INTO public.mobile_build_logs
      (org_slug, status, error_message, build_number, triggered_by)
    VALUES
      (p_org_slug, 'failed', p_error, COALESCE(v_org.build_number, 0), 'github_actions');
  END IF;
END;
$$;

-- 4. New RPC: restore previous build
CREATE OR REPLACE FUNCTION public.restore_mobile_build(p_org_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cur_url  TEXT;
  v_prev_url TEXT;
  v_org public.organizations;
  v_requesting_user TEXT;
  v_requesting_org TEXT;
BEGIN
  v_requesting_user := auth.jwt() ->> 'sub';
  v_requesting_org  := auth.jwt() ->> 'org_id';
  IF v_requesting_user IS NULL OR v_requesting_org IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'org_not_found');
  END IF;

  IF v_org.clerk_org_id != v_requesting_org THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden_org_mismatch');
  END IF;

  IF v_org.prev_app_url IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_previous_build');
  END IF;

  UPDATE public.organizations
  SET
    mobile_app_url = prev_app_url,
    prev_app_url = v_org.mobile_app_url,
    mobile_build_status = 'ready',
    updated_at = now()
  WHERE slug = p_org_slug;

  RETURN jsonb_build_object(
    'ok', true,
    'app_url', v_org.prev_app_url,
    'previous_app_url', v_org.mobile_app_url
  );
END;
$$;

-- 5. New RPC: log a build event manually (for GHA or Edge Function callbacks)
CREATE OR REPLACE FUNCTION public.log_mobile_build(
  p_org_slug TEXT,
  p_status TEXT,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_app_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org public.organizations;
  v_build_number INTEGER;
  v_triggered_by TEXT;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'org_not_found');
  END IF;

  v_triggered_by := COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    'system'
  );

  INSERT INTO public.mobile_build_logs
    (org_slug, status, duration_seconds, error_message, app_url, build_number, triggered_by)
  VALUES
    (p_org_slug, p_status, p_duration_seconds, p_error_message, p_app_url,
     COALESCE(v_org.build_number, 0), v_triggered_by)
  RETURNING build_number INTO v_build_number;

  RETURN jsonb_build_object('ok', true, 'build_number', v_build_number);
END;
$$;

-- 6. Update get_mobile_build_status to expose prev_app_url and build_number
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
  v_requesting_user := auth.jwt() ->> 'sub';
  v_requesting_org  := auth.jwt() ->> 'org_id';
  IF v_requesting_user IS NULL OR v_requesting_org IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF v_org.clerk_org_id != v_requesting_org THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'status', v_org.mobile_build_status,
    'app_url', v_org.mobile_app_url,
    'prev_app_url', v_org.prev_app_url,
    'built_at', v_org.mobile_built_at,
    'config_hash', v_org.mobile_config_hash,
    'error', v_org.mobile_build_error,
    'requested_at', v_org.mobile_build_requested_at,
    'build_number', v_org.build_number
  );
END;
$$;
