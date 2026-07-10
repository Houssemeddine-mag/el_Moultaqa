-- ---------------------------------------------------------------------------
-- Function: public.get_org_theme_color
-- Returns the primary themeColor from a tenant schema's events.settings JSONB.
-- Called by the mobile build workflow (which uses service_role) so SECURITY
-- INVOKER is fine — the caller's privileges already allow cross-schema access.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_org_theme_color(p_schema_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_schema TEXT;
  v_color TEXT;
BEGIN
  -- Sanitise schema name the same way create_org_schema does
  v_schema := lower(regexp_replace(p_schema_name, '[^a-z0-9_]', '_', 'g'));

  IF v_schema IS NULL OR v_schema = '' THEN
    RAISE EXCEPTION 'Invalid schema name: %', p_schema_name;
  END IF;

  EXECUTE format(
    'SELECT COALESCE(settings->>''themeColor'', ''#0D7E52'') FROM %I.events LIMIT 1',
    v_schema
  ) INTO v_color;

  RETURN v_color;
END;
$$;
