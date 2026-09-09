-- Netflix-style org selector: list all orgs where current user is member (owner or attendee)
-- Filtered: only not-disabled (blocked_at IS NULL) orgs appear

CREATE OR REPLACE FUNCTION public.list_my_organizations()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  logo_url TEXT,
  schema_name TEXT,
  role TEXT,
  blocked_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clerk_user_id TEXT;
  v_org public.organizations;
  v_role TEXT;
  v_exists BOOLEAN;
BEGIN
  v_clerk_user_id := (select auth.jwt() ->> 'sub');
  IF v_clerk_user_id IS NULL THEN
    RETURN;
  END IF;

  FOR v_org IN SELECT * FROM public.organizations WHERE blocked_at IS NULL ORDER BY created_at DESC LOOP
    v_role := NULL;

    -- Owner is always admin
    IF v_org.owner_clerk_id = v_clerk_user_id THEN
      v_role := 'owner';
    ELSE
      -- Check users table in org schema for membership
      BEGIN
        EXECUTE format('SELECT role FROM %I.users WHERE clerk_user_id = %L LIMIT 1', v_org.schema_name, v_clerk_user_id) INTO v_role;
      EXCEPTION WHEN OTHERS THEN
        v_role := NULL;
      END;
    END IF;

    -- Only return orgs where user has a role (owner or attendee/admin/etc)
    IF v_role IS NOT NULL THEN
      id := v_org.id;
      name := v_org.name;
      slug := v_org.slug;
      logo_url := v_org.logo_url;
      schema_name := v_org.schema_name;
      role := v_role;
      blocked_at := v_org.blocked_at;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.list_my_organizations() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_organizations() TO authenticated;

-- Also add helper for disabled check: ensure list_discovery already filters blocked, but for org selector we already filter blocked_at IS NULL above
