/**
 * Ledger 6-digit email OTP (bypasses locked Magic Link templates / Auth email rate limits).
 *
 * Delivery: ntfy.sh topic (instant) + optional FormSubmit email (5s timeout).
 * Session: after correct code, set a one-time password and return it for signInWithPassword
 * (avoids generateLink Auth email rate limits).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_EMAIL = (Deno.env.get("LEDGER_OTP_EMAIL") ?? "faikemrep@gmail.com").toLowerCase();
const NTFY_TOPIC = Deno.env.get("LEDGER_NTFY_TOPIC") ?? "cyber-ledger-faik-otp";
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

function randomCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000;
  return String(n).padStart(6, "0");
}

function randomPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const b64 = btoa(String.fromCharCode(...bytes)).replace(/[^a-zA-Z0-9]/g, "");
  return `${b64}Aa1!`;
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
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
    const code = randomCode();
    const codeHash = await sha256Hex(`${email}:${code}`);

    const { error: upErr } = await admin.from("ledger_otp").upsert({
      email,
      code_hash: codeHash,
      token_hash: null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attempts: 0,
      updated_at: new Date().toISOString(),
    });
    if (upErr) return json({ error: upErr.message }, 500);

    const text = `Cyber Ledger code: ${code} (expires in 10 minutes)`;
    const ntfyUrl = `https://ntfy.sh/${NTFY_TOPIC}`;
    let ntfyOk = false;
    try {
      const ntfyRes = await fetchWithTimeout(
        ntfyUrl,
        {
          method: "POST",
          headers: { Title: "Cyber Ledger login code", Priority: "high" },
          body: text,
        },
        8000,
      );
      ntfyOk = ntfyRes.ok;
    } catch {
      ntfyOk = false;
    }

    let mailOk = false;
    try {
      const mailRes = await fetchWithTimeout(
        FORMSUBMIT,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Cyber Ledger login code",
            message: `Your Cyber Ledger 6-digit code is: ${code}\n\nIt expires in 10 minutes.`,
          }),
        },
        5000,
      );
      mailOk = mailRes.ok;
    } catch {
      mailOk = false;
    }

    if (!ntfyOk && !mailOk) {
      return json({ error: "Could not deliver the code (ntfy and email both failed). Try again." }, 502);
    }

    return json({
      ok: true,
      message: ntfyOk
        ? `Code sent. Open https://ntfy.sh/${NTFY_TOPIC} (and check Gmail).`
        : `Code emailed to ${email}.`,
      ntfy: ntfyOk ? `https://ntfy.sh/${NTFY_TOPIC}` : null,
    });
  }

  if (body.action === "verify") {
    const code = (body.code ?? "").trim();
    if (!/^\d{6,10}$/.test(code)) return json({ error: "Enter the 6-digit code" }, 400);

    const { data: row, error: selErr } = await admin
      .from("ledger_otp")
      .select("code_hash, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();
    if (selErr) return json({ error: selErr.message }, 500);
    if (!row?.code_hash) return json({ error: "No code requested. Send a code first." }, 400);
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

    // Prefer password handshake over generateLink (avoids Auth email rate limit).
    const { data: listed, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) return json({ error: listErr.message }, 500);
    let user = listed.users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (!user) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: randomPassword(),
      });
      if (createErr || !created.user) {
        return json({ error: createErr?.message ?? "Could not create user" }, 400);
      }
      user = created.user;
    }

    const tempPassword = randomPassword();
    const { error: passErr } = await admin.auth.admin.updateUserById(user.id, {
      password: tempPassword,
      email_confirm: true,
    });
    if (passErr) return json({ error: passErr.message }, 400);

    await admin.from("ledger_otp").delete().eq("email", email);

    return json({
      ok: true,
      mode: "password",
      email,
      password: tempPassword,
    });
  }

  return json({ error: "Unknown action" }, 400);
});
