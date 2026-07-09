// supabase/functions/trigger-mobile-build/index.ts
// Supabase Edge Function — triggers a GitHub Actions build for a branded APK.
// Auth flow: caller passes their Clerk JWT, which we forward to begin_mobile_build
// so the DB-level admin/org checks run as the real user (not bypassed with service role).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GH_PAT = Deno.env.get("GH_PAT");

const missing: string[] = [];
if (!SUPABASE_URL) missing.push("SUPABASE_URL");
if (!SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
if (!SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!GH_PAT) missing.push("GH_PAT");
if (missing.length > 0) {
  console.error(`[trigger-mobile-build] Missing required env vars: ${missing.join(", ")}`);
  Deno.exit(1);
}
const GH_REPO = Deno.env.get("GH_REPO") ?? "Houssemeddine-mag/el_Moultaqa";
const GH_WORKFLOW = "build-mobile-app.yml";
const GH_REF = "main";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("CORS_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // 1. Extract caller's Bearer JWT
  const authHeader = req.headers.get("authorization");
  const callerToken = authHeader?.replace(/^Bearer /i, "").trim();
  if (!callerToken) return json({ error: "Missing authorization header" }, 401);

  // 2. Parse org_slug from request body
  let org_slug: string;
  try {
    const body = await req.json();
    org_slug = body?.org_slug;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (!org_slug) return json({ error: "org_slug is required" }, 400);
  if (!/^[a-z0-9_-]{1,64}$/.test(org_slug)) {
    return json({ error: "Invalid org_slug format" }, 400);
  }

  // 3. Call begin_mobile_build as the CALLER (their token, not service role)
  //    The DB function does the admin/org-membership check via auth.jwt().
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${callerToken}` } },
  });

  const { data: beginResult, error: beginError } = await userClient
    .rpc("begin_mobile_build", { p_org_slug: org_slug });

  if (beginError) {
    console.error("[trigger-mobile-build] begin_mobile_build RPC error:", beginError);
    return json({ error: "Database error", detail: beginError.message }, 500);
  }

  if (!beginResult?.ok) {
    const err = beginResult?.error ?? "unknown";
    const statusMap: Record<string, number> = {
      org_not_found: 404,
      forbidden_org_mismatch: 403,
      forbidden_not_admin: 403,
      already_building: 409,
    };
    return json({ error: err }, statusMap[err] ?? 400);
  }

  // 4. Fire GitHub Actions workflow_dispatch (passing only org_slug — branding
  //    is fetched fresh from the DB at build time, not from client-provided values).
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${GH_REPO}/actions/workflows/${GH_WORKFLOW}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GH_PAT}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ ref: GH_REF, inputs: { org_slug } }),
      }
    );

    if (!ghRes.ok) {
      const ghBody = await ghRes.text();
      console.error("[trigger-mobile-build] GitHub dispatch failed:", ghRes.status, ghBody);
      // Immediately write the failure so the admin panel never gets stuck at "Building…"
      await serviceClient.rpc("set_mobile_build_result", {
        p_org_slug: org_slug,
        p_success: false,
        p_app_url: null,
        p_error: `github_dispatch_failed: HTTP ${ghRes.status}`,
      }).catch((e: unknown) => console.error("[trigger-mobile-build] Failed to write failure result:", e));
      return json({ error: "github_dispatch_failed", status: ghRes.status }, 502);
    }

    console.log(`[trigger-mobile-build] Build dispatched for org: ${org_slug}`);
    return json({ ok: true, message: "Build started. Status will update via Realtime." });

  } catch (dispatchErr: unknown) {
    const msg = dispatchErr instanceof Error ? dispatchErr.message : String(dispatchErr);
    console.error("[trigger-mobile-build] Dispatch network error:", msg);
    await serviceClient.rpc("set_mobile_build_result", {
      p_org_slug: org_slug,
      p_success: false,
      p_app_url: null,
      p_error: `github_dispatch_failed: ${msg}`,
    }).catch((e: unknown) => console.error("[trigger-mobile-build] Failed to write failure result:", e));
    return json({ error: "github_dispatch_failed", detail: msg }, 502);
  }
});
