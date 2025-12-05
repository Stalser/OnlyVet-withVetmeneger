// lib/supabaseClient.ts
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | null = null;

/**
 * Клиент Supabase для браузера (auth, запросы с фронта).
 *
 * Использует публичный anon-ключ, поэтому безопасен для использования
 * на клиентах. Реальный доступ к БД ограничен RLS-политиками.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    if (!supabaseUrl || !anonKey) {
      throw new Error(
        "Supabase env vars are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    browserClient = createClient(supabaseUrl, anonKey);
  }

  return browserClient;
}

// Для обратной совместимости со старым кодом:
// можно импортировать либо { supabase }, либо { getSupabaseClient }
export const supabase: SupabaseClient = getSupabaseClient();
