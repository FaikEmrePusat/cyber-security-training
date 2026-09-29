import { supabase, supabaseConfigured } from "./supabase";

const FN = "ledger-otp";

export async function requestLedgerOtp(
  email: string,
): Promise<{ ok: true; message: string; ntfy?: string | null } | { ok: false; message: string }> {
  if (!supabaseConfigured || !supabase) {
    return { ok: false, message: "Cloud is not configured on this build." };
  }
  const { data, error } = await supabase.functions.invoke(FN, {
    body: { action: "request", email: email.trim().toLowerCase() },
  });
  if (error) return { ok: false, message: error.message };
  if (data?.error) return { ok: false, message: String(data.error) };
  return {
    ok: true,
    message: data?.message ?? "Code sent.",
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
  if (error) return { ok: false, message: error.message };
  if (data?.error) return { ok: false, message: String(data.error) };

  if (data?.mode === "password" && data.email && data.password) {
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: String(data.email),
      password: String(data.password),
    });
    if (signErr) return { ok: false, message: signErr.message };
    return { ok: true };
  }

  const tokenHash = data?.token_hash as string | undefined;
  const type = (data?.type as "magiclink" | "email" | undefined) ?? "magiclink";
  if (!tokenHash) return { ok: false, message: "Server did not return a login token." };

  const { error: vErr } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });
  if (vErr) return { ok: false, message: vErr.message };
  return { ok: true };
}
