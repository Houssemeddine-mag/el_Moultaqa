-- Cancel stale mobile build — production-grade fix for stuck "building" status
-- Allows org admin to reset building → failed when GitHub never callback'd
-- Mirrors 014 logic: only org member / super admin can cancel, and only if stale (>15m)

CREATE OR REPLACE FUNCTION public.cancel_stale_mobile_build(p_org_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org public.organizations;
  v_is_member BOOLEAN;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE slug = p_org_slug;
  IF v_org.id IS NULL THEN RETURN false; END IF;

  -- Must be org member or super admin (same check as private.is_org_member)
  SELECT EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.slug = p_org_slug AND (
      o.clerk_org_id = (select auth.jwt() ->> 'org_id')
      OR EXISTS (SELECT 1 FROM public.super_admins sa WHERE sa.clerk_user_id = (select auth.jwt() ->> 'sub'))
      OR o.owner_clerk_id = (select auth.jwt() ->> 'sub')
    )
  ) INTO v_is_member;
  IF NOT v_is_member THEN RAISE EXCEPTION 'Forbidden: not a member of org %', p_org_slug; END IF;

  -- Only cancel if currently building and stale (>15 min, matches 014 threshold)
  UPDATE public.organizations
  SET mobile_build_status = 'failed',
      mobile_build_error = 'Build cancelled — stale building status auto-reset after 20m with no callback. You can retry.',
      mobile_build_requested_at = NULL
  WHERE slug = p_org_slug
    AND mobile_build_status = 'building'
    AND mobile_build_requested_at <= now() - interval '15 minutes';

  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_stale_mobile_build(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_stale_mobile_build(TEXT) TO authenticated;
