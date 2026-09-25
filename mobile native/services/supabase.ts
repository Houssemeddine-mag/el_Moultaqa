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

  // Resolves the org slug dynamically (anon-safe).
  // No org is ever baked in: the caller passes the slug explicitly
  // (org picker after login). Env is only a build-time default fallback;
  // cache holds the last-used org. Explicit param always wins.
  static async resolveOrg(slug?: string): Promise<void> {
    const cached = await readCache(ORG_SLUG_KEY);
    const envSlug = process.env.EXPO_PUBLIC_ORG_SLUG ?? '';
    const resolved =
      slug && slug.length > 0
        ? slug
        : envSlug && envSlug.length > 0
          ? envSlug
          : cached ?? '';
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

  // Attendee self-registration — the ONLY way for non-members to join an org.
  // Public orgs: pass code undefined. Private orgs: pass the registration code.
  // Takes the slug as a param so it works for ANY org, never a baked-in one.
  // Mirrors 008_gated_registration.sql register_attendee.
  static async registerAttendee(params: {
    slug: string;
    clerkUserId: string;
    email: string;
    fullName?: string;
    code?: string | null;
  }): Promise<Row> {
    const response = await rpc<Row>(SupabaseService.client, 'register_attendee', {
      p_slug: params.slug,
      p_clerk_user_id: params.clerkUserId,
      p_email: params.email,
      p_full_name: params.fullName ?? '',
      p_registration_code: params.code ?? null,
    });
    return { ...(response ?? {}) };
  }

  // Minimal public info for an org (no membership required).
  // Used to decide public (auto-join) vs private (ask for code) for ANY slug.
  static async getOrgPublicInfo(slug: string): Promise<Row | null> {
    try {
      const data = await rpc<Row>(
        SupabaseService.client,
        'get_org_public_info',
        { p_slug: slug },
      );
      return data == null ? null : { ...data };
    } catch {
      return null;
    }
  }

  // All orgs where the current user is owner/member, disabled filtered.
  // Requires a valid Clerk JWT (authenticated only). Works for ANY org.
  static async listMyOrganizations(): Promise<Row[]> {
    try {
      const data = await rpc<Row[]>(
        SupabaseService.client,
        'list_my_organizations',
        {},
      );
      return (data ?? []).map((o) => ({ ...o }));
    } catch (e) {
      // Log the full PostgREST body (code/details/hint), not just the status.
      console.error('[supabase.listMyOrganizations] RPC failed:', JSON.stringify(e));
      throw e;
    }
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

  // ── Webapp-parity business logic (same mappings as webapp/src/services/localService.js) ──
  // All functions throw when the service has no resolved org (callers fall back to mock data).

  static async checkUserMembership(clerkUserId: string): Promise<boolean> {
    if (!clerkUserId || !SupabaseService.schemaName) return false;
    try {
      const users = await SupabaseService.queryOrgTable('users', {
        filters: { clerk_user_id: clerkUserId },
        limit: 1,
      });
      return users.length > 0;
    } catch (e) {
      console.error('[supabase.checkUserMembership] failed:', e);
      return false;
    }
  }

  static async fetchUserProfile(
    uid: string,
    email: string,
    displayName: string,
  ): Promise<Row | null> {
    if (!uid) return null;
    const users = await SupabaseService.queryOrgTable('users', {
      filters: { clerk_user_id: uid },
      limit: 1,
    });
    let u: Row | undefined;
    if (users.length > 0) {
      u = users[0];
    } else {
      console.log('[supabase.fetchUserProfile] User not found, auto-inserting...');
      u = await SupabaseService.insertOrgTable('users', {
        clerk_user_id: uid,
        email: email || '',
        full_name: displayName || '',
        role: 'attendee',
      });
    }
    const meta = (u['metadata'] as Row | undefined) ?? {};
    return {
      id: u['id'],
      uid: u['clerk_user_id'],
      email: u['email'],
      displayName: u['full_name'] || (u['email'] as string)?.split('@')[0] || 'User',
      university: u['institution'] || '',
      schoolLevel: meta['schoolLevel'] || "Master's Degree",
      role: u['role'],
      avatar: u['avatar_url'],
      photoURL: u['avatar_url'],
      createdAt: u['created_at'],
      lastSignedIn: u['updated_at'],
      gender: meta['gender'] || 'male',
      country: meta['country'] || 'Algeria',
      province: meta['province'] || 'Constantine',
      phone: u['phone'] || '',
      phoneNumber: u['phone'] || '',
      jobTitle: u['bio'] || '',
      organization: u['institution'] || '',
      bio: u['bio'] || '',
      isProfileComplete: true,
    };
  }

  static async updateUserProfile(
    uid: string,
    profileId: string,
    updatedData: Row,
  ): Promise<Row> {
    let dbId = profileId;
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        profileId || '',
      );
    if (!isUuid) {
      const users = await SupabaseService.queryOrgTable('users', {
        filters: { clerk_user_id: uid },
        limit: 1,
      });
      if (users.length > 0) {
        dbId = users[0]['id'] as string;
      } else {
        const inserted = await SupabaseService.insertOrgTable('users', {
          clerk_user_id: uid,
          email: updatedData['email'] || '',
          full_name: updatedData['displayName'] || '',
          role: 'attendee',
        });
        dbId = inserted['id'] as string;
      }
    }
    const data = await SupabaseService.updateOrgTable('users', dbId, {
      full_name: updatedData['displayName'],
      institution: updatedData['university'],
      phone: updatedData['phone'],
      bio: updatedData['bio'],
      metadata: {
        schoolLevel: updatedData['schoolLevel'],
        gender: updatedData['gender'],
        country: updatedData['country'],
        province: updatedData['province'],
      },
    });
    const meta = (data['metadata'] as Row | undefined) ?? {};
    return {
      id: data['id'],
      uid: data['clerk_user_id'],
      email: data['email'],
      displayName: data['full_name'] || (data['email'] as string)?.split('@')[0] || 'User',
      university: data['institution'] || '',
      schoolLevel: meta['schoolLevel'] || "Master's Degree",
      role: data['role'],
      avatar: data['avatar_url'],
      photoURL: data['avatar_url'],
      createdAt: data['created_at'],
      lastSignedIn: data['updated_at'],
      gender: meta['gender'] || 'male',
      country: meta['country'] || 'Algeria',
      province: meta['province'] || 'Constantine',
      phone: data['phone'] || '',
      phoneNumber: data['phone'] || '',
      jobTitle: data['bio'] || '',
      organization: data['institution'] || '',
      bio: data['bio'] || '',
      isProfileComplete: true,
    };
  }

  static async fetchAllPrograms(): Promise<Row[]> {
    const sessions = await SupabaseService.queryOrgTable('sessions');
    const speakers = await SupabaseService.queryOrgTable('speakers');
    const speakerMap = new Map<string, Row>(speakers.map((s) => [s['id'] as string, s]));
    const programs = sessions.map((session) => {
      const sp = session['speaker_id']
        ? speakerMap.get(session['speaker_id'] as string) ?? null
        : null;
      const meta = (session['metadata'] as Row | undefined) ?? {};
      // Same wall-clock parsing as webapp/admin (string split, no TZ conversion).
      let dateStr = '';
      let startStr = '';
      let endStr = '';
      let endDateStr = '';
      const startTime = session['start_time'] as string | undefined;
      const endTime = session['end_time'] as string | undefined;
      if (startTime) {
        dateStr = startTime.split('T')[0] || '';
        startStr = startTime.split('T')[1]?.substring(0, 5) || '';
      }
      if (endTime) {
        endDateStr = endTime.split('T')[0] || '';
        endStr = endTime.split('T')[1]?.substring(0, 5) || '';
        if (endDateStr === dateStr) endDateStr = '';
      }
      const rawConferences = Array.isArray(meta['conferences'])
        ? (meta['conferences'] as Row[])
        : [];
      const conferences = rawConferences.map((c, idx) => ({
        id: c['id'] || `${session['id']}-conf-${idx}`,
        title: c['title'] || '',
        presenter: c['presenter'] || '',
        affiliation: c['affiliation'] || '',
        start: c['start'] || '',
        end: c['end'] || '',
        time: c['time'] || '',
        room: c['room'] || '',
        resume: c['resume'] || c['description'] || '',
        description: c['resume'] || c['description'] || '',
        isKeynote: Boolean(c['isKeynote']),
      }));
      const metaKeynote = (meta['keynote'] as Row | null) ?? null;
      const keynote = sp
        ? {
            name: sp['full_name'],
            title: sp['title'] || '',
            company: sp['company'] || '',
            affiliation: sp['company'] || metaKeynote?.['affiliation'] || '',
            photo: sp['photo_url'] || '',
            image: sp['photo_url'] || metaKeynote?.['image'] || '',
            bio: sp['bio'] || '',
          }
        : metaKeynote && metaKeynote['name']
          ? {
              name: metaKeynote['name'],
              title: metaKeynote['title'] || '',
              company: metaKeynote['company'] || metaKeynote['affiliation'] || '',
              affiliation: metaKeynote['affiliation'] || '',
              photo: metaKeynote['image'] || metaKeynote['photo'] || '',
              image: metaKeynote['image'] || metaKeynote['photo'] || '',
              bio: metaKeynote['bio'] || '',
            }
          : null;
      return {
        id: session['id'],
        type: session['session_type'] || 'talk',
        title: session['title'],
        date: dateStr,
        start: startStr,
        end: endStr || null,
        endDate: endDateStr || null,
        room: session['room'] || '',
        chairs: Array.isArray(meta['chairs']) ? meta['chairs'] : [],
        keynote,
        keynoteDescription: meta['keynoteDescription'] || session['description'] || '',
        keynoteHasConference: conferences.some((c) => c.isKeynote),
        conferences,
        streamId: meta['streamId'] || null,
        createdAt: session['created_at'],
        updatedAt: session['updated_at'],
      };
    });
    return programs.slice().sort((a, b) => {
      const dateCompare = (a['date'] || '').localeCompare(b['date'] || '');
      if (dateCompare !== 0) return dateCompare;
      return (a['start'] || '').localeCompare(b['start'] || '');
    });
  }

  static async fetchKeynoteSpeakers(): Promise<Row[]> {
    const speakers = await SupabaseService.queryOrgTable('speakers');
    return speakers.map((sp) => ({
      id: sp['id'],
      name: sp['full_name'],
      title: sp['title'] || '',
      company: sp['company'] || '',
      photo: sp['photo_url'] || '',
      bio: sp['bio'] || '',
      socials: sp['social_links'] || {},
    }));
  }

  static async fetchSponsors(): Promise<Row[]> {
    const config = await SupabaseService.getConferenceConfig();
    const sponsors = config?.['sponsors'];
    if (!Array.isArray(sponsors)) return [];
    // Keep logo-less sponsors too — webapp renders them as text chips.
    return sponsors.map((s: unknown, index: number) => {
      if (typeof s === 'string') {
        return {
          id: `sponsor-${index}`,
          name: s,
          website: '',
          tier: 'partner',
          logoData: '',
          image: '',
          imageData: '',
          hasLogo: false,
        };
      }
      const obj = s as Row;
      const name = obj['name'] || obj['title'] || `Sponsor ${index + 1}`;
      const logo =
        obj['logoData'] || obj['logo'] || obj['logoUrl'] || obj['image'] || obj['imageData'] || obj['photo'] || '';
      return {
        id: obj['id'] || `sponsor-${index}`,
        name,
        website: obj['website'] || obj['url'] || '',
        tier: obj['tier'] || 'partner',
        order: obj['order'] ?? index,
        logoData: logo,
        image: logo,
        imageData: logo,
        hasLogo: Boolean(logo),
      };
    });
  }

  static async fetchNotifications(limitCount = 4): Promise<Row[]> {
    const data = await SupabaseService.queryOrgTable('notifications', {
      limit: limitCount,
      orderBy: 'created_at',
      orderDir: 'DESC',
    });
    return (data || []).map((item) => ({
      id: item['id'],
      title: item['title'],
      message: item['message'],
      type: item['type'] || 'info',
      isPinned: Boolean(item['is_pinned']),
      createdAt: item['created_at'] || item['createdAt'],
    }));
  }

  static async fetchStreamQuestions(streamId: string): Promise<Row[]> {
    const questions = await SupabaseService.queryOrgTable('questions', {
      filters: { stream_id: streamId },
      orderBy: 'created_at',
      orderDir: 'DESC',
    });
    return (questions || []).map((q) => ({
      id: q['id'],
      author: q['author_name'] || 'Attendee',
      message: q['message'],
      createdAt: q['created_at'],
      isAnswered: Boolean(q['is_answered']),
      answer: q['answer'] || '',
      streamId: q['stream_id'],
      sessionTitle: q['session_title'],
      presentationTitle: q['presentation_title'],
    }));
  }

  static async submitStreamQuestion(params: {
    author: string;
    message: string;
    clerkUserId?: string | null;
    streamId?: string | null;
    sessionTitle?: string | null;
    presentationTitle?: string | null;
  }): Promise<Row> {
    const data = await SupabaseService.insertOrgTable('questions', {
      author_name: params.author || 'Attendee',
      clerk_user_id: params.clerkUserId ?? null,
      message: params.message,
      is_answered: false,
      is_pinned: false,
      stream_id: params.streamId ?? null,
      session_title: params.sessionTitle ?? null,
      presentation_title: params.presentationTitle ?? null,
    });
    return {
      id: data['id'],
      author: data['author_name'],
      message: data['message'],
      createdAt: data['created_at'],
      isAnswered: data['is_answered'],
    };
  }

  static async fetchPresentationFeedback(presentationKey: string): Promise<Row[]> {
    const data = await SupabaseService.queryOrgTable('feedback', {
      filters: { session_title: presentationKey },
      orderBy: 'created_at',
      orderDir: 'DESC',
      limit: 100,
    });
    return (data || []).map((f) => ({
      id: f['id'],
      rating: Number(f['presentation_rating'] ?? f['presenter_rating'] ?? 0) || 0,
      comment: f['comment'] || '',
      userEmail: f['user_email'] || '',
      createdAt: f['created_at'],
    }));
  }

  static async submitPresentationFeedback(params: {
    presentationKey: string;
    rating: number;
    comment: string;
    userEmail: string;
  }): Promise<Row> {
    if (!params.presentationKey) throw new Error('Missing presentation reference');
    const safeRating = Math.min(5, Math.max(1, Number(params.rating) || 0));
    if (!safeRating) throw new Error('Please select a star rating');
    const data = await SupabaseService.insertOrgTable('feedback', {
      session_title: params.presentationKey,
      presentation_rating: safeRating,
      presenter_rating: safeRating,
      comment: (params.comment || '').trim(),
      user_email: params.userEmail || '',
    });
    return {
      id: data['id'],
      rating: Number(data['presentation_rating'] ?? safeRating) || safeRating,
      comment: data['comment'] || '',
      userEmail: data['user_email'] || '',
      createdAt: data['created_at'],
    };
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
