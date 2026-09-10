import { queryOrgTable } from "@global/supabase";

const AUTH_STORAGE_KEY = "elm_webapp_auth_user";
const PROFILE_STORAGE_KEY = "elm_webapp_profiles";
const PROGRAMS_STORAGE_KEY = "elm_webapp_programs";
const KEYNOTES_STORAGE_KEY = "elm_webapp_keynotes";
const NOTIFICATIONS_STORAGE_KEY = "elm_webapp_notifications";
const STREAM_QUESTIONS_STORAGE_KEY = "elm_stream_questions";
const SPONSORS_STORAGE_KEY = "elm_sponsors";
const CONFERENCE_CONFIG_STORAGE_KEY = "elm_conference_config";
const ADMIN_STREAMS_STORAGE_KEY = "elm_admin_streams";

const authListeners = new Set();
let activeSupabase = null;
let activeSchemaName = null;

export function initializeService(supabase, schemaName) {
  activeSupabase = supabase;
  activeSchemaName = schemaName;
  console.log("[localService] Initialized with schema:", schemaName);
}

export function isServiceReady() {
  return Boolean(activeSupabase && activeSchemaName);
}

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

function getStoredUser() {
  return readJson(AUTH_STORAGE_KEY, null);
}

function setStoredUser(user) {
  if (user) {
    writeJson(AUTH_STORAGE_KEY, user);
  } else {
    removeItem(AUTH_STORAGE_KEY);
  }
  authListeners.forEach((listener) => listener(user));
}

function getProfileStore() {
  return readJson(PROFILE_STORAGE_KEY, {});
}

function setProfileStore(store) {
  writeJson(PROFILE_STORAGE_KEY, store);
}

function ensureProfile(user) {
  if (!user?.uid) return null;
  const profiles = getProfileStore();
  if (!profiles[user.uid]) {
    profiles[user.uid] = {
      id: user.uid,
      uid: user.uid,
      email: user.email || "a@a.a",
      displayName:
        user.displayName || user.email?.split("@")[0] || "Template User",
      university: "",
      createdAt: new Date().toISOString(),
      lastSignedIn: new Date().toISOString(),
    };
    setProfileStore(profiles);
  }
  return profiles[user.uid];
}

function getCollection(key) {
  return readJson(key, []);
}

function sortByDateThenTime(items) {
  return items.slice().sort((a, b) => {
    const dateCompare = (a.date || "").localeCompare(b.date || "");
    if (dateCompare !== 0) return dateCompare;
    return (a.start || "").localeCompare(b.start || "");
  });
}

function normalizeProgram(program, id) {
  return {
    id,
    type: program.type || "session",
    title: program.title || "",
    date: program.date || "",
    start: program.start || "",
    end: program.end || null,
    endDate: program.endDate || null,
    room: program.room || "",
    chairs: Array.isArray(program.chairs) ? program.chairs : [],
    keynote: program.keynote || null,
    keynoteDescription: program.keynoteDescription || "",
    keynoteHasConference: Boolean(program.keynoteHasConference),
    conferences: Array.isArray(program.conferences) ? program.conferences : [],
    streamId: program.streamId || null,
    createdAt: program.createdAt || null,
    updatedAt: program.updatedAt || null,
  };
}

function readPrograms() {
  const programs = getCollection(PROGRAMS_STORAGE_KEY);
  return programs.map((program) => normalizeProgram(program, program.id));
}

export function writePrograms(programs) {
  writeJson(PROGRAMS_STORAGE_KEY, programs);
}

function readKeynotes() {
  const keynotes = getCollection(KEYNOTES_STORAGE_KEY);
  return keynotes.map((speaker, index) => ({
    id: speaker.id || `keynote-${index + 1}`,
    ...speaker,
  }));
}

export function writeKeynotes(speakers) {
  writeJson(KEYNOTES_STORAGE_KEY, speakers);
}

function readNotifications() {
  return getCollection(NOTIFICATIONS_STORAGE_KEY);
}

function readStreamQuestions() {
  return getCollection(STREAM_QUESTIONS_STORAGE_KEY);
}

function readAdminStreams() {
  return getCollection(ADMIN_STREAMS_STORAGE_KEY);
}

function readConferenceConfig() {
  return readJson(CONFERENCE_CONFIG_STORAGE_KEY, null);
}

export async function fetchConferenceConfig() {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
  if (events && events.length > 0) {
    const ev = events[0];
    // settings is JSONB, but normalize in case a legacy row returns text
    let settings = ev.settings || {};
    if (typeof settings === "string") {
      try {
        settings = JSON.parse(settings);
      } catch {
        settings = {};
      }
    }
    return {
      name: ev.title,
      shortName: ev.short_name,
      tagline: settings?.tagline || "",
      description: ev.description || settings?.description || "",
      website:
        ev.website ||
        settings?.website ||
        settings?.conferenceWebsite ||
        settings?.web_url ||
        "",
      themeColor: settings?.themeColor || "#0d7e52",
      logo: ev.cover_image_url || settings?.logo_url || "",
      startDate: ev.start_date,
      endDate: ev.end_date,
      sponsors: settings?.sponsors || [],
      collaborators: settings?.collaborators || [],
      attendees: settings?.attendees || [],
      stream_url: settings?.stream_url || ev.stream_url || null,
      settings,
    };
  }
  return null;
}

export function subscribeConferenceConfig(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const currentConfig = readConferenceConfig();
  listener(currentConfig);

  const handleStorage = (event) => {
    if (event.key === CONFERENCE_CONFIG_STORAGE_KEY) {
      listener(readConferenceConfig());
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => window.removeEventListener("storage", handleStorage);
}

function readSponsors() {
  return getCollection(SPONSORS_STORAGE_KEY);
}

export async function fetchSponsors() {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const config = await fetchConferenceConfig();
  if (config && Array.isArray(config.sponsors)) {
    // Keep logo-less sponsors too — HomePage renders them as text chips.
    return config.sponsors.map((s, index) => {
      if (typeof s === "string") {
        // legacy: sponsors as string names — no logo
        return { id: `sponsor-${index}`, name: s, tier: "partner", logoData: "", image: "", imageData: "", hasLogo: false };
      }
      // sponsors as objects from admin: {name, logo, logoUrl, image, tier, order}
      const name = s.name || s.title || `Sponsor ${index + 1}`;
      const logo = s.logoData || s.logo || s.logoUrl || s.image || s.imageData || s.photo || "";
      return {
        id: s.id || `sponsor-${index}`,
        name,
        tier: s.tier || "partner",
        order: s.order ?? index,
        logoData: logo,
        image: logo,
        imageData: logo,
        hasLogo: Boolean(logo),
      };
    });
  }
  return [];
}

export async function getOrgPublicInfo(supabase, slug) {
  if (!supabase || !slug) return null;
  const { data, error } = await supabase.rpc("get_org_public_info", { p_slug: slug });
  if (error) {
    console.error("[localService.getOrgPublicInfo] RPC failed:", error);
    throw error;
  }
  return data;
}

export async function registerAttendee(supabase, slug, clerkUserId, email, fullName = "", code = null) {
  if (!supabase || !slug || !clerkUserId || !email) {
    throw new Error("Missing required parameters for registration");
  }
  const { data, error } = await supabase.rpc("register_attendee", {
    p_slug: slug,
    p_clerk_user_id: clerkUserId,
    p_email: email,
    p_full_name: fullName,
    p_registration_code: code
  });
  if (error) {
    console.error("[localService.registerAttendee] RPC failed:", error);
    throw error;
  }
  return data;
}

export async function checkUserMembership(supabase, schemaName, clerkUserId) {
  if (!supabase || !schemaName || !clerkUserId) return false;
  try {
    const users = await queryOrgTable(supabase, schemaName, "users", {
      filters: { clerk_user_id: clerkUserId }
    });
    return users && users.length > 0;
  } catch (e) {
    console.error("[localService.checkUserMembership] failed:", e);
    return false;
  }
}


export async function fetchUserProfile(uid, email, displayName) {
  if (!uid) return null;
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }

  const users = await queryOrgTable(activeSupabase, activeSchemaName, "users", {
    filters: { clerk_user_id: uid }
  });
  let u;
  if (users && users.length > 0) {
    u = users[0];
  } else {
    console.log("[localService.fetchUserProfile] User not found in schema. Auto-inserting...");
    const insertPayload = {
      clerk_user_id: uid,
      email: email || "",
      full_name: displayName || "",
      role: "attendee"
    };
    const { data, error } = await activeSupabase.rpc("org_insert", {
      p_schema_name: activeSchemaName,
      p_table_name: "users",
      p_data: insertPayload
    });
    if (error) {
      console.error("[localService.fetchUserProfile] Failed to auto-insert user:", error);
      throw error;
    }
    u = data;
  }

  if (u) {
    return {
      id: u.id,
      uid: u.clerk_user_id,
      email: u.email,
      displayName: u.full_name || u.email?.split("@")[0] || "User",
      university: u.institution || "",
      schoolLevel: u.metadata?.schoolLevel || "Master's Degree",
      role: u.role,
      avatar: u.avatar_url,
      photoURL: u.avatar_url,
      createdAt: u.created_at,
      lastSignedIn: u.updated_at,
      gender: u.metadata?.gender || "male",
      country: u.metadata?.country || "Algeria",
      province: u.metadata?.province || "Constantine",
      phone: u.phone || "",
      phoneNumber: u.phone || "",
      jobTitle: u.bio || "",
      organization: u.institution || "",
      bio: u.bio || "",
      isProfileComplete: true,
    };
  }

  return null;
}

export async function fetchAllPrograms() {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const sessions = await queryOrgTable(activeSupabase, activeSchemaName, "sessions");
  const speakers = await queryOrgTable(activeSupabase, activeSchemaName, "speakers");
  const speakerMap = new Map(speakers.map((s) => [s.id, s]));

  const programs = sessions.map((session) => {
    const sp = session.speaker_id ? speakerMap.get(session.speaker_id) : null;
    const meta = session.metadata || {};
    // Same wall-clock parsing as admin getPrograms (string split, no TZ conversion).
    // Using `new Date()` here shifted times by the viewer's timezone and mixed
    // UTC date with local time, so admin 09:00 showed as 10:00 in webapp (UTC+1).
    let dateStr = "";
    let startStr = "";
    let endStr = "";
    let endDateStr = "";
    if (session.start_time) {
      dateStr = session.start_time.split("T")[0] || "";
      startStr = session.start_time.split("T")[1]?.substring(0, 5) || "";
    }
    if (session.end_time) {
      endDateStr = session.end_time.split("T")[0] || "";
      endStr = session.end_time.split("T")[1]?.substring(0, 5) || "";
      if (endDateStr === dateStr) endDateStr = "";
    }

    // Admin stores presentations in sessions.metadata.conferences —
    // previously dropped (hardcoded to []), hence "0 presentations".
    const rawConferences = Array.isArray(meta.conferences) ? meta.conferences : [];
    const conferences = rawConferences.map((c, idx) => ({
      id: c.id || `${session.id}-conf-${idx}`,
      title: c.title || "",
      presenter: c.presenter || "",
      affiliation: c.affiliation || "",
      start: c.start || "",
      end: c.end || "",
      time: c.time || "",
      room: c.room || "",
      resume: c.resume || c.description || "",
      description: c.resume || c.description || "",
      isKeynote: Boolean(c.isKeynote),
    }));

    // Keynote: prefer linked speaker, fall back to metadata.keynote saved by admin.
    const metaKeynote = meta.keynote || null;
    const keynote = sp
      ? {
          name: sp.full_name,
          title: sp.title || "",
          company: sp.company || "",
          affiliation: sp.company || metaKeynote?.affiliation || "",
          photo: sp.photo_url || "",
          image: sp.photo_url || metaKeynote?.image || "",
          bio: sp.bio || "",
        }
      : metaKeynote && metaKeynote.name
        ? {
            name: metaKeynote.name,
            title: metaKeynote.title || "",
            company: metaKeynote.company || metaKeynote.affiliation || "",
            affiliation: metaKeynote.affiliation || "",
            photo: metaKeynote.image || metaKeynote.photo || "",
            image: metaKeynote.image || metaKeynote.photo || "",
            bio: metaKeynote.bio || "",
          }
        : null;

    return {
      id: session.id,
      type: session.session_type || "talk",
      title: session.title,
      date: dateStr,
      start: startStr,
      end: endStr || null,
      endDate: endDateStr || null,
      room: session.room || "",
      chairs: Array.isArray(meta.chairs) ? meta.chairs : [],
      keynote,
      keynoteDescription: meta.keynoteDescription || session.description || "",
      keynoteHasConference: conferences.some((c) => c.isKeynote),
      conferences,
      streamId: meta.streamId || null,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  });
  return sortByDateThenTime(programs);
}

export async function fetchUpcomingPrograms(limitCount = 2) {
  const list = await fetchAllPrograms();
  return list.slice(0, limitCount);
}

export async function fetchKeynotePrograms() {
  const list = await fetchAllPrograms();
  return list.filter((program) => program.keynote && program.keynote.name);
}

export async function fetchKeynoteSpeakers() {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const speakers = await queryOrgTable(activeSupabase, activeSchemaName, "speakers");
  return speakers.map((sp) => ({
    id: sp.id,
    name: sp.full_name,
    title: sp.title || "",
    company: sp.company || "",
    photo: sp.photo_url || "",
    bio: sp.bio || "",
    socials: sp.social_links || {},
  }));
}

export function subscribePrograms(onUpdate, onError) {
  if (typeof window === "undefined") {
    return () => {};
  }

  let cancelled = false;
  let channel = null;
  let pollTimer = null;

  let authFailed = false;

  const pushUpdate = async () => {
    if (cancelled || authFailed) return;
    // Service may not be initialized yet (ConferenceProvider resolves org async).
    // Don't report this as a "realtime failure" — just wait for init.
    if (!activeSupabase || !activeSchemaName) return;
    try {
      const data = await fetchAllPrograms();
      if (!cancelled) onUpdate(data);
    } catch (error) {
      const msg = error?.message || "";
      // Auth failures will not fix themselves by polling — stop and surface once.
      if (msg.includes("not authenticated") || msg.includes("not a registered user")) {
        authFailed = true;
        if (pollTimer) window.clearInterval(pollTimer);
      }
      if (!cancelled && onError) onError(error);
    }
  };

  // Local-storage fallback path (template/offline mode)
  if (!activeSupabase || !activeSchemaName) {
    try {
      onUpdate(sortByDateThenTime(readPrograms()));
    } catch (error) {
      if (onError) onError(error);
    }
  } else {
    pushUpdate();

    // Light polling so an admin edit appears without a hard reload.
    pollTimer = window.setInterval(pushUpdate, 30000);

    // Supabase Realtime on sessions table, if the project has it enabled.
    try {
      if (typeof activeSupabase.channel === "function") {
        channel = activeSupabase
          .channel(`sessions-${activeSchemaName}`)
          .on(
            "postgres_changes",
            { event: "*", schema: activeSchemaName, table: "sessions" },
            () => pushUpdate()
          )
          .subscribe((status, err) => {
            if ((status === "CHANNEL_ERROR" || status === "TIMED_OUT") && err && onError) {
              console.warn("[localService] Realtime channel issue:", status, err);
            }
          });
      }
    } catch (realtimeErr) {
      console.warn("[localService] Realtime not available, using polling:", realtimeErr);
    }
  }

  const handleStorage = (event) => {
    if (event.key === PROGRAMS_STORAGE_KEY) {
      try {
        if (!activeSupabase || !activeSchemaName) {
          onUpdate(sortByDateThenTime(readPrograms()));
        } else {
          pushUpdate();
        }
      } catch (error) {
        if (onError) onError(error);
      }
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    cancelled = true;
    window.removeEventListener("storage", handleStorage);
    if (pollTimer) window.clearInterval(pollTimer);
    if (channel) {
      try {
        activeSupabase.removeChannel(channel);
      } catch {
        // ignore cleanup errors
      }
    }
  };
}

export async function fetchNotifications(limitCount = 4) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const data = await queryOrgTable(activeSupabase, activeSchemaName, "notifications", {
    limit: limitCount,
    orderBy: "created_at",
    orderDir: "DESC"
  });
  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    type: item.type || "info",
    isPinned: Boolean(item.is_pinned),
    createdAt: item.created_at || item.createdAt,
  }));
}

export async function fetchStreams() {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
  if (events && events.length > 0) {
    return events[0].settings?.streams || [];
  }
  return [];
}

export async function fetchStreamQuestions(streamId) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const questions = await queryOrgTable(activeSupabase, activeSchemaName, "questions", {
    filters: { stream_id: streamId },
    orderBy: "created_at",
    orderDir: "DESC"
  });
  return (questions || []).map((q) => ({
    id: q.id,
    author: q.author_name || "Attendee",
    message: q.message,
    createdAt: q.created_at,
    isAnswered: Boolean(q.is_answered),
    streamId: q.stream_id,
    sessionTitle: q.session_title,
    presentationTitle: q.presentation_title,
  }));
}

export async function submitStreamQuestion({ author, message, clerkUserId = null, streamId = null, sessionTitle = null, presentationTitle = null }) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const insertPayload = {
    author_name: author || "Attendee",
    clerk_user_id: clerkUserId,
    message: message,
    is_answered: false,
    is_pinned: false,
    stream_id: streamId,
    session_title: sessionTitle,
    presentation_title: presentationTitle,
  };
  const { data, error } = await activeSupabase.rpc("org_insert", {
    p_schema_name: activeSchemaName,
    p_table_name: "questions",
    p_data: insertPayload
  });
  if (error) {
    console.error("[localService.submitStreamQuestion] RPC failed:", error);
    throw error;
  }
  return {
    id: data.id,
    author: data.author_name,
    message: data.message,
    createdAt: data.created_at,
    isAnswered: data.is_answered,
  };
}


export async function fetchPresentationFeedback(presentationKey) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  const data = await queryOrgTable(activeSupabase, activeSchemaName, "feedback", {
    filters: { session_title: presentationKey },
    orderBy: "created_at",
    orderDir: "DESC",
    limit: 100,
  });
  return (data || []).map((f) => ({
    id: f.id,
    rating: Number(f.presentation_rating ?? f.presenter_rating ?? 0) || 0,
    comment: f.comment || "",
    userEmail: f.user_email || "",
    createdAt: f.created_at,
  }));
}

export async function submitPresentationFeedback({ presentationKey, rating, comment, userEmail }) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  if (!presentationKey) throw new Error("Missing presentation reference");
  const safeRating = Math.min(5, Math.max(1, Number(rating) || 0));
  if (!safeRating) throw new Error("Please select a star rating");
  const { data, error } = await activeSupabase.rpc("org_insert", {
    p_schema_name: activeSchemaName,
    p_table_name: "feedback",
    p_data: {
      session_title: presentationKey,
      presentation_rating: safeRating,
      presenter_rating: safeRating,
      comment: (comment || "").trim(),
      user_email: userEmail || "",
    },
  });
  if (error) {
    console.error("[localService.submitPresentationFeedback] RPC failed:", error);
    throw error;
  }
  return {
    id: data.id,
    rating: Number(data.presentation_rating ?? safeRating) || safeRating,
    comment: data.comment || "",
    userEmail: data.user_email || "",
    createdAt: data.created_at,
  };
}

export async function updateUserProfile(uid, profileId, updatedData) {
  if (!activeSupabase || !activeSchemaName) {
    throw new Error("Supabase not initialized");
  }
  let dbId = profileId;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profileId || "");

  if (!isUuid) {
    console.log("[localService.updateUserProfile] profileId is not a UUID. Resolving from database...");
    try {
      const users = await queryOrgTable(activeSupabase, activeSchemaName, "users", {
        filters: { clerk_user_id: uid }
      });
      if (users && users.length > 0) {
        dbId = users[0].id;
      } else {
        console.log("[localService.updateUserProfile] User not found in schema. Auto-inserting...");
        const insertPayload = {
          clerk_user_id: uid,
          email: updatedData.email || "",
          full_name: updatedData.displayName || "",
          role: "attendee"
        };
        const { data, error: insertError } = await activeSupabase.rpc("org_insert", {
          p_schema_name: activeSchemaName,
          p_table_name: "users",
          p_data: insertPayload
        });
        if (insertError) {
          console.error("[localService.updateUserProfile] Auto-insert failed:", insertError);
          throw insertError;
        }
        dbId = data.id;
      }
    } catch (err) {
      console.error("[localService.updateUserProfile] Failed to resolve user database UUID:", err);
      throw err;
    }
  }

  const payload = {
    full_name: updatedData.displayName,
    institution: updatedData.university,
    phone: updatedData.phone,
    bio: updatedData.bio,
    metadata: {
      schoolLevel: updatedData.schoolLevel,
      gender: updatedData.gender,
      country: updatedData.country,
      province: updatedData.province,
    }
  };

  const { data, error } = await activeSupabase.rpc("org_update", {
    p_schema_name: activeSchemaName,
    p_table_name: "users",
    p_id: dbId,
    p_data: payload
  });

  if (error) {
    console.error("[localService.updateUserProfile] failed:", error);
    throw error;
  }

  return {
    id: data.id,
    uid: data.clerk_user_id,
    email: data.email,
    displayName: data.full_name || data.email.split("@")[0] || "User",
    university: data.institution || "",
    schoolLevel: data.metadata?.schoolLevel || "Master's Degree",
    role: data.role,
    avatar: data.avatar_url,
    photoURL: data.avatar_url,
    createdAt: data.created_at,
    lastSignedIn: data.updated_at,
    gender: data.metadata?.gender || "male",
    country: data.metadata?.country || "Algeria",
    province: data.metadata?.province || "Constantine",
    phone: data.phone || "",
    phoneNumber: data.phone || "",
    jobTitle: data.bio || "",
    organization: data.institution || "",
    bio: data.bio || "",
    isProfileComplete: true,
  };
}
