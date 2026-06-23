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
    sponsors: (conference.sponsors || []).filter(Boolean),
    collaborators: (conference.collaborators || []).filter(Boolean),
    attendees: (conference.attendees || []).filter(Boolean),
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
  return slug;
}

export async function getConferenceConfig() {
  return readJson(CONFERENCE_CONFIG_STORAGE_KEY, null);
}
