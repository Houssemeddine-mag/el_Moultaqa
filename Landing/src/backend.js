export function onAuthStateChanged(listener) {
  listener(null);
  return () => {};
}

export async function registerUser(email, password) {
  return { uid: `guest-${Date.now()}`, email };
}

export async function loginUser(email, password) {
  return { uid: `guest-${Date.now()}`, email };
}

export async function signInWithGoogle() {
  return { uid: `guest-${Date.now()}`, email: "guest@example.com" };
}

export async function logoutUser() {
  return;
}

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

export async function saveConferenceConfig(conference) {
  const payload = {
    ...conference,
    sponsors: (conference.sponsors || []).filter(Boolean),
    collaborators: (conference.collaborators || []).filter(Boolean),
    attendees: (conference.attendees || []).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };
  writeJson(CONFERENCE_CONFIG_STORAGE_KEY, payload);
  const slug = conference.shortName
    ? conference.shortName.trim().toLowerCase().replace(/\s+/g, "-")
    : `conf-${Date.now()}`;
  return slug;
}

export async function getConferenceConfig() {
  return readJson(CONFERENCE_CONFIG_STORAGE_KEY, null);
}
