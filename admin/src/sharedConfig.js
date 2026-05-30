const STORAGE_KEY = "elm_conference_config";

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

export function getConferenceConfig() {
  return readJson(STORAGE_KEY, null);
}

export function saveConferenceConfig(config) {
  const payload = {
    ...config,
    sponsors: (config.sponsors || []).filter(Boolean),
    collaborators: (config.collaborators || []).filter(Boolean),
    attendees: (config.attendees || []).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };
  writeJson(STORAGE_KEY, payload);
  return payload;
}

export function subscribeConferenceConfig(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const current = getConferenceConfig();
  listener(current);

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      listener(getConferenceConfig());
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
