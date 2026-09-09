-- ============================================================================
-- Migration: Fix Discovery Security Gaps (Landing) — per Postgres Best Practices
-- Keep debug logging (atob JWT) as requested, only harden DB security
-- References: security-rls-basics, security-rls-performance, query-partial-indexes
-- ============================================================================

-- 1. Enable RLS on public.discovery_events (if not already) — security-rls-basics
--    Without RLS, Data API exposure (breaking change 2026-04-28) would allow
--    anon to bypass the 3-flag filter (is_super_enabled/published/blocked).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'discovery_events' AND rowsecurity
  ) THEN
    ALTER TABLE public.discovery_events ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

ALTER TABLE public.discovery_events FORCE ROW LEVEL SECURITY;

-- 2. Public read policy — only published & enabled & not blocked rows visible
--    Use TO anon, authenticated with USING (no WITH CHECK needed for SELECT)
--    Wrap no functions, so no (select ...) needed, but keep partial index for perf
DROP POLICY IF EXISTS "public can read published discovery" ON public.discovery_events;
CREATE POLICY "public can read published discovery"
ON public.discovery_events FOR SELECT
TO anon, authenticated
USING (
  is_super_enabled = true
  AND is_org_published = true
  AND is_super_blocked = false
);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated → default deny.
-- Writes must go via SECURITY DEFINER RPCs (org_save/publish) which bypass RLS
-- but now include explicit auth checks below.

-- 3. Partial index for filtered queries — query-partial-indexes
--    Existing idx_discovery_events_published covers 3 flags, add composite partial
--    for common Landing query: WHERE published + ORDER BY start_date, category
CREATE INDEX IF NOT EXISTS idx_discovery_events_public_published
ON public.discovery_events (start_date, category)
WHERE is_super_enabled = true AND is_org_published = true AND is_super_blocked = false;

-- Covering index for get_discovery_event by slug when published
CREATE INDEX IF NOT EXISTS idx_discovery_events_slug_published
ON public.discovery_events (org_slug)
WHERE is_super_enabled = true AND is_org_published = true AND is_super_blocked = false;

-- 4. Ensure plans table (Landing builder) has RLS for anon read of active plans
--    Landing does from("plans").select().eq("is_active",true) as anon
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='plans') THEN
    -- Enable RLS if not enabled (security-rls-basics)
    IF EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='plans' AND NOT rowsecurity
    ) THEN
      EXECUTE 'ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY';
      EXECUTE 'ALTER TABLE public.plans FORCE ROW LEVEL SECURITY';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='plans' AND policyname='anon can read active plans') THEN
      EXECUTE 'CREATE POLICY "anon can read active plans" ON public.plans FOR SELECT TO anon, authenticated USING (is_active = true)';
    END IF;
    -- Partial index for active plans (query-partial-indexes)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='plans' AND indexname='idx_plans_active_price') THEN
      EXECUTE 'CREATE INDEX idx_plans_active_price ON public.plans (price_cents) WHERE is_active = true';
    END IF;
  END IF;
END $$;

-- 5. Harden SECURITY DEFINER org RPCs — must verify caller belongs to org
--    Per security-rls-performance: always check auth inside SECURITY DEFINER
--    Revoke PUBLIC execute, grant to authenticated only, add org_id check

CREATE SCHEMA IF NOT EXISTS private;

-- Helper to check if caller is member of org (via Clerk JWT org_id) or super_admin
CREATE OR REPLACE FUNCTION private.is_org_member(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.slug = p_org_slug
      AND (
        o.clerk_org_id = (select auth.jwt() ->> 'org_id')
        OR EXISTS (SELECT 1 FROM public.super_admins sa WHERE sa.clerk_user_id = (select auth.jwt() ->> 'sub'))
        OR o.owner_clerk_id = (select auth.jwt() ->> 'sub')
      )
  );
$$;

REVOKE EXECUTE ON FUNCTION private.is_org_member(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_org_member(TEXT) TO authenticated;

-- Patch org_save_discovery_card (16_social_links_website version) to require auth
CREATE OR REPLACE FUNCTION public.org_save_discovery_card(
  p_org_slug TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_start_time TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_pricing TEXT DEFAULT 'free',
  p_official_website_url TEXT DEFAULT NULL,
  p_social_links JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_name TEXT;
  v_webapp_url TEXT;
  v_id UUID;
BEGIN
  -- Auth check: must be org member or super admin (security-rls-performance)
  IF NOT private.is_org_member(p_org_slug) THEN
    RAISE EXCEPTION 'Forbidden: not a member of org %', p_org_slug;
  END IF;

  SELECT o.name INTO v_org_name FROM public.organizations o WHERE o.slug = p_org_slug;
  IF v_org_name IS NULL THEN RAISE EXCEPTION 'Organization not found: %', p_org_slug; END IF;
  v_webapp_url := '/c/' || p_org_slug;
  INSERT INTO public.discovery_events (
    org_slug, org_name, title, description, category,
    start_date, end_date, start_time, location, logo_url,
    pricing, webapp_url, official_website_url, social_links
  ) VALUES (
    p_org_slug, v_org_name, p_title, p_description, p_category,
    p_start_date, p_end_date, p_start_time, p_location, p_logo_url,
    p_pricing, v_webapp_url, p_official_website_url, p_social_links
  )
  ON CONFLICT (org_slug) DO UPDATE SET
    title               = COALESCE(p_title, discovery_events.title),
    description         = p_description,
    category            = COALESCE(p_category, discovery_events.category),
    start_date          = COALESCE(p_start_date, discovery_events.start_date),
    end_date            = COALESCE(p_end_date, discovery_events.end_date),
    start_time          = p_start_time,
    location            = p_location,
    logo_url            = p_logo_url,
    pricing             = COALESCE(p_pricing, discovery_events.pricing),
    webapp_url          = v_webapp_url,
    official_website_url = p_official_website_url,
    social_links        = COALESCE(p_social_links, discovery_events.social_links),
    updated_at          = now()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Patch publish/unpublish to require auth
CREATE OR REPLACE FUNCTION public.org_publish_discovery_card(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT private.is_org_member(p_org_slug) THEN RAISE EXCEPTION 'Forbidden: not a member of org %', p_org_slug; END IF;
  UPDATE public.discovery_events
  SET is_org_published = true, updated_at = now()
  WHERE org_slug = p_org_slug AND is_super_enabled = true AND is_super_blocked = false;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_unpublish_discovery_card(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT private.is_org_member(p_org_slug) THEN RAISE EXCEPTION 'Forbidden: not a member of org %', p_org_slug; END IF;
  UPDATE public.discovery_events SET is_org_published = false, updated_at = now() WHERE org_slug = p_org_slug;
  RETURN FOUND;
END;
$$;

-- Keep public discovery reads open to anon (Landing public browsing)
-- Explicitly grant execute to anon, authenticated for public RPCs
GRANT EXECUTE ON FUNCTION public.list_discovery_events() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_discovery_categories() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_discovery_event(TEXT) TO anon, authenticated;

-- Restrict org RPCs to authenticated only
REVOKE EXECUTE ON FUNCTION public.org_save_discovery_card(TEXT,TEXT,TEXT,TEXT,DATE,DATE,TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_save_discovery_card(TEXT,TEXT,TEXT,TEXT,DATE,DATE,TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.org_publish_discovery_card(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_publish_discovery_card(TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.org_unpublish_discovery_card(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_unpublish_discovery_card(TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.org_get_discovery_card(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_get_discovery_card(TEXT) TO authenticated;

-- 6. Privilege hardening — revoke default public access on discovery_events
--    (security-privileges) — already forced RLS, but also revoke table grants
REVOKE ALL ON TABLE public.discovery_events FROM PUBLIC;
GRANT SELECT ON TABLE public.discovery_events TO anon, authenticated;
-- No INSERT/UPDATE/DELETE grant — must use RPCs
