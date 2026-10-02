import { useEffect, useState, type FormEvent } from "react";
import { requestLedgerOtp, verifyLedgerOtp } from "../lib/ledgerOtp";
import { ledgerAuthRedirectTo, supabase, supabaseConfigured } from "../lib/supabase";
import { useDurum } from "../store";

const DEFAULT_EMAIL = "faikemrep@gmail.com";

export function SyncPanel() {
  const { syncStatus, syncEmail, refreshCloud } = useDurum();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setMsg(null);
    });
  }, []);

  if (!supabaseConfigured) {
    return (
      <p className="msg err" role="status">
        Cloud sync is not configured on this build (missing VITE_SUPABASE_URL / ANON_KEY). Local backup still works.
      </p>
    );
  }

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const result = await requestLedgerOtp(email);
    setBusy(false);
    if (!result.ok) {
      setMsg(result.message);
      return;
    }
    setCode(result.code);
    setMsg(`${result.message}: ${result.code}`);
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const result = await verifyLedgerOtp(email, code);
    setBusy(false);
    if (!result.ok) {
      setMsg(`Sign-in failed: ${result.message}`);
      return;
    }
    setMsg("Signed in. Syncing…");
    await refreshCloud();
    setMsg("Signed in and synced.");
  };

  const sendMagicLinkFallback = async () => {
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const redirectTo = ledgerAuthRedirectTo();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(false);
    setMsg(
      error
        ? error.message
        : `Magic link sent (fallback). It should open ${redirectTo}. Prefer the 6-digit code above.`,
    );
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCode("");
    setMsg("Signed out. Data on this browser stays until you clear site data.");
  };

  const statusLabel =
    syncStatus === "synced"
      ? "Synced"
      : syncStatus === "pending"
        ? "Pending…"
        : syncStatus === "signed-out"
          ? "Signed out"
          : syncStatus === "error"
            ? "Error"
            : "Local only";

  return (
    <div className="sync-panel">
      <p className="wk-meta">
        Status: <strong>{statusLabel}</strong>
        {syncEmail ? ` · ${syncEmail}` : ""}
      </p>
      {syncEmail ? (
        <div className="actions" style={{ margin: "0.75rem 0" }}>
          <button type="button" className="cta" disabled={busy} onClick={() => void refreshCloud()}>
            Sync now
          </button>
          <button type="button" className="cta cta--ghost" disabled={busy} onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={(e) => void sendCode(e)} className="field" style={{ marginTop: "0.75rem" }}>
            <label htmlFor="ledger-sync-email">Email</label>
            <input
              id="ledger-sync-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="cta" disabled={busy} style={{ marginTop: "0.5rem" }}>
              Send 6-digit code
            </button>
          </form>
          {msg ? (
            <p
              className={`msg ${msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("wrong") || msg.toLowerCase().includes("could not") || msg.toLowerCase().includes("did not return") ? "err" : "ok"}`}
              role="status"
              style={{ marginTop: "0.75rem" }}
            >
              {msg}
            </p>
          ) : null}
          {code.trim().length >= 6 ? (
            <p className="msg ok" role="status" style={{ marginTop: "0.5rem", fontFamily: "ui-monospace, monospace", letterSpacing: "0.12em", fontSize: "1.25rem" }}>
              {code.trim()}
            </p>
          ) : null}
          <form onSubmit={(e) => void verifyCode(e)} className="field" style={{ marginTop: "0.75rem" }}>
            <label htmlFor="ledger-sync-code">6-digit code (filled on this device)</label>
            <input
              id="ledger-sync-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <button type="submit" className="cta" disabled={busy || code.trim().length < 6} style={{ marginTop: "0.5rem" }}>
              Sign in with code
            </button>
          </form>
          <p className="wk-meta" style={{ marginTop: "0.75rem" }}>
            <button type="button" className="cta cta--ghost" disabled={busy} onClick={() => void sendMagicLinkFallback()}>
              Send magic link instead
            </button>
          </p>
        </>
      )}
      {syncEmail && msg ? (
        <p
          className={`msg ${msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("wrong") || msg.toLowerCase().includes("could not") ? "err" : "ok"}`}
          role="status"
        >
          {msg}
        </p>
      ) : null}
      <p className="wk-meta" style={{ marginTop: "0.75rem" }}>
        Send 6-digit code shows and fills the code on this device (email is optional backup) — then tap Sign in with
        code. Same on phone when you sign in there.
      </p>
    </div>
  );
}
