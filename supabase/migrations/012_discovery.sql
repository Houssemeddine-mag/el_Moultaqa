-- ============================================================================
-- Migration 012: Discovery System
-- ============================================================================
-- Adds the public.discovery_events table and RPCs for the conference
-- discovery workflow. Super admins enable discovery per organization,
-- org admins customize and deploy their card, users browse at /discovery.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Discovery events table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discovery_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_slug          TEXT NOT NULL UNIQUE REFERENCES public.organizations(slug),
  org_name          TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  start_time        TEXT,
  location          TEXT,
  logo_url          TEXT,
  pricing           TEXT NOT NULL DEFAULT 'free',
  webapp_url        TEXT NOT NULL,
  is_super_enabled  BOOLEAN NOT NULL DEFAULT false,
  is_org_published  BOOLEAN NOT NULL DEFAULT false,
  is_super_blocked  BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_events_published
  ON public.discovery_events (is_super_enabled, is_org_published, is_super_blocked);

CREATE INDEX IF NOT EXISTS idx_discovery_events_category
  ON public.discovery_events (category);

-- ---------------------------------------------------------------------------
-- 2. Public RPCs (no auth needed)
-- ---------------------------------------------------------------------------

-- List published events, sorted: ongoing -> upcoming -> completed
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

-- List distinct categories
CREATE OR REPLACE FUNCTION public.list_discovery_categories()
RETURNS TABLE (category TEXT)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT DISTINCT de.category
  FROM public.discovery_events de
  WHERE de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false
  ORDER BY de.category;
$$;

-- Get single discovery event by slug
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
    (CURRENT_DATE > de.end_date) AS is_completed
  FROM public.discovery_events de
  WHERE de.org_slug = p_slug
    AND de.is_super_enabled = true
    AND de.is_org_published = true
    AND de.is_super_blocked = false;
$$;

-- ---------------------------------------------------------------------------
-- 3. Org admin RPCs (caller must belong to the org's schema)
-- ---------------------------------------------------------------------------

-- Get the org's current discovery card
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
    de.is_super_enabled,
    de.is_org_published,
    de.is_super_blocked
  FROM public.discovery_events de
  WHERE de.org_slug = p_org_slug;
$$;

-- Save/update the discovery card (does NOT publish)
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
  p_pricing TEXT DEFAULT 'free'
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
    pricing, webapp_url
  ) VALUES (
    p_org_slug, v_org_name, p_title, p_description, p_category,
    p_start_date, p_end_date, p_start_time, p_location, p_logo_url,
    p_pricing, v_webapp_url
  )
  ON CONFLICT (org_slug) DO UPDATE SET
    title           = COALESCE(p_title, discovery_events.title),
    description     = p_description,
    category        = COALESCE(p_category, discovery_events.category),
    start_date      = COALESCE(p_start_date, discovery_events.start_date),
    end_date        = COALESCE(p_end_date, discovery_events.end_date),
    start_time      = p_start_time,
    location        = p_location,
    logo_url        = p_logo_url,
    pricing         = COALESCE(p_pricing, discovery_events.pricing),
    webapp_url      = v_webapp_url,
    updated_at      = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Publish the card (set is_org_published = true)
CREATE OR REPLACE FUNCTION public.org_publish_discovery_card(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.discovery_events
  SET is_org_published = true, updated_at = now()
  WHERE org_slug = p_org_slug
    AND is_super_enabled = true
    AND is_super_blocked = false;
  RETURN found;
$$;

-- Unpublish the card (set is_org_published = false)
CREATE OR REPLACE FUNCTION public.org_unpublish_discovery_card(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.discovery_events
  SET is_org_published = false, updated_at = now()
  WHERE org_slug = p_org_slug;
  RETURN found;
$$;

-- ---------------------------------------------------------------------------
-- 4. Super admin RPCs
-- ---------------------------------------------------------------------------

-- List all orgs with their discovery status
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
    de.title,
    de.category,
    de.start_date,
    de.end_date
  FROM public.organizations o
  LEFT JOIN public.discovery_events de ON de.org_slug = o.slug
  WHERE EXISTS (SELECT 1 FROM public.super_admins WHERE clerk_user_id = (auth.jwt() ->> 'sub'))
  ORDER BY o.name;
$$;

-- Enable/disable discovery for an organization
CREATE OR REPLACE FUNCTION public.super_admin_toggle_discovery_enable(
  p_org_slug TEXT,
  p_enabled BOOLEAN
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

  INSERT INTO public.discovery_events (org_slug, org_name, title, category, start_date, end_date, pricing, webapp_url, is_super_enabled)
  SELECT
    o.slug, o.name, o.name, 'other', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 'free',
    '/c/' || o.slug, p_enabled
  FROM public.organizations o
  WHERE o.slug = p_org_slug
    AND NOT EXISTS (SELECT 1 FROM public.discovery_events WHERE org_slug = p_org_slug);

  UPDATE public.discovery_events
  SET is_super_enabled = p_enabled, updated_at = now()
  WHERE org_slug = p_org_slug;

  RETURN true;
END;
$$;

-- Block/unblock a discovery card
CREATE OR REPLACE FUNCTION public.super_admin_toggle_discovery_block(
  p_org_slug TEXT,
  p_blocked BOOLEAN
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

  UPDATE public.discovery_events
  SET is_super_blocked = p_blocked, updated_at = now()
  WHERE org_slug = p_org_slug;

  RETURN found;
END;
$$;
