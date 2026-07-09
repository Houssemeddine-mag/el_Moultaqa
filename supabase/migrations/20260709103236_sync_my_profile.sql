-- ============================================================================
-- Migration 019: sync_my_profile
-- ============================================================================
-- Called from the Landing app after org creation to store the admin's
-- email and full name that were collected during sign-up / profile completion.
--
-- Uses auth.jwt() to identify the caller, so the caller must be signed in
-- with a valid session (not anon / service_role).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_my_profile(
  p_email     TEXT,
  p_full_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id TEXT := auth.jwt() ->> 'sub';
  v_schema  TEXT;
BEGIN
  -- No-op for unauthenticated callers
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOR v_schema IN
    SELECT schema_name FROM public.organizations
    WHERE owner_clerk_id = v_user_id
  LOOP
    EXECUTE format(
      'UPDATE %I.users SET email = $1, full_name = $2, updated_at = now() WHERE clerk_user_id = $3',
      v_schema
    ) USING p_email, p_full_name, v_user_id;
  END LOOP;
END;
$$;
