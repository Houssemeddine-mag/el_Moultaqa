import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailData = {
      from: "ElMoultaqa <notifications@elmoultaqa.com>",
      to,
      subject,
      text: body,
    };

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend API error: ${res.status} ${err}`);
      }

      await supabaseAdmin.from("notification_logs").insert({
        recipient: to,
        subject,
        status: "sent",
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabaseAdmin.from("notification_logs").insert({
      recipient: to,
      subject,
      status: "logged",
      body_preview: body.slice(0, 200),
    });

    return new Response(
      JSON.stringify({
        success: true,
        note: "Email logged. Set RESEND_API_KEY to send emails.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
