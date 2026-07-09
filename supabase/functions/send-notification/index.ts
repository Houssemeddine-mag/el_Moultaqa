import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.14";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL") || SMTP_USER;
const SMTP_FROM_NAME = Deno.env.get("SMTP_FROM_NAME") || "ElMoultaqa Super Admin";

const missing: string[] = [];
if (!SUPABASE_URL) missing.push("SUPABASE_URL");
if (!SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
if (!SMTP_HOST) missing.push("SMTP_HOST");
if (!SMTP_USER) missing.push("SMTP_USER");
if (!SMTP_PASS) missing.push("SMTP_PASS");
if (missing.length > 0) {
  console.error(`[send-notification] Missing required env vars: ${missing.join(", ")}`);
  Deno.exit(1);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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
  if (req.method === "OPTIONS") return json({ ok: true }, 200);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // 1. Verify caller is authenticated with a valid JWT
  const authHeader = req.headers.get("authorization");
  const callerToken = authHeader?.replace(/^Bearer /i, "").trim();
  if (!callerToken) return json({ error: "Missing authorization header" }, 401);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${callerToken}` } },
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData?.user) {
    console.error("[send-notification] Auth verification failed:", authError);
    return json({ error: "Unauthorized — invalid or expired token" }, 401);
  }

  const userId = authData.user.id;
  console.log(`[send-notification] Authenticated caller: ${userId}`);

  // 2. Parse request body
  let to: string, subject: string, body: string;
  try {
    const reqBody = await req.json();
    to = reqBody.to;
    subject = reqBody.subject;
    body = reqBody.body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!to || !subject || !body) {
    return json({ error: "Missing required fields: to, subject, body" }, 400);
  }

  // 3. Send email
  console.log(`[send-notification] Sending to ${to} via ${SMTP_HOST}:${SMTP_PORT} as ${SMTP_USER}`);

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to,
      subject,
      text: body,
    });

    console.log(`[send-notification] Message sent: ${info.messageId}`);

    return json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(`[send-notification] SMTP error: ${err.message}`, err);
    return json(
      { error: err.message, code: err.code, responseCode: err.responseCode },
      500
    );
  }
});
