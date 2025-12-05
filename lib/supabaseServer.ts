// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Серверный клиент Supabase.
 * Может вернуть null, если нет нужных env-переменных.
 * Никаких throw на верхнем уровне — чтобы не ронять билд на Vercel.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
