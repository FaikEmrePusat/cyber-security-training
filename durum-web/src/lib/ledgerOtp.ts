import { supabase, supabaseConfigured } from "./supabase";

const FN = "ledger-otp";

export async function requestLedgerOtp(
  email: string,
): Promise<{ ok: true; message: string; code?: string; ntfy?: string | null } | { ok: false; message: string }> {
  if (!supabaseConfigured || !supabase) {
    return { ok: false, message: "Cloud is not configured on this build." };
  }
  const { data, error } = await supabase.functions.invoke(FN, {
    body: { action: "request", email: email.trim().toLowerCase() },
  });
  if (error) {
    const detail =
      data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : error.message;
    return { ok: false, message: detail };
  }
  if (data?.error) return { ok: false, message: String(data.error) };
  return {
    ok: true,
    message: data?.message ?? "Code ready.",
    code: typeof data?.code === "string" ? data.code : undefined,
    ntfy: typeof data?.ntfy === "string" ? data.ntfy : null,
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
    body: { action: "verify", email: email.trim().toLowerCase(), code: code.trim() },
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
