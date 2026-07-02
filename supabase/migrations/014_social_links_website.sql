-- ============================================================================
-- Migration 014: Social Links & Official Website for Discovery
-- ============================================================================
-- Adds official_website_url and social_links JSONB to discovery_events,
-- and updates the RPCs to support them.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add columns to discovery_events
-- ---------------------------------------------------------------------------
ALTER TABLE public.discovery_events
  ADD COLUMN IF NOT EXISTS official_website_url TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Update org_save_discovery_card to accept new params
-- ---------------------------------------------------------------------------
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
  -- Get org name
  SELECT o.name INTO v_org_name
  FROM public.organizations o
  WHERE o.slug = p_org_slug;

  IF v_org_name IS NULL THEN
    RAISE EXCEPTION 'Organization not found: %', p_org_slug;
  END IF;

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

-- ---------------------------------------------------------------------------
-- 3. Update org_get_discovery_card to return new columns
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.org_get_discovery_card(p_org_slug TEXT)
RETURNS TABLE (
  id UUID,
  org_slug TEXT,
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
  is_super_enabled BOOLEAN,
  is_org_published BOOLEAN,
  is_super_blocked BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    de.id,
    de.org_slug,
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
    de.is_super_enabled,
    de.is_org_published,
    de.is_super_blocked
  FROM public.discovery_events de
  WHERE de.org_slug = p_org_slug;
$$;

-- ---------------------------------------------------------------------------
-- 4. Update get_discovery_event to return new columns
-- ---------------------------------------------------------------------------
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
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) AS is_ongoing,
    (CURRENT_DATE > de.end_date) AS is_completed
  FROM public.discovery_events de
  WHERE de.org_slug = p_slug
    AND de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false;
$$;

-- ---------------------------------------------------------------------------
-- 5. Update list_discovery_events to return new columns
-- ---------------------------------------------------------------------------
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
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) AS is_ongoing,
    (CURRENT_DATE > de.end_date) AS is_completed
  FROM public.discovery_events de
  WHERE de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false
  ORDER BY
    (CURRENT_DATE >= de.start_date AND CURRENT_DATE <= de.end_date) DESC,
    (CURRENT_DATE < de.start_date) DESC,
    de.start_date ASC;
$$;
