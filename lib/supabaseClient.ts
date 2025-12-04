// lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Ленивая инициализация Supabase-клиента.
 * Вызывается только в браузере (из хендлеров/эффектов),
 * не на уровне модуля, поэтому не ломает билд.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Здесь уже можно кидать ошибку — это будет в рантайме браузера,
      // а не на этапе сборки.
      throw new Error(
        "Supabase env vars are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
