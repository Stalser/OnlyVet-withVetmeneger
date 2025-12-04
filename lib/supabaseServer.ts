// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ВАЖНО: SUPABASE_SERVICE_ROLE_KEY НИКОГДА не должен попадать в браузер,
// поэтому этот клиент используем только на сервере (route handlers, server actions).
if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
}

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey);
