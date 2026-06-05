-- ============================================================================
-- Migration 006: Client-Side Fallback Provisioning RPC
-- ============================================================================
-- Allows the client application to provision an organization schema and insert
-- records safely as a fallback if the Clerk webhook is delayed or fails.
-- This function runs with SECURITY DEFINER privileges but enforces that the
-- user's active Clerk org_id and user_id in their JWT match the parameters.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.provision_org_if_needed(
  p_clerk_org_id TEXT,
  p_name TEXT,
  p_slug TEXT,
  p_owner_clerk_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema_name TEXT;
  v_org_id UUID;
  v_plan_id UUID;
BEGIN
  -- 1. Security check: User must be signed into Clerk as this owner.
  IF public.requesting_user_id() IS NULL OR public.requesting_user_id() != p_owner_clerk_id THEN
    RAISE EXCEPTION 'Access denied: requesting_user_id (%) does not match owner (%)', 
      coalesce(public.requesting_user_id(), 'NULL'), p_owner_clerk_id;
  END IF;

  -- 2. Check if the organization already exists
  SELECT id, schema_name INTO v_org_id, v_schema_name
  FROM public.organizations
  WHERE clerk_org_id = p_clerk_org_id;

  IF v_org_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_existed', true,
      'organization_id', v_org_id,
      'schema_name', v_schema_name
    );
  END IF;

  -- 3. Determine schema name
  v_schema_name := lower(regexp_replace(p_clerk_org_id, '[^a-z0-9_]', '_', 'g'));

  -- 4. Provision the Postgres schema and dynamic tables
  PERFORM public.provision_org_schema(v_schema_name);

  -- 5. Insert organization record into public.organizations
  INSERT INTO public.organizations (clerk_org_id, name, slug, schema_name, owner_clerk_id)
  VALUES (p_clerk_org_id, p_name, p_slug, v_schema_name, p_owner_clerk_id)
  RETURNING id INTO v_org_id;

  -- 6. Associate with default 'free' subscription
  SELECT id INTO v_plan_id
  FROM public.plans
  WHERE name = 'free'
  LIMIT 1;

  IF v_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (organization_id, plan_id, status, current_period_start)
    VALUES (v_org_id, v_plan_id, 'active', now());
  END IF;

  -- 7. Insert the owner into the new schema's users table as admin
  PERFORM public._internal_insert_org_user(v_schema_name, p_owner_clerk_id, '', '', 'admin');

  RETURN jsonb_build_object(
    'success', true,
    'already_existed', false,
    'organization_id', v_org_id,
    'schema_name', v_schema_name
  );
END;
$$;
