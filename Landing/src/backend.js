function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

const CONFERENCE_CONFIG_STORAGE_KEY = "elm_conference_config";

export async function saveConferenceConfig(supabase, conference) {
  const payload = {
    ...conference,
    sponsors: [],
    updatedAt: new Date().toISOString(),
  };
  writeJson(CONFERENCE_CONFIG_STORAGE_KEY, payload);
  const rawSlug = conference.shortName || conference.name || "";
  const slug = rawSlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") || `conf-${Date.now()}`;

    
  console.log("[saveConferenceConfig] Call database to create initial event record in schema...");
  const { data, error } = await supabase.rpc("create_initial_event", {
    p_clerk_org_id: conference.clerkOrgId,
    p_title: conference.name,
    p_short_name: conference.shortName,
    p_theme_color: conference.themeColor,
    p_logo_url: conference.logo,
    p_start_date: conference.startDate,
    p_end_date: conference.endDate,
    p_sponsors: payload.sponsors,
  });

  if (error) {
    console.error("[saveConferenceConfig] RPC failed:", error);
    throw new Error(error.message || "Failed to write database config");
  }

  console.log("[saveConferenceConfig] Event created in schema successfully. ID:", data);

  // Persist the builder-chosen category into the event settings so the admin
  // Discovery Card can prefill it later (non-fatal — admin can set it manually).
  // "Other" stores the custom text as the effective category.
  if (conference.category) {
    try {
      const effectiveCategory =
        conference.category === "other" && conference.categoryOther?.trim()
          ? conference.categoryOther.trim()
          : conference.category;
      const { resolveOrgSlug } = await import("@global/supabase");
      const orgDetails = await resolveOrgSlug(supabase, slug);
      if (orgDetails?.schema_name) {
        await supabase.rpc("org_update", {
          p_schema_name: orgDetails.schema_name,
          p_table_name: "events",
          p_id: data,
          p_data: {
            settings: {
              themeColor: conference.themeColor,
              sponsors: payload.sponsors,
              category: effectiveCategory,
            },
          },
        });
        console.log("[saveConferenceConfig] Category saved to event settings.");
      }
    } catch (catErr) {
      console.warn("[saveConferenceConfig] Category not saved (non-fatal):", catErr?.message || catErr);
    }
  }

  return slug;
}

export async function getConferenceConfig() {
  return readJson(CONFERENCE_CONFIG_STORAGE_KEY, null);
}

export async function listPlans(supabase) {
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, display_name, max_events, max_speakers, max_sessions, price_cents, currency, features")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  if (error) {
    console.error("[listPlans]", error);
    throw error;
  }
  return data || [];
}
