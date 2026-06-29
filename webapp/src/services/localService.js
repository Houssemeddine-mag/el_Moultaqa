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
  if (activeSupabase && activeSchemaName) {
    try {
      const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
      if (events && events.length > 0) {
        const ev = events[0];
        return {
          name: ev.title,
          shortName: ev.short_name,
          themeColor: ev.settings?.themeColor || "#0d7e52",
          logo: ev.cover_image_url || ev.settings?.logo_url || "",
          startDate: ev.start_date,
          endDate: ev.end_date,
          sponsors: ev.settings?.sponsors || [],
          collaborators: ev.settings?.collaborators || [],
          attendees: ev.settings?.attendees || [],
        };
      }
    } catch (e) {
      console.error("[localService.fetchConferenceConfig] Supabase query failed:", e);
    }
  }
  return readConferenceConfig();
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
  if (activeSupabase && activeSchemaName) {
    try {
      const config = await fetchConferenceConfig();
      if (config && config.sponsors) {
        return config.sponsors.map((name, index) => ({
          id: `sponsor-${index}`,
          name,
          tier: "partner",
        }));
      }
    } catch (e) {
      console.error("[localService.fetchSponsors] failed:", e);
    }
  }
  return readSponsors();
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

  if (activeSupabase && activeSchemaName) {
    try {
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
        } else {
          u = data;
        }
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
    } catch (e) {
      console.error("[localService.fetchUserProfile] Supabase query/insert failed:", e);
    }
  }

  // Fallback to local storage
  const profiles = getProfileStore();
  const existing = profiles[uid];
  if (existing) return existing;

  const currentUser = getStoredUser();
  if (currentUser?.uid === uid) {
    return ensureProfile(currentUser);
  }

  return null;
}

export async function fetchAllPrograms() {
  if (activeSupabase && activeSchemaName) {
    try {
      const sessions = await queryOrgTable(activeSupabase, activeSchemaName, "sessions");
      const speakers = await queryOrgTable(activeSupabase, activeSchemaName, "speakers");
      const speakerMap = new Map(speakers.map((s) => [s.id, s]));

      const programs = sessions.map((session) => {
        const sp = session.speaker_id ? speakerMap.get(session.speaker_id) : null;
        const startDt = session.start_time ? new Date(session.start_time) : null;
        const endDt = session.end_time ? new Date(session.end_time) : null;

        const dateStr = startDt ? startDt.toISOString().split("T")[0] : "";
        const startStr = startDt ? startDt.toTimeString().slice(0, 5) : "";
        const endStr = endDt ? endDt.toTimeString().slice(0, 5) : "";

        return {
          id: session.id,
          type: session.session_type,
          title: session.title,
          date: dateStr,
          start: startStr,
          end: endStr,
          room: session.room || "",
          chairs: session.metadata?.chairs || [],
          keynote: sp ? {
            name: sp.full_name,
            title: sp.title || "",
            company: sp.company || "",
            photo: sp.photo_url || "",
            bio: sp.bio || "",
          } : null,
          keynoteDescription: session.description || "",
          keynoteHasConference: false,
          conferences: [],
          streamId: session.metadata?.streamId || null,
          createdAt: session.created_at,
          updatedAt: session.updated_at,
        };
      });
      return sortByDateThenTime(programs);
    } catch (e) {
      console.error("[localService.fetchAllPrograms] Supabase query failed:", e);
    }
  }
  return sortByDateThenTime(readPrograms());
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
  if (activeSupabase && activeSchemaName) {
    try {
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
    } catch (e) {
      console.error("[localService.fetchKeynoteSpeakers] Supabase query failed:", e);
    }
  }
  return readKeynotes();
}

export function subscribePrograms(onUpdate, onError) {
  if (activeSupabase && activeSchemaName) {
    fetchAllPrograms()
      .then(onUpdate)
      .catch(onError);
    return () => {};
  }

  if (typeof window === "undefined") {
    return () => {};
  }

  try {
    onUpdate(sortByDateThenTime(readPrograms()));
  } catch (error) {
    if (onError) onError(error);
  }

  const handleStorage = (event) => {
    if (event.key === PROGRAMS_STORAGE_KEY) {
      try {
        onUpdate(sortByDateThenTime(readPrograms()));
      } catch (error) {
        if (onError) onError(error);
      }
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export async function fetchNotifications(limitCount = 4) {
  if (activeSupabase && activeSchemaName) {
    try {
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
    } catch (e) {
      console.error("[localService.fetchNotifications] Supabase query failed:", e);
    }
  }
  return readNotifications().slice(0, limitCount);
}

export async function fetchStreams() {
  if (activeSupabase && activeSchemaName) {
    try {
      const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
      if (events && events.length > 0) {
        return events[0].settings?.streams || [];
      }
      return [];
    } catch (e) {
      console.error("[localService.fetchStreams] Supabase query failed:", e);
    }
  }
  return readAdminStreams();
}

export async function fetchStreamQuestions(streamId) {
  const all = readStreamQuestions();
  if (streamId) return all.filter((q) => q.streamId === streamId);
  return all;
}

export async function submitStreamQuestion({ author, message, clerkUserId = null, streamId = null, sessionTitle = null, presentationTitle = null }) {
  if (activeSupabase && activeSchemaName) {
    try {
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
    } catch (e) {
      console.error("[localService.submitStreamQuestion] failed:", e);
    }
  }

  const current = readStreamQuestions();
  const question = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: author || "Web User",
    message,
    createdAt: new Date().toISOString(),
    isAnswered: false,
    streamId,
    sessionTitle,
    presentationTitle,
  };
  writeJson(STREAM_QUESTIONS_STORAGE_KEY, [question, ...current]);
  return question;
}


export async function updateUserProfile(uid, profileId, updatedData) {
  if (activeSupabase && activeSchemaName) {
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
  
  // Fallback to local storage
  const profiles = getProfileStore();
  profiles[uid] = {
    ...profiles[uid],
    ...updatedData,
  };
  setProfileStore(profiles);
  return profiles[uid];
}
