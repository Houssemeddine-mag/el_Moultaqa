// ============================================================================
// Supabase Edge Function: Clerk Webhook Handler
// ============================================================================
// Triggered by Clerk webhooks when an organization is created or deleted.
//
// Webhook events handled:
//   - organization.created  → provisions a new org schema + records
//   - organization.deleted  → drops the org schema + cleans up records
//
// Environment variables (set via `supabase secrets set`):
//   - SUPABASE_URL              → Your Supabase project URL
//   - SUPABASE_SERVICE_ROLE_KEY → Service role key (bypasses RLS)
//   - CLERK_WEBHOOK_SIGNING_SECRET → Webhook signing secret from Clerk dashboard
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Webhook } from "https://esm.sh/svix@1";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CLERK_WEBHOOK_SIGNING_SECRET = Deno.env.get("CLERK_WEBHOOK_SIGNING_SECRET")!;

// Default plan name assigned to new organizations
const DEFAULT_PLAN_NAME = "free";

// ---------------------------------------------------------------------------
// Supabase admin client (service role — bypasses RLS)
// ---------------------------------------------------------------------------
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ---------------------------------------------------------------------------
// Utility: Sanitize Clerk org ID into a valid Postgres schema name
// ---------------------------------------------------------------------------
function toSchemaName(clerkOrgId: string): string {
  return clerkOrgId.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

// ---------------------------------------------------------------------------
// Utility: Generate a URL-safe slug from the org name
// ---------------------------------------------------------------------------
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // Remove special chars
    .replace(/[\s_]+/g, "-")     // Spaces/underscores → hyphens
    .replace(/-+/g, "-")         // Collapse multiple hyphens
    .replace(/^-|-$/g, "");      // Trim leading/trailing hyphens
}

// ---------------------------------------------------------------------------
// Handler: organization.created
// ---------------------------------------------------------------------------
async function handleOrgCreated(payload: {
  id: string;
  name: string;
  slug: string;
  created_by: string;
}): Promise<Response> {
  const { id: clerkOrgId, name, slug: clerkSlug, created_by } = payload;
  const schemaName = toSchemaName(clerkOrgId);
  const slug = clerkSlug || toSlug(name);

  console.log(`[clerk-webhook] Creating org: ${clerkOrgId} → schema: ${schemaName}`);

  // Step 1: Provision the org schema (tables + RLS)
  const { error: schemaError } = await supabaseAdmin.rpc("provision_org_schema", {
    p_schema_name: schemaName,
  });

  if (schemaError) {
    console.error("[clerk-webhook] Schema creation failed:", schemaError);
    return new Response(
      JSON.stringify({ error: "Schema creation failed", details: schemaError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Step 2: Insert the organization record into public.organizations
  const { data: orgData, error: orgError } = await supabaseAdmin
    .from("organizations")
    .insert({
      clerk_org_id: clerkOrgId,
      name,
      slug,
      schema_name: schemaName,
      owner_clerk_id: created_by,
    })
    .select("id")
    .single();

  if (orgError) {
    console.error("[clerk-webhook] Org insert failed:", orgError);
    // Rollback: drop the schema we just created
    await supabaseAdmin.rpc("drop_org_schema", { p_schema_name: schemaName });
    return new Response(
      JSON.stringify({ error: "Org record creation failed", details: orgError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Step 3: Create a default subscription (free plan)
  const { data: planData } = await supabaseAdmin
    .from("plans")
    .select("id")
    .eq("name", DEFAULT_PLAN_NAME)
    .single();

  if (planData) {
    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        organization_id: orgData.id,
        plan_id: planData.id,
        status: "active",
        current_period_start: new Date().toISOString(),
      });

    if (subError) {
      console.warn("[clerk-webhook] Subscription creation failed (non-fatal):", subError);
    }
  }

  // Step 4: Insert the org creator as an admin in the org's users table
  // We use raw SQL because the table is in a dynamic schema
  const { error: userError } = await supabaseAdmin.rpc("_internal_insert_org_user", {
    p_schema_name: schemaName,
    p_clerk_user_id: created_by,
    p_email: "",       // Will be updated when user data is available
    p_full_name: "",   // Will be updated when user data is available
    p_role: "admin",
  });

  if (userError) {
    console.warn("[clerk-webhook] Admin user creation failed (non-fatal):", userError);
  }

  console.log(`[clerk-webhook] Org ${clerkOrgId} provisioned successfully.`);
  return new Response(
    JSON.stringify({ success: true, organization_id: orgData.id, schema: schemaName }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// ---------------------------------------------------------------------------
// Handler: organization.deleted
// ---------------------------------------------------------------------------
async function handleOrgDeleted(payload: { id: string }): Promise<Response> {
  const { id: clerkOrgId } = payload;

  console.log(`[clerk-webhook] Deleting org: ${clerkOrgId}`);

  // Look up the organization to get the schema name
  const { data: orgData, error: lookupError } = await supabaseAdmin
    .from("organizations")
    .select("id, schema_name")
    .eq("clerk_org_id", clerkOrgId)
    .single();

  if (lookupError || !orgData) {
    console.warn("[clerk-webhook] Org not found for deletion:", clerkOrgId);
    return new Response(
      JSON.stringify({ error: "Organization not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Drop the org schema (CASCADE removes all tables)
  const { error: dropError } = await supabaseAdmin.rpc("drop_org_schema", {
    p_schema_name: orgData.schema_name,
  });

  if (dropError) {
    console.error("[clerk-webhook] Schema drop failed:", dropError);
  }

  // Delete the organization record (cascades to subscriptions)
  const { error: deleteError } = await supabaseAdmin
    .from("organizations")
    .delete()
    .eq("id", orgData.id);

  if (deleteError) {
    console.error("[clerk-webhook] Org delete failed:", deleteError);
    return new Response(
      JSON.stringify({ error: "Org deletion failed", details: deleteError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(`[clerk-webhook] Org ${clerkOrgId} deleted successfully.`);
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req: Request) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // ---------------------------------------------------------------------------
  // Verify the webhook signature
  // ---------------------------------------------------------------------------
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn("[clerk-webhook] Missing svix headers — rejecting request.");
    return new Response("Missing webhook verification headers", { status: 400 });
  }

  const body = await req.text();

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch (err) {
    console.error("[clerk-webhook] Signature verification failed:", err);
    return new Response("Invalid webhook signature", { status: 401 });
  }

  console.log(`[clerk-webhook] Received event: ${event.type}`);

  // ---------------------------------------------------------------------------
  // Route to the appropriate handler
  // ---------------------------------------------------------------------------
  switch (event.type) {
    case "organization.created":
      return handleOrgCreated(event.data as {
        id: string;
        name: string;
        slug: string;
        created_by: string;
      });

    case "organization.deleted":
      return handleOrgDeleted(event.data as { id: string });

    default:
      // Acknowledge events we don't handle (prevents Clerk from retrying)
      console.log(`[clerk-webhook] Unhandled event type: ${event.type}`);
      return new Response(
        JSON.stringify({ received: true, type: event.type }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
  }
});
