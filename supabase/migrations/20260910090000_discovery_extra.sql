-- ============================================================================
-- Migration: Discovery "Extra" spotlight flag (paid pin-to-top)
-- When a conference owner pays extra, SuperAdmin marks the card Extra and it
-- sorts to the top of the Landing Discover list.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add column
-- ---------------------------------------------------------------------------
ALTER TABLE public.discovery_events
  ADD COLUMN IF NOT EXISTS is_extra BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- 2. SuperAdmin toggle (mirrors the enable/block toggle pattern)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.super_admin_toggle_discovery_extra(
  p_org_slug TEXT,
  p_extra BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.super_admins WHERE clerk_user_id = (auth.jwt() ->> 'sub')) THEN
    RAISE EXCEPTION 'Only super admins can perform this action';
  END IF;

  -- Ensure a row exists (same minimal-row pattern as the enable toggle)
  INSERT INTO public.discovery_events (org_slug, org_name, title, category, start_date, end_date, pricing, webapp_url, is_super_enabled)
  SELECT
    o.slug, o.name, o.name, 'other', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 'free',
    '/c/' || o.slug, false
  FROM public.organizations o
  WHERE o.slug = p_org_slug
    AND NOT EXISTS (SELECT 1 FROM public.discovery_events WHERE org_slug = p_org_slug);

  UPDATE public.discovery_events
  SET is_extra = p_extra, updated_at = now()
  WHERE org_slug = p_org_slug;

  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.super_admin_toggle_discovery_extra(TEXT, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.super_admin_toggle_discovery_extra(TEXT, BOOLEAN) TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Status RPC now reports the flag
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.super_admin_list_orgs_discovery_status();

CREATE OR REPLACE FUNCTION public.super_admin_list_orgs_discovery_status()
RETURNS TABLE (
  org_id UUID,
  org_name TEXT,
  org_slug TEXT,
  logo_url TEXT,
  blocked_at TIMESTAMPTZ,
  discovery_enabled BOOLEAN,
  card_published BOOLEAN,
  card_blocked BOOLEAN,
  card_extra BOOLEAN,
  card_title TEXT,
  card_category TEXT,
  card_start_date DATE,
  card_end_date DATE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.id,
    o.name,
    o.slug,
    o.logo_url,
    o.blocked_at,
    COALESCE(de.is_super_enabled, false),
    COALESCE(de.is_org_published, false),
    COALESCE(de.is_super_blocked, false),
    COALESCE(de.is_extra, false),
    de.title,
    de.category,
    de.start_date,
    de.end_date
  FROM public.organizations o
  LEFT JOIN public.discovery_events de ON de.org_slug = o.slug
  WHERE EXISTS (SELECT 1 FROM public.super_admins WHERE clerk_user_id = (auth.jwt() ->> 'sub'))
  ORDER BY o.name;
$$;

-- ---------------------------------------------------------------------------
-- 4. Public reads return the flag, Extra sorts first
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.list_discovery_events();

CREATE OR REPLACE FUNCTION public.list_discovery_events()
RETURNS TABLE (
  id UUID,
  org_slug TEXT,
  org_name TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  start_date DATE,
  end_date DATE,
  start_time TEXT,
  location TEXT,
  logo_url TEXT,
  pricing TEXT,
  webapp_url TEXT,
  official_website_url TEXT,
  social_links JSONB,
  is_extra BOOLEAN,
  is_ongoing BOOLEAN,
  is_completed BOOLEAN
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    de.id,
    de.org_slug,
    de.org_name,
    de.title,
    de.description,
    de.category,
    de.start_date,
    de.end_date,
    de.start_time,
    de.location,
    de.logo_url,
    de.pricing,
    de.webapp_url,
    de.official_website_url,
    de.social_links,
    COALESCE(de.is_extra, false),
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) AS is_ongoing,
    (CURRENT_DATE > de.end_date) AS is_completed
  FROM public.discovery_events de
  WHERE de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false
  ORDER BY
    COALESCE(de.is_extra, false) DESC,
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) DESC,
    (CURRENT_DATE < de.start_date) DESC,
    de.start_date ASC;
$$;

DROP FUNCTION IF EXISTS public.get_discovery_event(TEXT);

CREATE OR REPLACE FUNCTION public.get_discovery_event(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  org_slug TEXT,
  org_name TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  start_date DATE,
  end_date DATE,
  start_time TEXT,
  location TEXT,
  logo_url TEXT,
  pricing TEXT,
  webapp_url TEXT,
  official_website_url TEXT,
  social_links JSONB,
  is_extra BOOLEAN,
  is_ongoing BOOLEAN,
  is_completed BOOLEAN
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    de.id,
    de.org_slug,
    de.org_name,
    de.title,
    de.description,
    de.category,
    de.start_date,
    de.end_date,
    de.start_time,
    de.location,
    de.logo_url,
    de.pricing,
    de.webapp_url,
    de.official_website_url,
    de.social_links,
    COALESCE(de.is_extra, false),
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) AS is_ongoing,
    (CURRENT_DATE > de.end_date) AS is_completed
  FROM public.discovery_events de
  WHERE de.org_slug = p_slug
    AND de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false;
$$;

-- Keep the anon-readable grants from the security-hardening migration
GRANT EXECUTE ON FUNCTION public.list_discovery_events() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_discovery_event(TEXT) TO anon, authenticated;
