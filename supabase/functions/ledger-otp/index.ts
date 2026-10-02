/**
 * Owner 6-digit OTP for Cyber Ledger and Usta (same Supabase project / email).
 * Pass body.app = "usta" | "ledger" (default) for notify copy only.
 * Delivery channels (ntfy/email) are best-effort; the code is always returned in the
 * JSON response so Sign-in works even when Edge egress to mail providers is blocked.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_EMAIL = (Deno.env.get("LEDGER_OTP_EMAIL") ?? "faikemrep@gmail.com").toLowerCase();
const NTFY_TOPIC_LEDGER = Deno.env.get("LEDGER_NTFY_TOPIC") ?? "cyber-ledger-faik-otp";
const NTFY_TOPIC_USTA = Deno.env.get("USTA_NTFY_TOPIC") ?? NTFY_TOPIC_LEDGER;
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

type AppId = "ledger" | "usta";

function resolveApp(raw: unknown): AppId {
  return raw === "usta" ? "usta" : "ledger";
}

function productLabel(app: AppId): string {
  return app === "usta" ? "Usta" : "Cyber Ledger";
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

  let body: { action?: string; email?: string; code?: string; app?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (email !== ALLOWED_EMAIL) {
    return json({ error: "This OTP is limited to the owner email." }, 403);
  }

  const app = resolveApp(body.app);
  const product = productLabel(app);
  const ntfyTopic = app === "usta" ? NTFY_TOPIC_USTA : NTFY_TOPIC_LEDGER;

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

    // Best-effort notify; never fail the request if these are blocked from Edge.
    const text = `${product} code: ${code}`;
    try {
      await fetchWithTimeout(
        `https://ntfy.sh/${ntfyTopic}`,
        { method: "POST", headers: { Title: `${product} login code`, Priority: "high" }, body: text },
        3000,
      );
    } catch {
      /* ignore */
    }
    try {
      await fetchWithTimeout(
        FORMSUBMIT,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ _subject: `${product} login code`, message: text }),
        },
        3000,
      );
    } catch {
      /* ignore */
    }

    // Always return the plaintext code for the owner allowlist path — email/ntfy
    // are best-effort; on-device fill is the primary sign-in UX.
    return json({
      ok: true,
      code,
      message: "Code ready — filled below",
      ntfy: `https://ntfy.sh/${ntfyTopic}`,
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
