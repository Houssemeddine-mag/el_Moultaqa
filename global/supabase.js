// ============================================================================
// Shared Supabase Client — Clerk JWT Integration
// ============================================================================
// This module creates a Supabase client that automatically attaches the
// Clerk session JWT to every request. This JWT contains the user's org_id,
// which Supabase RLS uses to enforce tenant isolation.
//
// Usage in any React component:
//
//   import { useClerkSupabase } from '@global/supabase';
//
//   function MyComponent() {
//     const supabase = useClerkSupabase();

//   }
//
// Or without React (for services/utilities):
//
//   import { createClerkSupabaseClient } from '@global/supabase';
//
//   const client = createClerkSupabaseClient(getTokenFn);
// ============================================================================

import { createClient } from "@supabase/supabase-js";
import { useSession, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

// ---------------------------------------------------------------------------
// Environment variables (set in each app's .env.local)
// ---------------------------------------------------------------------------
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate at module load time — fail fast if misconfigured
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. " +
    "Create a .env.local file in your app directory with these values."
  );
}

// ---------------------------------------------------------------------------
// createClerkSupabaseClient
// ---------------------------------------------------------------------------
// Creates a Supabase client that uses a Clerk session token for auth.
// The token is fetched lazily on every request via the `accessToken` callback.
//
// @param {Function} getToken — A function that returns a Promise<string|null>.
//   Typically: () => getToken({ template: 'supabase' })
// ---------------------------------------------------------------------------
let _anonClient = null;
const _sessionClients = new Map();
let _warnedMissingToken = false;

export function createClerkSupabaseClient(getToken) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (url, options = {}) => {
        let token = null;
        try {
          token = await getToken();
        } catch (e) {
          console.warn("[supabase] getToken failed (is the 'supabase' JWT template configured?):", e?.message || e);
        }
        const headers = new Headers(options.headers || {});
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        } else if (!_warnedMissingToken) {
          _warnedMissingToken = true;
          console.warn(
            "[supabase] Clerk token is null — requests will be unauthenticated and org_query will reject with 'user is not authenticated'. " +
            "Check Clerk Dashboard → JWT Templates → 'supabase' template exists."
          );
        }
        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
}

export function getAnonClient() {
  if (!_anonClient) {
    _anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _anonClient;
}

// ---------------------------------------------------------------------------
// useClerkSupabase (React Hook)
// ---------------------------------------------------------------------------
// Convenience hook that creates a memoized Supabase client using the current
// Clerk session. The client is recreated only when the session changes.
//
// Prerequisites:
//   - Your app must be wrapped in <ClerkProvider>
//   - You must have a "supabase" JWT template configured in Clerk Dashboard
//     (Clerk Dashboard → JWT Templates → New template → Supabase)
//     The template must include the `org_id` claim.
// ---------------------------------------------------------------------------
export function useClerkSupabase() {
  const { session } = useSession();
  const sessionId = session?.id || null;

  const supabase = useMemo(() => {
    if (!session) {
      // Unauthenticated singleton (will be blocked by RLS for protected tables)
      return getAnonClient();
    }

    // Cache per session id — avoids "Multiple GoTrueClient instances" churn
    // when the session object identity changes on re-render.
    if (_sessionClients.has(session.id)) {
      return _sessionClients.get(session.id);
    }
    const client = createClerkSupabaseClient(() =>
      session.getToken({ template: "supabase" })
    );
    _sessionClients.set(session.id, client);
    // Keep cache small (single active session in practice)
    if (_sessionClients.size > 3) {
      const firstKey = _sessionClients.keys().next().value;
      _sessionClients.delete(firstKey);
    }
    return client;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return supabase;
}

// ---------------------------------------------------------------------------
// useSupabaseWithOrg (React Hook)
// ---------------------------------------------------------------------------
// Extended hook that also resolves the current org's schema name from the
// path prefix. Use this in the webapp/admin where org context matters.
//
// Returns: { supabase, orgSlug, orgSchema, isReady }
// ---------------------------------------------------------------------------
export function useSupabaseWithOrg(orgSlugOverride) {
  const supabase = useClerkSupabase();
  const { orgId } = useClerkAuth();

  // The org slug can come from the URL path or be passed directly
  const orgSlug = orgSlugOverride || null;

  return {
    supabase,
    orgSlug,
    orgId,
    isReady: !!supabase && !!orgId,
  };
}

// ---------------------------------------------------------------------------
// Helper: Query data from the org's schema via RPC
// ---------------------------------------------------------------------------
// Since each org has its own Postgres schema, we use the org_query RPC
// function to access tables in the correct schema.
//
// @param {SupabaseClient} supabase — Authenticated client
// @param {string} schemaName — The org's schema name (e.g. "org_2abc123")
// @param {string} tableName — Table to query (e.g. "events")
// @param {object} options — { filters, limit, offset, orderBy, orderDir }
// ---------------------------------------------------------------------------
export async function queryOrgTable(supabase, schemaName, tableName, options = {}) {
  const {
    filters = {},
    limit = 100,
    offset = 0,
    orderBy = "created_at",
    orderDir = "DESC",
  } = options;

  const { data, error } = await supabase.rpc("org_query", {
    p_schema_name: schemaName,
    p_table_name: tableName,
    p_filters: filters,
    p_limit: limit,
    p_offset: offset,
    p_order_by: orderBy,
    p_order_dir: orderDir,
  });

  if (error) {
    console.error(`[supabase] org_query error (${schemaName}.${tableName}):`, error);
    throw error;
  }

  return data || [];
}

// ---------------------------------------------------------------------------
// Helper: Resolve an org slug to its schema details
// ---------------------------------------------------------------------------
export async function resolveOrgSlug(supabase, slug) {
  const { data, error } = await supabase.rpc("resolve_org_slug", {
    p_slug: slug,
  });

  if (error) {
    console.error("[supabase] resolve_org_slug error:", error);
    return null;
  }

  // RPC returns an array; we want the first (and only) row
  return Array.isArray(data) ? data[0] || null : data;
}
