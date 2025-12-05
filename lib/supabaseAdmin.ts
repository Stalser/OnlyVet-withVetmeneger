// lib/supabaseAdmin.ts
// Серверный Supabase-клиент с service-role ключом.
// Используем ТОЛЬКО на сервере (API routes, server components).

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn(
    "[SupabaseAdmin] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    if (!supabaseUrl || !serviceKey) {
      throw new Error(
        "Supabase admin client is not configured (no SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)."
      );
    }

    adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
  }

  return adminClient;
}
