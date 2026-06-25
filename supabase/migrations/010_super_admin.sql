-- ============================================================================
-- Migration 010: Super Admin Support
-- ============================================================================
-- Adds a super_admins table and security-definer RPC functions that allow
-- designated platform administrators to manage organizations, plans, and
-- cross-tenant data.
--
-- Each RPC function first validates that the calling user (via Clerk JWT sub
-- claim) is listed in public.super_admins before executing.
-- When no JWT is present (anonymous / dev mode), access is granted so the
-- SuperAdmin app works without authentication during development.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Super admins table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT
);

-- Seed initial super admins by inserting from owner_clerk_id of existing orgs
INSERT INTO public.super_admins (clerk_user_id, email, full_name)
SELECT o.owner_clerk_id, 'admin@elmoultaqa.com', 'Platform Owner'
FROM public.organizations o
WHERE NOT EXISTS (SELECT 1 FROM public.super_admins)
LIMIT 1;

-- ---------------------------------------------------------------------------
-- 2. Super admin check (used by all subsequent RPCs)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins
    WHERE clerk_user_id = (auth.jwt() ->> 'sub')
       OR email = (auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. List all organizations with plan + user/event counts
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_list_orgs()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  schema_name TEXT,
  owner_clerk_id TEXT,
  logo_url TEXT,
  registration_mode TEXT,
  plan_id UUID,
  plan_name TEXT,
  plan_display_name TEXT,
  plan_status TEXT,
  user_count BIGINT,
  event_count BIGINT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_schema TEXT;
  v_user_sql TEXT;
  v_event_sql TEXT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  FOR id, name, slug, schema_name, owner_clerk_id, logo_url, registration_mode, plan_id, plan_name, plan_display_name, plan_status, created_at IN
    SELECT
      o.id, o.name, o.slug, o.schema_name, o.owner_clerk_id, o.logo_url,
      o.registration_mode,
      p.id, p.name, p.display_name, s.status,
      o.created_at
    FROM public.organizations o
    LEFT JOIN LATERAL (
      SELECT * FROM public.subscriptions
      WHERE organization_id = o.id
      ORDER BY created_at DESC
      LIMIT 1
    ) s ON true
    LEFT JOIN public.plans p ON p.id = s.plan_id
    ORDER BY o.created_at DESC
  LOOP
    BEGIN
      v_user_sql := format('SELECT COUNT(*) FROM %I.users', schema_name);
      EXECUTE v_user_sql INTO user_count;
    EXCEPTION WHEN OTHERS THEN
      user_count := 0;
    END;

    BEGIN
      v_event_sql := format('SELECT COUNT(*) FROM %I.events', schema_name);
      EXECUTE v_event_sql INTO event_count;
    EXCEPTION WHEN OTHERS THEN
      event_count := 0;
    END;

    RETURN NEXT;
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. Platform-wide statistics
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_get_stats()
RETURNS TABLE (
  total_orgs BIGINT,
  total_users BIGINT,
  total_events BIGINT,
  total_sessions BIGINT,
  active_orgs BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org RECORD;
  v_count BIGINT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  SELECT COUNT(*) INTO total_orgs FROM public.organizations;
  SELECT COUNT(*) INTO active_orgs FROM public.organizations o
    WHERE EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.organization_id = o.id AND s.status = 'active');

  total_users := 0;
  total_events := 0;
  total_sessions := 0;

  FOR v_org IN SELECT schema_name FROM public.organizations
  LOOP
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.users', v_org.schema_name) INTO v_count;
      total_users := total_users + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.events', v_org.schema_name) INTO v_count;
      total_events := total_events + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.sessions', v_org.schema_name) INTO v_count;
      total_sessions := total_sessions + v_count;
    EXCEPTION WHEN OTHERS THEN END;
  END LOOP;

  RETURN NEXT;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Create a new organization (admin-level, without payment)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_create_org(
  p_name TEXT,
  p_slug TEXT,
  p_admin_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clerk_id TEXT;
  v_schema_name TEXT;
  v_org_id UUID;
  v_plan_id UUID;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  v_schema_name := 'org_' || regexp_replace(p_slug, '[^a-zA-Z0-9_]', '_', 'g');

  SELECT id INTO v_plan_id FROM public.plans WHERE name = 'free' LIMIT 1;
  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'No free plan found. Seed plans first.';
  END IF;

  PERFORM public.provision_org_schema(p_slug, v_schema_name, p_name);

  INSERT INTO public.organizations (clerk_org_id, name, slug, schema_name, owner_clerk_id)
  VALUES (v_schema_name, p_name, p_slug, v_schema_name, 'super_admin')
  RETURNING id INTO v_org_id;

  INSERT INTO public.subscriptions (organization_id, plan_id, status, current_period_start, current_period_end)
  VALUES (v_org_id, v_plan_id, 'active', now(), (now() + interval '1 year'));

  EXECUTE format(
    'INSERT INTO %I.users (clerk_user_id, email, full_name, role) VALUES ($1, $2, $3, $4)',
    v_schema_name
  ) USING v_schema_name || '_admin', p_admin_email, 'Admin', 'admin';

  RETURN jsonb_build_object(
    'org_id', v_org_id,
    'schema_name', v_schema_name,
    'slug', p_slug,
    'name', p_name
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. List all pricing plans
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_list_plans()
RETURNS TABLE (
  id UUID,
  name TEXT,
  display_name TEXT,
  max_events INT,
  max_speakers INT,
  max_sessions INT,
  price_cents INT,
  currency TEXT,
  features JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, display_name, max_events, max_speakers, max_sessions,
         price_cents, currency, features, is_active, created_at
  FROM public.plans
  ORDER BY price_cents ASC, display_name ASC;
$$;

-- ---------------------------------------------------------------------------
-- 7. Upsert a pricing plan (insert or update)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_upsert_plan(
  p_id UUID DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_display_name TEXT DEFAULT NULL,
  p_max_events INT DEFAULT 1,
  p_max_speakers INT DEFAULT 5,
  p_max_sessions INT DEFAULT 10,
  p_price_cents INT DEFAULT 0,
  p_currency TEXT DEFAULT 'DZD',
  p_features JSONB DEFAULT '{}',
  p_is_active BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  IF p_id IS NOT NULL THEN
    UPDATE public.plans SET
      name = COALESCE(p_name, name),
      display_name = COALESCE(p_display_name, display_name),
      max_events = COALESCE(p_max_events, max_events),
      max_speakers = COALESCE(p_max_speakers, max_speakers),
      max_sessions = COALESCE(p_max_sessions, max_sessions),
      price_cents = COALESCE(p_price_cents, price_cents),
      currency = COALESCE(p_currency, currency),
      features = COALESCE(p_features, features),
      is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_id
    RETURNING id INTO v_id;
  ELSE
    INSERT INTO public.plans (name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features, is_active)
    VALUES (p_name, p_display_name, p_max_events, p_max_speakers, p_max_sessions, p_price_cents, p_currency, p_features, p_is_active)
    RETURNING id INTO v_id;
  END IF;

  RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- 8. Toggle plan active/inactive
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_toggle_plan(
  p_plan_id UUID,
  p_is_active BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  UPDATE public.plans SET is_active = p_is_active WHERE id = p_plan_id;
  RETURN p_is_active;
END;
$$;

-- ---------------------------------------------------------------------------
-- 9. Delete a pricing plan
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_delete_plan(
  p_plan_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub_count BIGINT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  SELECT COUNT(*) INTO v_sub_count FROM public.subscriptions
    WHERE plan_id = p_plan_id AND status = 'active';

  IF v_sub_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete plan: % active subscription(s) use it. Deactivate the plan instead.', v_sub_count;
  END IF;

  DELETE FROM public.plans WHERE id = p_plan_id;
  RETURN true;
END;
$$;

-- ============================================================================
-- 10. Dashboard chart data — plan distribution, org growth, top orgs, etc.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.super_admin_get_chart_data()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_plan_dist JSONB;
  v_reg_mode_dist JSONB;
  v_org_growth JSONB;
  v_top_orgs JSONB;
  v_org RECORD;
  v_month TEXT;
  v_count BIGINT;
  v_growth JSONB;
  v_plan_name TEXT;
  v_plan_count BIGINT;
  v_mode TEXT;
  v_mode_count BIGINT;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  -- Plan distribution
  SELECT jsonb_agg(jsonb_build_object('name', COALESCE(p.display_name, 'None'), 'count', COALESCE(ps.c, 0)))
  FROM (
    SELECT s.plan_id, COUNT(*) AS c FROM public.subscriptions s WHERE s.status = 'active' GROUP BY s.plan_id
  ) ps
  RIGHT JOIN public.plans p ON p.id = ps.plan_id
  INTO v_plan_dist;

  -- Registration mode distribution
  SELECT jsonb_agg(jsonb_build_object('mode', COALESCE(o.registration_mode, 'unknown'), 'count', o.c))
  FROM (
    SELECT COALESCE(registration_mode, 'public') AS registration_mode, COUNT(*) AS c
    FROM public.organizations GROUP BY registration_mode
  ) o INTO v_reg_mode_dist;

  -- Org growth (orgs created per month, last 12 months)
  SELECT jsonb_agg(jsonb_build_object('month', o.month, 'count', o.c) ORDER BY o.month)
  FROM (
    SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*) AS c
    FROM public.organizations
    WHERE created_at >= now() - interval '12 months'
    GROUP BY month
  ) o INTO v_growth;

  -- Top orgs by user count
  SELECT jsonb_agg(jsonb_build_object('name', o.name, 'slug', o.slug, 'users', public.organization_users(o.schema_name)) ORDER BY public.organization_users(o.schema_name) DESC)
  FROM public.organizations o
  LIMIT 5 INTO v_top_orgs;

  -- Build result
  v_result := jsonb_build_object(
    'plan_distribution', COALESCE(v_plan_dist, '[]'::JSONB),
    'registration_modes', COALESCE(v_reg_mode_dist, '[]'::JSONB),
    'org_growth', COALESCE(v_growth, '[]'::JSONB),
    'top_orgs', COALESCE(v_top_orgs, '[]'::JSONB)
  );

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.organization_users(p_schema TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v BIGINT;
BEGIN
  EXECUTE format('SELECT COUNT(*) FROM %I.users', p_schema) INTO v;
  RETURN v;
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$$;

-- ============================================================================
-- 11. Generic org data access for super admins
-- ============================================================================
-- These functions let super admins query, insert, update, and delete data in
-- any organization's schema without needing the org-specific JWT claim.

-- 11a. Query
CREATE OR REPLACE FUNCTION public.super_admin_org_query(
  p_schema TEXT,
  p_table TEXT,
  p_filters JSONB DEFAULT '{}',
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0,
  p_order_by TEXT DEFAULT 'created_at',
  p_order_dir TEXT DEFAULT 'DESC'
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sql TEXT;
  v_result JSONB;
  v_key TEXT;
  v_val TEXT;
  v_conditions TEXT[] := '{}'::TEXT[];
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  -- Build WHERE clause from filters
  FOR v_key, v_val IN SELECT * FROM jsonb_each_text(p_filters)
  LOOP
    v_conditions := array_append(v_conditions, format('%I = %L', v_key, v_val));
  END LOOP;

  v_sql := format(
    'SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), ''[]''::jsonb) FROM (SELECT * FROM %I.%I',
    p_schema, p_table
  );

  IF array_length(v_conditions, 1) > 0 THEN
    v_sql := v_sql || ' WHERE ' || array_to_string(v_conditions, ' AND ');
  END IF;

  v_sql := v_sql || format(' ORDER BY %I %s LIMIT %s OFFSET %s) t', p_order_by, p_order_dir, p_limit, p_offset);

  EXECUTE v_sql INTO v_result;
  RETURN v_result;
END;
$$;

-- 11b. Insert
CREATE OR REPLACE FUNCTION public.super_admin_org_insert(
  p_schema TEXT,
  p_table TEXT,
  p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cols TEXT;
  v_vals TEXT;
  v_result JSONB;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  SELECT string_agg(quote_ident(key), ', '),
         string_agg(
           CASE jsonb_typeof(p_data -> key)
             WHEN 'string'  THEN quote_literal(p_data ->> key)
             WHEN 'number'  THEN (p_data ->> key)
             WHEN 'true'    THEN 'true'
             WHEN 'false'   THEN 'false'
             WHEN 'null'    THEN 'NULL'
             WHEN 'object'  THEN quote_literal((p_data -> key)::text)
             WHEN 'array'   THEN quote_literal((p_data -> key)::text)
             ELSE quote_literal(p_data ->> key)
           END, ', ')
  INTO v_cols, v_vals
  FROM jsonb_object_keys(p_data) AS key;

  EXECUTE format(
    'INSERT INTO %I.%I (%s) VALUES (%s) RETURNING row_to_json(%I)::jsonb',
    p_schema, p_table, v_cols, v_vals, p_table
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- 11c. Update
CREATE OR REPLACE FUNCTION public.super_admin_org_update(
  p_schema TEXT,
  p_table TEXT,
  p_id UUID,
  p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_set TEXT;
  v_result JSONB;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  SELECT string_agg(
    format('%I = %s', key,
      CASE jsonb_typeof(p_data -> key)
        WHEN 'string'  THEN quote_literal(p_data ->> key)
        WHEN 'number'  THEN (p_data ->> key)
        WHEN 'true'    THEN 'true'
        WHEN 'false'   THEN 'false'
        WHEN 'null'    THEN 'NULL'
        WHEN 'object'  THEN quote_literal((p_data -> key)::text)
        WHEN 'array'   THEN quote_literal((p_data -> key)::text)
        ELSE quote_literal(p_data ->> key)
      END
    ), ', ')
  INTO v_set
  FROM jsonb_object_keys(p_data) AS key;

  EXECUTE format(
    'UPDATE %I.%I SET %s WHERE id = %L RETURNING row_to_json(%I)::jsonb',
    p_schema, p_table, v_set, p_id, p_table
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- 11d. Delete
CREATE OR REPLACE FUNCTION public.super_admin_org_delete(
  p_schema TEXT,
  p_table TEXT,
  p_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  EXECUTE format('DELETE FROM %I.%I WHERE id = %L', p_schema, p_table, p_id);
  RETURN true;
END;
$$;
