-- ============================================================================
-- Cleanup: Drop all org schemas and tenant data
-- ============================================================================
-- Safely removes all organization data while preserving:
--   - Super admins table and users
--   - Plans table
--   - All functions, triggers, RLS policies, indexes
--   - Migration history
--
-- Run via:  supabase db query < supabase/cleanup_orgs.sql
-- ============================================================================

DO $$
DECLARE
  r RECORD;
  v_count INT := 0;
BEGIN
  -- 1. Drop every org schema
  FOR r IN
    SELECT id, name, slug, schema_name FROM public.organizations
  LOOP
    BEGIN
      PERFORM public.drop_org_schema(r.schema_name);
      RAISE NOTICE 'Dropped schema: % (org: %)', r.schema_name, r.name;
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to drop schema %: %', r.schema_name, SQLERRM;
    END;
  END LOOP;

  RAISE NOTICE '--- Dropped % org schemas ---', v_count;
END;
$$;

-- 2. Clear org-related data (order matters for FK constraints)
DELETE FROM public.discovery_events;
DELETE FROM public.subscriptions;
DELETE FROM public.organizations;

-- 3. Reset the seed data for plans (inserts only if table is empty)
INSERT INTO public.plans (name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features, is_active)
SELECT 'free',       'Free',       1,  5,  10, 0,    'DZD', '{"max_questions": 50, "has_notifications": false, "has_analytics": false}',       true
WHERE NOT EXISTS (SELECT 1 FROM public.plans);

INSERT INTO public.plans (name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features, is_active)
SELECT 'pro',        'Pro',        5,  20, 50, 9999, 'DZD', '{"max_questions": 200, "has_notifications": true, "has_analytics": true}',         true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'pro');

INSERT INTO public.plans (name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features, is_active)
SELECT 'enterprise', 'Enterprise', 999, 999, 999, 49999, 'DZD', '{"max_questions": -1, "has_notifications": true, "has_analytics": true}', true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'enterprise');

-- Verify
SELECT 'organizations' AS table_name, COUNT(*) FROM public.organizations
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM public.subscriptions
UNION ALL
SELECT 'discovery_events', COUNT(*) FROM public.discovery_events
UNION ALL
SELECT 'plans', COUNT(*) FROM public.plans
UNION ALL
SELECT 'super_admins', COUNT(*) FROM public.super_admins;
