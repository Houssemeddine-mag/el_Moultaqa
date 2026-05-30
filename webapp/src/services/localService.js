import { loginUser as backendLoginUser } from "../backend";

const AUTH_STORAGE_KEY = "elm_webapp_auth_user";
const PROFILE_STORAGE_KEY = "elm_webapp_profiles";
const PROGRAMS_STORAGE_KEY = "elm_webapp_programs";
const KEYNOTES_STORAGE_KEY = "elm_webapp_keynotes";
const NOTIFICATIONS_STORAGE_KEY = "elm_webapp_notifications";
const STREAM_QUESTIONS_STORAGE_KEY = "elm_stream_questions";
const SPONSORS_STORAGE_KEY = "elm_sponsors";
const CONFERENCE_CONFIG_STORAGE_KEY = "elm_conference_config";

const authListeners = new Set();

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

function readConferenceConfig() {
  return readJson(CONFERENCE_CONFIG_STORAGE_KEY, null);
}

export async function fetchConferenceConfig() {
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
  return readSponsors();
}

export function subscribeAuthState(listener) {
  const currentUser = getStoredUser();
  listener(currentUser);
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

export async function signInWithGooglePopup() {
  const user = {
    uid: "template-google-user",
    email: "a@a.a",
    displayName: "Template User",
    providerData: [{ providerId: "google.com" }],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  };
  setStoredUser(user);
  ensureProfile(user);
  return { user };
}

export async function signInWithGithubPopup() {
  const user = {
    uid: "template-github-user",
    email: "a@a.a",
    displayName: "Template User",
    providerData: [{ providerId: "github.com" }],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  };
  setStoredUser(user);
  ensureProfile(user);
  return { user };
}

export async function signInWithEmailPassword(email, password) {
  const result = await backendLoginUser(email, password);
  const user = {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.email?.split("@")[0] || "Template User",
    providerData: [{ providerId: "password" }],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  };
  setStoredUser(user);
  ensureProfile(user);
  return { user };
}

export async function createUserWithEmailAndPasswordAuth(email) {
  const user = {
    uid: `template-${Date.now()}`,
    email,
    displayName: email?.split("@")[0] || "Template User",
    providerData: [{ providerId: "password" }],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  };
  setStoredUser(user);
  ensureProfile(user);
  return { user };
}

export async function sendPasswordResetEmailAuth() {
  return;
}

export async function signOutUser() {
  setStoredUser(null);
}

export async function fetchUserProfile(uid) {
  if (!uid) return null;
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
  return sortByDateThenTime(readPrograms());
}

export async function fetchUpcomingPrograms(limitCount = 2) {
  return sortByDateThenTime(readPrograms()).slice(0, limitCount);
}

export async function fetchKeynotePrograms() {
  return sortByDateThenTime(readPrograms()).filter(
    (program) => program.keynote && program.keynote.name,
  );
}

export async function fetchKeynoteSpeakers() {
  return readKeynotes();
}

export function subscribePrograms(onUpdate, onError) {
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
  return readNotifications().slice(0, limitCount);
}

export async function submitStreamQuestion({ author, message }) {
  const current = readStreamQuestions();
  const question = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: author || "Web User",
    message,
    createdAt: new Date().toISOString(),
    isAnswered: false,
  };
  writeJson(STREAM_QUESTIONS_STORAGE_KEY, [question, ...current]);
  return question;
}
