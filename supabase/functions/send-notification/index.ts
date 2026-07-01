import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") || "";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") || "";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY") || "";
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "";
const SMTP_PORT = Deno.env.get("SMTP_PORT") || "587";
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "notifications@elmoultaqa.com";
const FROM_NAME = Deno.env.get("FROM_NAME") || "ElMoultaqa";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function sendViaResend(to: string, subject: string, body: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to, subject, text: body }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend: ${res.status} ${err}`);
  }
}

async function sendViaMailgun(to: string, subject: string, body: string): Promise<void> {
  const form = new FormData();
  form.append("from", `${FROM_NAME} <${FROM_EMAIL}>`);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", body);

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: { "Authorization": `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mailgun: ${res.status} ${err}`);
  }
}

async function sendViaSendgrid(to: string, subject: string, body: string): Promise<void> {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      content: [{ type: "text/plain", value: body }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SendGrid: ${res.status} ${err}`);
  }
}

async function sendViaSmtp(to: string, subject: string, body: string): Promise<void> {
  const { SmtpClient } = await import("https://deno.land/x/smtp/mod.ts");
  const client = new SmtpClient();
  await client.connectTLS({
    hostname: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    username: SMTP_USER,
    password: SMTP_PASS,
  });
  await client.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    content: body,
  });
  await client.close();
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, body" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let provider = "none";

    if (RESEND_API_KEY) {
      await sendViaResend(to, subject, body);
      provider = "resend";
    } else if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
      await sendViaMailgun(to, subject, body);
      provider = "mailgun";
    } else if (SENDGRID_API_KEY) {
      await sendViaSendgrid(to, subject, body);
      provider = "sendgrid";
    } else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      await sendViaSmtp(to, subject, body);
      provider = "smtp";
    }

    await supabaseAdmin.from("notification_logs").insert({
      recipient: to,
      subject,
      status: provider !== "none" ? "sent" : "logged",
      provider,
      body_preview: body.slice(0, 500),
    });

    return new Response(
      JSON.stringify({
        success: true,
        provider,
        note:
          provider !== "none"
            ? `Sent via ${provider}`
            : "Email logged. Set one of: RESEND_API_KEY, MAILGUN_API_KEY + MAILGUN_DOMAIN, SENDGRID_API_KEY, or SMTP_HOST + SMTP_USER + SMTP_PASS.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
