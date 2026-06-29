import { useClerkSupabase } from "@global/supabase";

export function useSuperAdmin() {
  const supabase = useClerkSupabase();

  async function rpc(name, params = {}) {
    const { data, error } = await supabase.rpc(name, params);
    if (error) { console.error(`[RPC ${name}]`, error); throw error; }
    return data;
  }

  async function isSuperAdmin() { return rpc("is_super_admin"); }
  async function listOrganizations() { return rpc("super_admin_list_orgs"); }
  async function getStats() { return rpc("super_admin_get_stats"); }
  async function getDetailedStats() { return rpc("super_admin_get_detailed_stats"); }

  function buildChartData(orgs) {
    const planMap = {};
    orgs.forEach(o => {
      const key = o.plan_display_name || o.plan_name || "No Plan";
      planMap[key] = (planMap[key] || 0) + 1;
    });
    const plan_distribution = Object.entries(planMap).map(([name, count]) => ({ name, count }));

    const modeMap = {};
    orgs.forEach(o => {
      const key = o.registration_mode || "open";
      modeMap[key] = (modeMap[key] || 0) + 1;
    });
    const registration_modes = Object.entries(modeMap).map(([name, count]) => ({ name, count }));

    const now = new Date();
    const monthCounts = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthCounts[key] = 0;
    }
    orgs.forEach(o => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key in monthCounts) monthCounts[key]++;
    });
    const org_growth = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

    const top_orgs = [...orgs]
      .sort((a, b) => (b.user_count || 0) - (a.user_count || 0))
      .slice(0, 8)
      .map(o => ({ name: o.name, users: o.user_count || 0 }));

    return { plan_distribution, registration_modes, org_growth, top_orgs };
  }

  async function getChartData(orgs) { return buildChartData(orgs || []); }

  async function createOrganization({ name, slug, adminEmail }) {
    return rpc("super_admin_create_org", { p_name: name, p_slug: slug, p_admin_email: adminEmail });
  }

  async function deleteOrganization(slug) {
    return rpc("super_admin_delete_org", { p_slug: slug });
  }

  async function blockOrganization(slug) {
    return rpc("super_admin_block_org", { p_slug: slug });
  }

  async function unblockOrganization(slug) {
    return rpc("super_admin_unblock_org", { p_slug: slug });
  }

  async function listPlans() { return rpc("super_admin_list_plans"); }

  async function upsertPlan(data) {
    return rpc("super_admin_upsert_plan", {
      p_id: data.id || null, p_name: data.name, p_display_name: data.displayName,
      p_max_events: data.maxEvents, p_max_speakers: data.maxSpeakers,
      p_max_sessions: data.maxSessions, p_price_cents: data.priceCents,
      p_currency: data.currency || "DZD", p_features: data.features || {},
      p_is_active: data.isActive !== undefined ? data.isActive : true,
    });
  }

  async function togglePlan(planId, active) {
    return rpc("super_admin_toggle_plan", { p_plan_id: planId, p_is_active: active });
  }

  async function deletePlan(planId) {
    return rpc("super_admin_delete_plan", { p_plan_id: planId });
  }

  async function orgQuery(schema, table, filters = {}, limit = 100, offset = 0, orderBy = "created_at", orderDir = "DESC") {
    return rpc("super_admin_org_query", {
      p_schema: schema, p_table: table, p_filters: filters,
      p_limit: limit, p_offset: offset, p_order_by: orderBy, p_order_dir: orderDir,
    });
  }

  async function orgInsert(schema, table, data) {
    return rpc("super_admin_org_insert", { p_schema: schema, p_table: table, p_data: data });
  }

  async function orgUpdate(schema, table, id, data) {
    return rpc("super_admin_org_update", { p_schema: schema, p_table: table, p_id: id, p_data: data });
  }

  async function orgDelete(schema, table, id) {
    return rpc("super_admin_org_delete", { p_schema: schema, p_table: table, p_id: id });
  }

  async function getOrgTableCounts(schema) {
    return rpc("super_admin_org_table_counts", { p_schema: schema });
  }

  async function listOrgsDiscoveryStatus() {
    return rpc("super_admin_list_orgs_discovery_status");
  }

  async function toggleDiscoveryEnable(slug, enabled) {
    return rpc("super_admin_toggle_discovery_enable", { p_org_slug: slug, p_enabled: enabled });
  }

  async function toggleDiscoveryBlock(slug, blocked) {
    return rpc("super_admin_toggle_discovery_block", { p_org_slug: slug, p_blocked: blocked });
  }

  return {
    supabase, isSuperAdmin, listOrganizations, getStats, getDetailedStats, getChartData,
    createOrganization, deleteOrganization, blockOrganization, unblockOrganization,
    listPlans, upsertPlan, togglePlan, deletePlan,
    orgQuery, orgInsert, orgUpdate, orgDelete, getOrgTableCounts,
    listOrgsDiscoveryStatus, toggleDiscoveryEnable, toggleDiscoveryBlock,
  };
}
