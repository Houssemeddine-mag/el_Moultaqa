-- ============================================================================
-- Migration 003: Row Level Security (RLS) Policies
-- ============================================================================
-- Enables RLS on all public schema tables and creates policies that ensure
-- each organization can only access their own data.
--
-- The JWT from Clerk (via Supabase JWT template) must contain:
--   { "org_id": "org_2abc123", "sub": "user_xxx", ... }
--
-- We read these claims via:
--   auth.jwt() ->> 'org_id'   → the Clerk organization ID
--   auth.jwt() ->> 'sub'      → the Clerk user ID
-- ============================================================================

-- =========================================================================
-- Helper: Extract org_id from the current JWT
-- =========================================================================
CREATE OR REPLACE FUNCTION public.requesting_org_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'app_metadata' ->> 'org_id'
  );
$$;

-- Helper: Extract user_id (sub) from the current JWT
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT auth.jwt() ->> 'sub';
$$;

-- =========================================================================
-- RLS: public.organizations
-- =========================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Org members can read their own organization's row
CREATE POLICY "Organizations: members can view own org"
  ON public.organizations
  FOR SELECT
  USING (clerk_org_id = public.requesting_org_id());

-- Service role (Edge Functions) can do everything — no policy needed,
-- service_role bypasses RLS by default.

-- =========================================================================
-- RLS: public.plans
-- =========================================================================
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Plans are public info — any authenticated user can view them
CREATE POLICY "Plans: authenticated users can view"
  ON public.plans
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =========================================================================
-- RLS: public.subscriptions
-- =========================================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Org members can only view their own org's subscription
CREATE POLICY "Subscriptions: members can view own org subscription"
  ON public.subscriptions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT id FROM public.organizations
      WHERE clerk_org_id = public.requesting_org_id()
    )
  );

-- =========================================================================
-- Dynamic per-org schema RLS
-- =========================================================================
-- This function is called by create_org_schema() to set up RLS on all
-- tables within a newly created org schema.
--
-- The strategy: every table in the org schema is protected by checking
-- that the requesting user's JWT org_id matches the schema's organization.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.setup_org_schema_rls(p_schema_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema TEXT;
  v_tables TEXT[] := ARRAY['users', 'events', 'sessions', 'speakers', 'tickets'];
  v_table  TEXT;
BEGIN
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  FOREACH v_table IN ARRAY v_tables
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', v_schema, v_table);

    -- SELECT policy: user's JWT org_id must match the org that owns this schema
    EXECUTE format('
      CREATE POLICY "Tenant isolation: select"
        ON %I.%I
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.organizations
            WHERE schema_name = %L
              AND clerk_org_id = public.requesting_org_id()
          )
        )
    ', v_schema, v_table, v_schema);

    -- INSERT policy: same check
    EXECUTE format('
      CREATE POLICY "Tenant isolation: insert"
        ON %I.%I
        FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.organizations
            WHERE schema_name = %L
              AND clerk_org_id = public.requesting_org_id()
          )
        )
    ', v_schema, v_table, v_schema);

    -- UPDATE policy: same check
    EXECUTE format('
      CREATE POLICY "Tenant isolation: update"
        ON %I.%I
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.organizations
            WHERE schema_name = %L
              AND clerk_org_id = public.requesting_org_id()
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.organizations
            WHERE schema_name = %L
              AND clerk_org_id = public.requesting_org_id()
          )
        )
    ', v_schema, v_table, v_schema, v_schema);

    -- DELETE policy: same check
    EXECUTE format('
      CREATE POLICY "Tenant isolation: delete"
        ON %I.%I
        FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM public.organizations
            WHERE schema_name = %L
              AND clerk_org_id = public.requesting_org_id()
          )
        )
    ', v_schema, v_table, v_schema);

  END LOOP;

  RAISE NOTICE 'RLS policies created for schema "%"', v_schema;
END;
$$;

-- =========================================================================
-- Update create_org_schema to automatically set up RLS after table creation
-- =========================================================================
-- We append RLS setup to the end of the schema creation function.
-- This is done via a wrapper that calls both functions in sequence.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.provision_org_schema(p_schema_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Step 1: Create all tables
  PERFORM public.create_org_schema(p_schema_name);

  -- Step 2: Apply RLS policies to all tables
  PERFORM public.setup_org_schema_rls(p_schema_name);

  RAISE NOTICE 'Org schema "%" fully provisioned with RLS.', p_schema_name;
END;
$$;
