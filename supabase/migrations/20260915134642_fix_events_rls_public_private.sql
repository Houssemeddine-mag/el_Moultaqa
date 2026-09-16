-- Fix events RLS to work for ANY org later on (public vs private)
-- Public: any authenticated user can read events (discovery, sakura, etc.)
-- Private: only members of that org (JWT org_id matches)
-- Replaces the previous "any authenticated" permissive policy with conditional

DO $$
DECLARE
  r RECORD;
  v_schema TEXT;
BEGIN
  FOR r IN SELECT schema_name, slug FROM public.organizations WHERE blocked_at IS NULL LOOP
    v_schema := r.schema_name;
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select" ON %I.events', v_schema);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select (public events)" ON %I.events', v_schema);
    -- Conditional: if org is public, allow any authenticated; else require org membership
    EXECUTE format('
      CREATE POLICY "Tenant isolation: select (public/private events)"
        ON %I.events FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.organizations o
            WHERE o.schema_name = %L
              AND (
                o.registration_mode = ''public''
                OR o.clerk_org_id = public.requesting_org_id()
              )
          )
          OR auth.role() = ''service_role''
        )
    ', v_schema, v_schema);
    RAISE NOTICE 'Fixed events RLS for % (%)', v_schema, r.slug;
  END LOOP;
END $$;

-- Update template for future orgs
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
    IF v_table = 'events' THEN
      EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select" ON %I.%I', v_schema, v_table);
      EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select (public events)" ON %I.%I', v_schema, v_table);
      EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select (public/private events)" ON %I.%I', v_schema, v_table);
      EXECUTE format('
        CREATE POLICY "Tenant isolation: select (public/private events)"
          ON %I.%I FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.organizations o
              WHERE o.schema_name = %L
                AND (o.registration_mode = ''public'' OR o.clerk_org_id = public.requesting_org_id())
            )
            OR auth.role() = ''service_role''
          )
      ', v_schema, v_table, v_schema);
    ELSE
      EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: select" ON %I.%I', v_schema, v_table);
      EXECUTE format('
        CREATE POLICY "Tenant isolation: select"
          ON %I.%I FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
          )
      ', v_schema, v_table, v_schema);
    END IF;
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: insert" ON %I.%I', v_schema, v_table);
    EXECUTE format('
      CREATE POLICY "Tenant isolation: insert"
        ON %I.%I FOR INSERT WITH CHECK (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: update" ON %I.%I', v_schema, v_table);
    EXECUTE format('
      CREATE POLICY "Tenant isolation: update"
        ON %I.%I FOR UPDATE USING (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        ) WITH CHECK (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema, v_schema);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation: delete" ON %I.%I', v_schema, v_table);
    EXECUTE format('
      CREATE POLICY "Tenant isolation: delete"
        ON %I.%I FOR DELETE USING (
          EXISTS (SELECT 1 FROM public.organizations WHERE schema_name = %L AND clerk_org_id = public.requesting_org_id())
        )
    ', v_schema, v_table, v_schema);
  END LOOP;
END;
$$;
