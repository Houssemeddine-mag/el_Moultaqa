-- ============================================================================
-- Migration 013: Enhanced platform-wide statistics for super admin dashboard
-- ============================================================================
-- Adds an enriched stats function with revenue, health, discovery, and
-- engagement metrics for business management.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.super_admin_get_detailed_stats()
RETURNS TABLE (
  -- existing counts
  total_orgs            BIGINT,
  total_users           BIGINT,
  total_events          BIGINT,
  total_sessions        BIGINT,
  active_orgs           BIGINT,
  -- org health
  blocked_orgs          BIGINT,
  past_due_orgs         BIGINT,
  orgs_without_events   BIGINT,
  -- discovery pipeline
  discovery_enabled     BIGINT,
  discovery_published   BIGINT,
  discovery_blocked     BIGINT,
  -- engagement
  total_speakers        BIGINT,
  total_questions       BIGINT,
  total_notifications   BIGINT,
  total_sponsors        BIGINT,
  total_tickets         BIGINT,
  -- revenue
  total_revenue_cents   BIGINT,
  mrr_cents             BIGINT,
  -- growth
  new_orgs_this_month   BIGINT,
  new_orgs_last_month   BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org RECORD;
  v_count BIGINT;
  v_plan RECORD;
  v_month_start DATE;
  v_last_month_start DATE;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied: not a super admin';
  END IF;

  -- Org counts
  SELECT COUNT(*) INTO total_orgs FROM public.organizations;
  SELECT COUNT(*) INTO blocked_orgs FROM public.organizations WHERE blocked_at IS NOT NULL;
  SELECT COUNT(*) INTO active_orgs FROM public.organizations o
    WHERE EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.organization_id = o.id AND s.status = 'active');
  SELECT COUNT(*) INTO past_due_orgs FROM public.organizations o
    WHERE EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.organization_id = o.id AND s.status = 'past_due');

  -- Discovery pipeline
  SELECT COUNT(*) INTO discovery_enabled FROM public.discovery_events WHERE is_super_enabled = true;
  SELECT COUNT(*) INTO discovery_published FROM public.discovery_events WHERE is_super_enabled = true AND is_org_published = true AND is_super_blocked = false;
  SELECT COUNT(*) INTO discovery_blocked FROM public.discovery_events WHERE is_super_enabled = true AND is_super_blocked = true;

  -- Growth (org creation dates, not schema provision)
  v_month_start := date_trunc('month', CURRENT_DATE)::DATE;
  v_last_month_start := (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::DATE;
  SELECT COUNT(*) INTO new_orgs_this_month FROM public.organizations WHERE created_at >= v_month_start;
  SELECT COUNT(*) INTO new_orgs_last_month FROM public.organizations
    WHERE created_at >= v_last_month_start AND created_at < v_month_start;

  -- Per-schema aggregations
  total_users := 0;
  total_events := 0;
  total_sessions := 0;
  total_speakers := 0;
  total_questions := 0;
  total_notifications := 0;
  total_sponsors := 0;
  total_tickets := 0;
  orgs_without_events := 0;

  FOR v_org IN SELECT schema_name FROM public.organizations
  LOOP
    -- users
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.users', v_org.schema_name) INTO v_count;
      total_users := total_users + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- events
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.events', v_org.schema_name) INTO v_count;
      total_events := total_events + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- sessions
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.sessions', v_org.schema_name) INTO v_count;
      total_sessions := total_sessions + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- speakers
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.speakers', v_org.schema_name) INTO v_count;
      total_speakers := total_speakers + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- questions
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.questions', v_org.schema_name) INTO v_count;
      total_questions := total_questions + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- notifications
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.notifications', v_org.schema_name) INTO v_count;
      total_notifications := total_notifications + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- sponsors (stored in events.settings->'sponsors')
    BEGIN
      EXECUTE format('SELECT COALESCE(SUM(jsonb_array_length(COALESCE(settings->''sponsors'', ''[]''::jsonb))), 0) FROM %I.events', v_org.schema_name) INTO v_count;
      total_sponsors := total_sponsors + v_count;
    EXCEPTION WHEN OTHERS THEN END;

    -- tickets
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I.tickets', v_org.schema_name) INTO v_count;
      total_tickets := total_tickets + v_count;
    EXCEPTION WHEN OTHERS THEN END;
  END LOOP;

  -- Orgs without any events
  SELECT COUNT(*) INTO orgs_without_events FROM public.organizations o
    WHERE NOT EXISTS (
      SELECT 1 FROM public.discovery_events de WHERE de.org_slug = o.slug
    )
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.tables t
        WHERE t.table_schema = o.schema_name AND t.table_name = 'events'
    );

  -- Revenue: sum of price_cents from active subscriptions joined to plans
  SELECT COALESCE(SUM(p.price_cents), 0) INTO total_revenue_cents
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE s.status = 'active';

  -- MRR: monthly recurring revenue (active subs / annual plans divided by 12)
  -- We treat all active subscriptions as monthly for now
  SELECT COALESCE(SUM(p.price_cents), 0) INTO mrr_cents
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE s.status = 'active';

  RETURN NEXT;
END;
$$;
