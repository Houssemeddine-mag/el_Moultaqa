import * as SecureStore from 'expo-secure-store';

import type {
  DiscoveryEvent,
  DiscoverySettings,
  EnteredConference,
} from './types';
import { DEFAULT_SETTINGS } from './types';

// SecureStore values are small on some platforms, so JSON payloads are
// transparently chunked. Everything here is best-effort: failures resolve
// to in-memory defaults instead of throwing.
const CHUNK_SIZE = 1800;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const countRaw = await SecureStore.getItemAsync(`${key}#n`);
    if (countRaw == null) {
      const single = await SecureStore.getItemAsync(key);
      if (!single) return fallback;
      try {
        return JSON.parse(single) as T;
      } catch {
        return fallback;
      }
    }
    const count = Number.parseInt(countRaw, 10) || 0;
    let raw = '';
    for (let i = 0; i < count; i++) {
      raw += (await SecureStore.getItemAsync(`${key}#${i}`)) ?? '';
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    const raw = JSON.stringify(value);
    const parts: string[] = [];
    for (let i = 0; i < raw.length; i += CHUNK_SIZE) {
      parts.push(raw.slice(i, i + CHUNK_SIZE));
    }
    const oldCount =
      Number.parseInt(
        (await SecureStore.getItemAsync(`${key}#n`)) ?? '0',
        10,
      ) || 0;
    await SecureStore.setItemAsync(`${key}#n`, String(parts.length));
    for (let i = 0; i < parts.length; i++) {
      await SecureStore.setItemAsync(`${key}#${i}`, parts[i]);
    }
    for (let i = parts.length; i < oldCount; i++) {
      await SecureStore.deleteItemAsync(`${key}#${i}`);
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Best-effort persistence.
  }
}

async function clearKey(key: string): Promise<void> {
  try {
    const count =
      Number.parseInt(
        (await SecureStore.getItemAsync(`${key}#n`)) ?? '0',
        10,
      ) || 0;
    for (let i = 0; i < count; i++) {
      await SecureStore.deleteItemAsync(`${key}#${i}`);
    }
    await SecureStore.deleteItemAsync(`${key}#n`);
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Best-effort.
  }
}

const SAVED_KEY = 'elm_saved_events';
const ENTERED_KEY = 'elm_my_events';
const SETTINGS_KEY = 'elm_app_settings';
const SEEN_KEY = 'elm_alerts_seen_at';

export async function loadSaved(): Promise<DiscoveryEvent[]> {
  return readJson<DiscoveryEvent[]>(SAVED_KEY, []);
}

export async function saveSaved(events: DiscoveryEvent[]): Promise<void> {
  await writeJson(SAVED_KEY, events);
}

export async function loadEntered(): Promise<EnteredConference[]> {
  return readJson<EnteredConference[]>(ENTERED_KEY, []);
}

export async function saveEntered(
  entries: EnteredConference[],
): Promise<void> {
  await writeJson(ENTERED_KEY, entries);
}

// Records a conference open (most recent first, max 20 kept).
export async function rememberEntered(
  event: DiscoveryEvent,
): Promise<EnteredConference[]> {
  const current = await loadEntered();
  const entry: EnteredConference = {
    org_slug: event.org_slug,
    title: event.title,
    org_name: event.org_name,
    enteredAt: Date.now(),
  };
  const next = [
    entry,
    ...current.filter((item) => item.org_slug !== entry.org_slug),
  ].slice(0, 20);
  await saveEntered(next);
  return next;
}

export async function loadSettings(): Promise<DiscoverySettings> {
  const stored = await readJson<Partial<DiscoverySettings>>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
  );
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(
  settings: DiscoverySettings,
): Promise<void> {
  await writeJson(SETTINGS_KEY, settings);
}

export async function loadSavedSlugs(): Promise<string[]> {
  return readJson<string[]>('elm_saved_slugs', []);
}

export async function saveSavedSlugs(slugs: string[]): Promise<void> {
  await writeJson('elm_saved_slugs', slugs);
}

export async function loadMyConferences(): Promise<DiscoveryEvent[]> {
  return readJson<DiscoveryEvent[]>('elm_my_conferences', []);
}

export async function saveMyConferences(
  events: DiscoveryEvent[],
): Promise<void> {
  await writeJson('elm_my_conferences', events);
}

export async function loadAlertsSeenAt(): Promise<number> {
  return readJson<number>(SEEN_KEY, 0);
}

export async function saveAlertsSeenAt(timestamp: number): Promise<void> {
  await writeJson(SEEN_KEY, timestamp);
}

export async function clearDiscoveryData(
  what: 'saved' | 'entered' | 'all',
): Promise<void> {
  if (what === 'saved' || what === 'all') await clearKey(SAVED_KEY);
  if (what === 'entered' || what === 'all') await clearKey(ENTERED_KEY);
  if (what === 'all') await clearKey(SETTINGS_KEY);
}
