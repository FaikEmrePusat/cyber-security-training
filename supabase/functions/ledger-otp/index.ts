/**
 * Ledger 6-digit email OTP (bypasses locked Magic Link templates).
 *
 * Deploy: Supabase Dashboard → Edge Functions → Create function `ledger-otp`
 * Secrets: SUPABASE_SERVICE_ROLE_KEY (auto) + optional FORMSUBMIT_EMAIL (default below)
 *
 * First FormSubmit use sends a confirmation mail to that inbox — click once to activate.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_EMAIL = (Deno.env.get("LEDGER_OTP_EMAIL") ?? "faikemrep@gmail.com").toLowerCase();
const FORMSUBMIT = `https://formsubmit.co/ajax/${ALLOWED_EMAIL}`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""),
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Server misconfigured" }, 500);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let body: { action?: string; email?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (email !== ALLOWED_EMAIL) {
    return json({ error: "This Ledger OTP is limited to the owner email." }, 403);
  }

  if (body.action === "request") {
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !linkData?.properties) {
      return json({ error: linkErr?.message ?? "Could not create login challenge" }, 400);
    }

    const code =
      linkData.properties.email_otp ||
      String(Math.floor(100000 + Math.random() * 900000));
    const tokenHash = linkData.properties.hashed_token;
    const codeHash = await sha256Hex(`${email}:${code}`);

    const { error: upErr } = await admin.from("ledger_otp").upsert({
      email,
      code_hash: codeHash,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attempts: 0,
      updated_at: new Date().toISOString(),
    });
    if (upErr) return json({ error: upErr.message }, 500);

    const mailRes = await fetch(FORMSUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "Cyber Ledger login code",
        message: `Your Cyber Ledger 6-digit code is: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore the email.`,
        _template: "table",
      }),
    });
    if (!mailRes.ok) {
      const t = await mailRes.text();
      return json({
        error: `Could not send email (${mailRes.status}). If this is the first time, check inbox for a FormSubmit confirmation link, click it, then try again. ${t.slice(0, 200)}`,
      }, 502);
    }

    return json({ ok: true, message: `Code sent to ${email}` });
  }

  if (body.action === "verify") {
    const code = (body.code ?? "").trim();
    if (!/^\d{6,10}$/.test(code)) return json({ error: "Enter the 6-digit code" }, 400);

    const { data: row, error: selErr } = await admin
      .from("ledger_otp")
      .select("code_hash, token_hash, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();
    if (selErr) return json({ error: selErr.message }, 500);
    if (!row?.token_hash) return json({ error: "No code requested. Send a code first." }, 400);
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return json({ error: "Code expired. Request a new one." }, 400);
    }
    if ((row.attempts ?? 0) >= 8) return json({ error: "Too many attempts. Request a new code." }, 429);

    const codeHash = await sha256Hex(`${email}:${code}`);
    if (codeHash !== row.code_hash) {
      await admin
        .from("ledger_otp")
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq("email", email);
      return json({ error: "Wrong code." }, 401);
    }

    await admin.from("ledger_otp").delete().eq("email", email);

    return json({
      ok: true,
      token_hash: row.token_hash,
      type: "magiclink",
    });
  }

  return json({ error: "Unknown action" }, 400);
});
