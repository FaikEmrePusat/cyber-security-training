import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

/**
 * Browser-only client. Module load in Node (vite-node CI scripts) must not call
 * createClient — recent supabase-js requires a WebSocket implementation there.
 *
 * PKCE + query `?code=` so magic-link return works with HashRouter.
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

/** Canonical public Ledger (no trailing slash). */
export const LEDGER_PAGES_URL = "https://faikemrepusat.github.io/cyber-security-training";

/**
 * Always the public Ledger URL in magic-link emails.
 * If this URL is missing from Supabase Redirect URLs, Auth falls back to Site URL
 * (often http://localhost:5174 for Usta) — that is a dashboard setting, not the app.
 */
export function ledgerAuthRedirectTo(): string {
  return LEDGER_PAGES_URL;
}
