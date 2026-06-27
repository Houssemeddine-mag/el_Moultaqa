-- ============================================================================
-- Migration 011: Blocked orgs are visible (with blocked flag)
-- ============================================================================
-- Previously, resolve_org_slug() hid blocked orgs from non-super-admins by
-- filtering them out entirely. Now we return the org regardless, with a
-- `blocked` boolean so the frontend can show a plan-renewal message instead
-- of a generic "not found" error.
-- ============================================================================

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
  LIMIT 1;
$$;
