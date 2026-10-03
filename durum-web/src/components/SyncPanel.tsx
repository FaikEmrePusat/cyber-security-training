import { useEffect, useState, type FormEvent } from "react";
import { clearPublishToken } from "../data/publicProgress";
import { requestLedgerOtp, verifyLedgerOtp } from "../lib/ledgerOtp";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { useDurum } from "../store";

const DEFAULT_EMAIL = "faikemrep@gmail.com";

export function SyncPanel() {
  const { syncStatus, syncEmail, refreshCloud } = useDurum();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState("");
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
    const result = await requestLedgerOtp(email, password);
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
    setPassword("");
    setMsg("Signed in. Syncing…");
    await refreshCloud();
    setMsg("Signed in and synced.");
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    clearPublishToken();
    setCode("");
    setPassword("");
    setMsg("Signed out. Publish token cleared from this browser. Local data stays until you clear site data.");
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

  const msgIsErr =
    !!msg &&
    /fail|error|wrong|could not|did not return|required|locked|too many|not configured/i.test(msg);

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
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="ledger-sync-password" style={{ marginTop: "0.5rem" }}>
              Site password
            </label>
            <input
              id="ledger-sync-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your owner password"
            />
            <button
              type="submit"
              className="cta"
              disabled={busy || !password.trim()}
              style={{ marginTop: "0.5rem" }}
            >
              Send 6-digit code
            </button>
          </form>
          {msg ? (
            <p className={`msg ${msgIsErr ? "err" : "ok"}`} role="status" style={{ marginTop: "0.75rem" }}>
              {msg}
            </p>
          ) : null}
          {code.trim().length >= 6 ? (
            <p
              className="msg ok"
              role="status"
              style={{
                marginTop: "0.5rem",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.12em",
                fontSize: "1.25rem",
              }}
            >
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
            <button
              type="submit"
              className="cta"
              disabled={busy || code.trim().length < 6}
              style={{ marginTop: "0.5rem" }}
            >
              Sign in with code
            </button>
          </form>
        </>
      )}
      {syncEmail && msg ? (
        <p className={`msg ${msgIsErr ? "err" : "ok"}`} role="status">
          {msg}
        </p>
      ) : null}
      <p className="wk-meta" style={{ marginTop: "0.75rem" }}>
        Sign-in: owner email + site password → 6-digit code on this device → Sign in with code. Cloud sync and
        Publish require this session. Magic-link login is disabled so the password cannot be bypassed.
      </p>
    </div>
  );
}
