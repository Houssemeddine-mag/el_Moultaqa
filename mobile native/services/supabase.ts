import 'react-native-get-random-values';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Direct port of Mobile/lib/services/supabase_service.dart.
// Auth is anonymous until Clerk is wired: tokenProvider stays null and
// every request falls back to the anon key (same as Flutter pre-auth).

export type Row = { [key: string]: any };

const SCHEMA_KEY = 'elm_schema_name';
const ORG_SLUG_KEY = 'elm_org_slug';
const RPC_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: Promise<T>, ms = RPC_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Request timed out after ${ms}ms`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function rpc<T>(
  client: SupabaseClient,
  fn: string,
  params: Record<string, unknown>,
): Promise<T> {
  // client.rpc() returns a PostgrestFilterBuilder (thenable, not a Promise),
  // so assimilate it into a real promise before racing against the timeout.
  const result = (await withTimeout(
    Promise.resolve(client.rpc(fn, params)),
  )) as unknown as { data: T; error: unknown };
  if (result.error) throw result.error;
  return result.data;
}

async function readCache(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writeCache(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Cache is best-effort (e.g. restricted web contexts).
  }
}

class SupabaseService {
  private static _client: SupabaseClient | null = null;

  static schemaName: string | null = null;
  static orgSlug: string | null = null;
  static orgDetails: Row | null = null;
  static currentUserEmail: string | null = null;

  // Set by the Clerk layer later. Null = anonymous (anon key) requests.
  static tokenProvider: (() => Promise<string | null>) | null = null;

  static get client(): SupabaseClient {
    if (!SupabaseService._client) {
      throw new Error(
        'SupabaseService is not initialized. Call initialize() first.',
      );
    }
    return SupabaseService._client;
  }

  static get isConfigured(): boolean {
    return SupabaseService._client !== null;
  }

  static async initialize(): Promise<void> {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

    if (!url || !anonKey) {
      throw new Error(
        'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are not configured. Fill mobile native/.env.',
      );
    }

    SupabaseService._client = createClient(url, anonKey, {
      accessToken: async () => {
        if (SupabaseService.tokenProvider) {
          return SupabaseService.tokenProvider();
        }
        return null;
      },
    });

    SupabaseService.schemaName = await readCache(SCHEMA_KEY);
  }

  // Resolves the org slug dynamically (anon-safe, mirrors Flutter).
  static async resolveOrg(slug?: string): Promise<void> {
    const cached = await readCache(ORG_SLUG_KEY);
    const envSlug = process.env.EXPO_PUBLIC_ORG_SLUG ?? '';
    const resolved =
      slug && slug.length > 0
        ? slug
        : cached && cached.length > 0
          ? cached
          : envSlug;
    if (!resolved) {
      throw new Error('orgSlug is not configured');
    }

    SupabaseService.orgSlug = resolved;
    const data = await rpc<Row | Row[]>(SupabaseService.client, 'resolve_org_slug', {
      p_slug: resolved,
    });
    if (data == null) {
      throw new Error(`Failed to resolve organization slug: ${resolved}`);
    }
    if (Array.isArray(data) && data.length === 0) {
      throw new Error(`No organization found for slug: ${resolved}`);
    }

    const org: Row = Array.isArray(data) ? { ...data[0] } : { ...(data as Row) };
    SupabaseService.schemaName = org['schema_name']?.toString() ?? null;
    SupabaseService.orgDetails = org;
    if (SupabaseService.schemaName) {
      await writeCache(SCHEMA_KEY, SupabaseService.schemaName);
    }
    await writeCache(ORG_SLUG_KEY, resolved);
  }

  static async queryOrgTable(
    tableName: string,
    options: {
      filters?: Record<string, unknown>;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDir?: string;
    } = {},
  ): Promise<Row[]> {
    const {
      filters = {},
      limit = 100,
      offset = 0,
      orderBy = 'created_at',
      orderDir = 'DESC',
    } = options;
    if (!SupabaseService.schemaName) {
      await SupabaseService.resolveOrg();
    }
    const response = await rpc<Row[]>(SupabaseService.client, 'org_query', {
      p_schema_name: SupabaseService.schemaName,
      p_table_name: tableName,
      p_filters: filters,
      p_limit: limit,
      p_offset: offset,
      p_order_by: orderBy,
      p_order_dir: orderDir,
    });
    return (response ?? []).map((item) => ({ ...item }));
  }

  static async insertOrgTable(
    tableName: string,
    data: Record<string, unknown>,
  ): Promise<Row> {
    if (!SupabaseService.schemaName) {
      await SupabaseService.resolveOrg();
    }
    const response = await rpc<Row>(SupabaseService.client, 'org_insert', {
      p_schema_name: SupabaseService.schemaName,
      p_table_name: tableName,
      p_data: data,
    });
    return { ...(response ?? {}) };
  }

  static async updateOrgTable(
    tableName: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<Row> {
    if (!SupabaseService.schemaName) {
      await SupabaseService.resolveOrg();
    }
    const response = await rpc<Row>(SupabaseService.client, 'org_update', {
      p_schema_name: SupabaseService.schemaName,
      p_table_name: tableName,
      p_id: id,
      p_data: data,
    });
    return { ...(response ?? {}) };
  }

  static async deleteOrgTable(tableName: string, id: string): Promise<void> {
    if (!SupabaseService.schemaName) {
      await SupabaseService.resolveOrg();
    }
    await rpc(SupabaseService.client, 'org_delete', {
      p_schema_name: SupabaseService.schemaName,
      p_table_name: tableName,
      p_id: id,
    });
  }

  static async setOrgSlug(slug: string): Promise<void> {
    SupabaseService.orgSlug = slug;
    await writeCache(ORG_SLUG_KEY, slug);
  }

  // ── Discovery API (public, anon-safe — mirrors Landing DiscoveryPage) ──

  static async listDiscoveryEvents(): Promise<Row[]> {
    const result = (await withTimeout(
      Promise.resolve(SupabaseService.client.rpc('list_discovery_events')),
    )) as unknown as { data: Row[]; error: unknown };
    if (result.error) throw result.error;
    return (result.data ?? []).map((item) => ({ ...item }));
  }

  static async listDiscoveryCategories(): Promise<string[]> {
    const result = (await withTimeout(
      Promise.resolve(SupabaseService.client.rpc('list_discovery_categories')),
    )) as unknown as { data: Row[] | string[]; error: unknown };
    if (result.error) throw result.error;
    return ((result.data ?? []) as Array<Row | string>)
      .map((item) =>
        typeof item === 'string'
          ? item
          : (item['category']?.toString() ?? ''),
      )
      .filter((category) => category.length > 0);
  }

  static async fetchOrgDetails(slug: string): Promise<Row | null> {
    try {
      const data = await rpc<Row | Row[]>(
        SupabaseService.client,
        'resolve_org_slug',
        { p_slug: slug },
      );
      if (data == null) return null;
      if (Array.isArray(data) && data.length === 0) return null;
      return Array.isArray(data) ? { ...data[0] } : { ...(data as Row) };
    } catch {
      return null;
    }
  }

  // ── Streams API ───────────────────────────────────────────────────

  static async getStreams(): Promise<Row[]> {
    const events = await SupabaseService.queryOrgTable('events', { limit: 1 });
    if (events.length === 0) return [];
    const settings = events[0]['settings'] as Row | undefined;
    const streams = settings?.['streams'] as Row[] | undefined;
    if (!Array.isArray(streams)) return [];
    return streams.map((stream) => ({ ...stream }));
  }

  // ── Attendee data APIs ────────────────────────────────────────────

  static async getConferenceConfig(): Promise<Row | null> {
    const events = await SupabaseService.queryOrgTable('events', { limit: 1 });
    if (events.length === 0) return null;
    const ev = events[0];
    const settings = (ev['settings'] as Row | undefined) ?? {};
    return {
      name: ev['title'],
      shortName: ev['short_name'],
      themeColor: settings['themeColor'] ?? '#0d7e52',
      logo: ev['cover_image_url'] ?? settings['logo_url'] ?? '',
      startDate: ev['start_date'],
      endDate: ev['end_date'],
      sponsors: settings['sponsors'] ?? [],
      collaborators: settings['collaborators'] ?? [],
      attendees: settings['attendees'] ?? [],
      stream_url: settings['stream_url'] ?? ev['stream_url'] ?? '',
      location: settings['location'] ?? '',
      description: settings['description'] ?? '',
      website:
        ev['website'] ??
        settings['website'] ??
        settings['conferenceWebsite'] ??
        settings['web_url'] ??
        '',
      settings,
    };
  }

  static async getSessions(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('sessions', {
      orderBy: 'start_time',
      orderDir: 'ASC',
    });
  }

  static async getSpeakers(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('speakers', {
      orderBy: 'full_name',
      orderDir: 'ASC',
    });
  }

  static async getMyProfile(email?: string): Promise<Row | null> {
    if (!email) return null;
    const users = await SupabaseService.queryOrgTable('users', {
      filters: { email },
      limit: 1,
    });
    if (users.length === 0) return null;
    return users[0];
  }

  static async updateMyProfile(id: string, data: Record<string, unknown>): Promise<Row> {
    return SupabaseService.updateOrgTable('users', id, data);
  }

  static async getNotifications(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('notifications', {
      orderBy: 'created_at',
      orderDir: 'DESC',
    });
  }

  // Fetches notifications for one org without disturbing the currently
  // selected org (context is saved and restored). Call sequentially —
  // never in parallel — because the org context is global.
  static async getNotificationsForOrg(slug: string): Promise<Row[]> {
    const prevSlug = SupabaseService.orgSlug;
    const prevSchema = SupabaseService.schemaName;
    const prevDetails = SupabaseService.orgDetails;
    try {
      await SupabaseService.resolveOrg(slug);
      return await SupabaseService.getNotifications();
    } finally {
      SupabaseService.orgSlug = prevSlug;
      SupabaseService.schemaName = prevSchema;
      SupabaseService.orgDetails = prevDetails;
      if (prevSlug) {
        await writeCache(ORG_SLUG_KEY, prevSlug);
      }
      if (prevSchema) {
        await writeCache(SCHEMA_KEY, prevSchema);
      }
    }
  }

  static async getQuestions(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('questions', {
      orderBy: 'created_at',
      orderDir: 'DESC',
    });
  }

  static async submitQuestion(data: Record<string, unknown>): Promise<void> {
    await SupabaseService.insertOrgTable('questions', data);
  }

  // ── Feedback API ──────────────────────────────────────────────────

  static async submitFeedback(data: Record<string, unknown>): Promise<void> {
    await SupabaseService.insertOrgTable('feedback', data);
  }

  // ── Admin data APIs ───────────────────────────────────────────────

  static async getAllUsers(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('users', {
      orderBy: 'full_name',
      orderDir: 'ASC',
    });
  }

  static async getAllQuestions(): Promise<Row[]> {
    return SupabaseService.queryOrgTable('questions', {
      orderBy: 'created_at',
      orderDir: 'DESC',
    });
  }

  static async sendNotification(title: string, content: string): Promise<void> {
    await SupabaseService.insertOrgTable('notifications', { title, content });
  }

  static async answerQuestion(questionId: string, answer: string): Promise<void> {
    await SupabaseService.updateOrgTable('questions', questionId, { answer });
  }

  static async deleteNotification(id: string): Promise<void> {
    await SupabaseService.deleteOrgTable('notifications', id);
  }
}

export default SupabaseService;
