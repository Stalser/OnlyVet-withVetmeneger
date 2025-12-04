// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Используем значения из env, если они есть, иначе — пустую строку.
// NEXT_PUBLIC_ переменные подставляются на этапе сборки для браузера.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Можно оставить легкий dev-лог, чтобы видеть проблему локально, но не падать билдингом.
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn(
//     "Supabase env vars are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
//   );
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
