import { supabase, supabaseConfigured } from "./supabase";

const FN = "ledger-otp";

const READY_MSG = "Code ready — filled below";

function parseInvokeBody(data: unknown): Record<string, unknown> | null {
  if (data == null) return null;
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  if (typeof data === "object") return data as Record<string, unknown>;
  return null;
}

/** Owner OTP is returned in the JSON body; accept string or numeric digits. */
function extractOtpCode(body: Record<string, unknown> | null): string | undefined {
  if (!body) return undefined;
  const raw = body.code;
  if (typeof raw === "string" && /^\d{6,10}$/.test(raw.trim())) return raw.trim();
  if (typeof raw === "number" && Number.isInteger(raw)) {
    const s = String(raw).padStart(6, "0");
    return /^\d{6,10}$/.test(s) ? s : undefined;
  }
  return undefined;
}

export async function requestLedgerOtp(
  email: string,
  password: string,
): Promise<{ ok: true; message: string; code: string; ntfy?: string | null } | { ok: false; message: string }> {
  if (!supabaseConfigured || !supabase) {
    return { ok: false, message: "Cloud is not configured on this build." };
  }
  if (!password.trim()) {
    return { ok: false, message: "Enter your site password." };
  }
  const { data, error } = await supabase.functions.invoke(FN, {
    body: {
      action: "request",
      email: email.trim().toLowerCase(),
      password,
      app: "ledger",
    },
  });
  const body = parseInvokeBody(data);
  if (error) {
    const detail = body && "error" in body ? String(body.error) : error.message;
    return { ok: false, message: detail };
  }
  if (body?.error) return { ok: false, message: String(body.error) };
  const code = extractOtpCode(body);
  if (!code) {
    return {
      ok: false,
      message:
        "Server did not return an on-device code. Redeploy the ledger-otp Edge Function, then try again.",
    };
  }
  return {
    ok: true,
    message: READY_MSG,
    code,
    ntfy: typeof body?.ntfy === "string" ? body.ntfy : null,
  };
}

export async function verifyLedgerOtp(
  email: string,
  code: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!supabaseConfigured || !supabase) {
    return { ok: false, message: "Cloud is not configured on this build." };
  }
  const { data, error } = await supabase.functions.invoke(FN, {
    body: { action: "verify", email: email.trim().toLowerCase(), code: code.trim(), app: "ledger" },
  });
  if (error) {
    const detail =
      data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : error.message;
    return { ok: false, message: detail };
  }
  if (data?.error) return { ok: false, message: String(data.error) };

  if (data?.mode === "password" && data.email && data.password) {
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: String(data.email),
      password: String(data.password),
    });
    if (signErr) return { ok: false, message: signErr.message };
    return { ok: true };
  }

  return { ok: false, message: "Unexpected server response." };
}
