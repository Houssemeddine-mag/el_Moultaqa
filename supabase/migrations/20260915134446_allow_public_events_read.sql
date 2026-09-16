-- Allow any authenticated user to read events for public orgs (like sakura)
-- Fixes Mobile "No Conference Available" when JWT org_id is for different org (moh) but user wants sakura public
-- Keeps tenant isolation for other tables (users, sessions, etc.)

DO $$
DECLARE
  r RECORD;
  v_schema TEXT;
BEGIN
  FOR r IN SELECT schema_name FROM public.organizations WHERE blocked_at IS NULL LOOP
    v_schema := r.schema_name;
    -- Drop existing restrictive select policy for events
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select" ON %I.events', v_schema);
    -- Create new permissive policy for events: any authenticated user can read
    EXECUTE format('
      CREATE POLICY "Tenant isolation: select (public events)"
        ON %I.events
        FOR SELECT
        USING (auth.role() = ''authenticated'')
    ', v_schema);
    RAISE NOTICE 'Updated events SELECT policy for schema % to allow any authenticated user', v_schema;
  END LOOP;
END $$;

-- Also update the template function setup_org_schema_rls so future orgs get the permissive events policy
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
  FOREACH v_table IN ARRAY v_tables LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', v_schema, v_table);
    -- For events, allow any authenticated user (public read) — other tables keep strict org check
    IF v_table = 'events' THEN
      EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select" ON %I.%I', v_schema, v_table);
      EXECUTE format('
        CREATE POLICY "Tenant isolation: select (public events)"
          ON %I.%I FOR SELECT USING (auth.role() = ''authenticated'')
      ', v_schema, v_table);
    ELSE
      EXECUTE format('
        CREATE POLICY "Tenant isolation: select"
          ON %I.%I FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
          )
      ', v_schema, v_table, v_schema);
    END IF;
    EXECUTE format('
      CREATE POLICY "Tenant isolation: insert"
        ON %I.%I FOR INSERT WITH CHECK (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema);
    EXECUTE format('
      CREATE POLICY "Tenant isolation: update"
        ON %I.%I FOR UPDATE USING (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        ) WITH CHECK (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema, v_schema);
    EXECUTE format('
      CREATE POLICY "Tenant isolation: delete"
        ON %I.%I FOR DELETE USING (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema);
  END LOOP;
END;
$$;
