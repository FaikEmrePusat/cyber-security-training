import { useEffect, useState, type FormEvent } from "react";
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

  const sendLink = async (e: FormEvent) => {
    e.preventDefault();
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
        : `Check ${email}. Open the Sign in link in the email — it should return to ${redirectTo}`,
    );
  };

  const verifyPaste = async (e: FormEvent) => {
    e.preventDefault();
    const client = supabase;
    if (!client) return;
    setBusy(true);
    setMsg(null);
    const input = code.trim();
    let errorMsg: string | null = null;

    const trySessionFromUrl = async (raw: string): Promise<boolean> => {
      let url: URL;
      try {
        url = new URL(raw);
      } catch {
        return false;
      }
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token") ?? url.searchParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token") ?? url.searchParams.get("refresh_token");
      if (!accessToken || !refreshToken) return false;
      const { error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      errorMsg = error?.message ?? null;
      return true;
    };

    const handledSession = await trySessionFromUrl(input);
    if (!handledSession) {
      try {
        const url = new URL(input);
        const tokenHash = url.searchParams.get("token_hash") ?? url.searchParams.get("token");
        const type = (url.searchParams.get("type") ?? "magiclink") as "magiclink" | "email" | "signup";
        if (tokenHash) {
          const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
          errorMsg = error?.message ?? null;
        } else if (/^\d{6,10}$/.test(input)) {
          const { error } = await client.auth.verifyOtp({
            email: email.trim(),
            token: input,
            type: "email",
          });
          errorMsg = error?.message ?? null;
        } else {
          errorMsg =
            "Paste (1) the redirect URL that has #access_token=…, (2) the email verify link, or (3) a 6-digit code.";
        }
      } catch {
        if (/^\d{6,10}$/.test(input)) {
          const { error } = await client.auth.verifyOtp({
            email: email.trim(),
            token: input,
            type: "email",
          });
          errorMsg = error?.message ?? null;
        } else {
          errorMsg =
            "Paste (1) the redirect URL that has #access_token=…, (2) the email verify link, or (3) a 6-digit code.";
        }
      }
    }

    setBusy(false);
    if (errorMsg) {
      setMsg(`Sign-in failed: ${errorMsg}`);
      return;
    }
    setMsg("Signed in. Syncing…");
    await refreshCloud();
    setMsg("Signed in and synced.");
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
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
          <form onSubmit={(e) => void sendLink(e)} className="field" style={{ marginTop: "0.75rem" }}>
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
              Send login link
            </button>
          </form>
          <form onSubmit={(e) => void verifyPaste(e)} className="field" style={{ marginTop: "0.75rem" }}>
            <label htmlFor="ledger-sync-code">Or paste redirect URL / email link / code</label>
            <input
              id="ledger-sync-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste localhost…#access_token=… or email link or code"
              autoComplete="one-time-code"
            />
            <button type="submit" className="cta cta--ghost" disabled={busy} style={{ marginTop: "0.5rem" }}>
              Sign in
            </button>
          </form>
        </>
      )}
      {msg ? (
        <p className={`msg ${msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") ? "err" : "ok"}`} role="status">
          {msg}
        </p>
      ) : null}
      <p className="wk-meta" style={{ marginTop: "0.75rem" }}>
        Same email as Usta. Click the email Sign in link — it must open this Ledger site (not Usta :5174). After
        sign-in, Today / Record / self-check sync across devices.
      </p>
    </div>
  );
}
