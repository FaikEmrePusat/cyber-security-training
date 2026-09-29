import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

/**
 * Browser-only client. Module load in Node (vite-node CI scripts) must not call
 * createClient — recent supabase-js requires a WebSocket implementation there.
 *
 * PKCE + query `?code=` so magic-link return works with HashRouter
 * (`#/…` routes). Implicit `#access_token=` would fight the router and often
 * falls back to Supabase Site URL (Usta on :5174).
 */
export const supabase: SupabaseClient | null =
  supabaseConfigured && typeof window !== "undefined"
    ? createClient(url!, anon!, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      })
    : null;

/** Canonical public Ledger URL (GitHub Pages). */
export const LEDGER_PAGES_URL = "https://faikemrepusat.github.io/cyber-security-training/";

/**
 * Where the magic-link email should return. Never append Vite `base: './'` —
 * that produced `github.io./` and Supabase fell back to Site URL (Usta :5174).
 */
export function ledgerAuthRedirectTo(): string {
  const host = window.location.hostname;
  if (host === "faikemrepusat.github.io" || host.endsWith(".github.io")) {
    return LEDGER_PAGES_URL;
  }
  if (host === "localhost" || host === "127.0.0.1") {
    return `${window.location.protocol}//${host}:${window.location.port || "5173"}/`;
  }
  const path = window.location.pathname.replace(/\/+$/, "");
  const basePath = path && path !== "/" ? `${path}/` : "/";
  return `${window.location.origin}${basePath}`;
}
