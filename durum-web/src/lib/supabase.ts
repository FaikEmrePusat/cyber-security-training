import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

/**
 * Browser-only client. Module load in Node (vite-node CI scripts) must not call
 * createClient — recent supabase-js requires a WebSocket implementation there.
 */
export const supabase: SupabaseClient | null =
  supabaseConfigured && typeof window !== "undefined"
    ? createClient(url!, anon!, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "implicit",
        },
      })
    : null;
