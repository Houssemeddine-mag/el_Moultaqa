-- ============================================================================
-- Migration 014: Organization Branding RPC
-- ============================================================================
-- Adds a security-definer RPC so org admins can update the organization name
-- and logo URL from the admin Settings page. These values are stored in the
-- public.organizations table and are consumed by the webapp (brand header,
-- favicon, discovery cards, etc.).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- RPC: update_org_branding
-- Updates the name and/or logo_url of the caller's organization.
-- Only org admins (members of the org's Clerk org) can call this.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_org_branding(
  p_slug      TEXT,
  p_name      TEXT DEFAULT NULL,
  p_logo_url  TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_clerk_id TEXT;
  v_requesting_org TEXT;
  v_updates JSONB := '{}';
BEGIN
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

  -- Build dynamic UPDATE
  IF p_name IS NOT NULL THEN
    UPDATE public.organizations SET name = p_name WHERE slug = p_slug;
    v_updates := jsonb_set(v_updates, '{name}', to_jsonb(p_name));
  END IF;

  IF p_logo_url IS NOT NULL THEN
    UPDATE public.organizations SET logo_url = p_logo_url WHERE slug = p_slug;
    v_updates := jsonb_set(v_updates, '{logo_url}', to_jsonb(p_logo_url));
  END IF;

  -- Return the updated values
  RETURN jsonb_build_object(
    'slug', p_slug,
    'updated', v_updates
  );
END;
$$;
