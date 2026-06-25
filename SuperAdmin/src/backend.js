import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) {
    console.error(`[SuperAdmin RPC ${name}]`, error);
    throw error;
  }
  return data;
}

export async function isSuperAdmin() {
  return true;
}

export async function listOrganizations() {
  return rpc("super_admin_list_orgs");
}

export async function getStats() {
  return rpc("super_admin_get_stats");
}

export async function createOrganization({ name, slug, adminEmail }) {
  return rpc("super_admin_create_org", {
    p_name: name,
    p_slug: slug,
    p_admin_email: adminEmail,
  });
}

export async function getOrgHealth(orgId) {
  return rpc("super_admin_org_health", { p_org_id: orgId });
}

export async function listPlans() {
  return rpc("super_admin_list_plans");
}

export async function upsertPlan({ id, name, displayName, maxEvents, maxSpeakers, maxSessions, priceCents, currency, features, isActive }) {
  return rpc("super_admin_upsert_plan", {
    p_id: id || null,
    p_name: name,
    p_display_name: displayName,
    p_max_events: maxEvents,
    p_max_speakers: maxSpeakers,
    p_max_sessions: maxSessions,
    p_price_cents: priceCents,
    p_currency: currency || "DZD",
    p_features: features || {},
    p_is_active: isActive !== undefined ? isActive : true,
  });
}

export async function togglePlan(planId, active) {
  return rpc("super_admin_toggle_plan", {
    p_plan_id: planId,
    p_is_active: active,
  });
}

export async function deletePlan(planId) {
  return rpc("super_admin_delete_plan", { p_plan_id: planId });
}
