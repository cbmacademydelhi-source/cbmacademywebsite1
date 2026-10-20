import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client for CBM Academy Website
 * Connects directly using the official Supabase JavaScript client
 * and the client-safe publishable key.
 */
const SUPABASE_URL: string =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  "https://cxeztssvgaeytdljoned.supabase.co";

const SUPABASE_PUBLISHABLE_KEY: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  "sb_publishable_sO0rnN9MJzQmBiq-Lm6p3w_EAYKjVOb";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
