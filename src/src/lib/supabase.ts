import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cxeztsvgaeytdljoned.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_sO0rnN9MJzQmBiq-Lm6p3w_EAYKjVOb";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
