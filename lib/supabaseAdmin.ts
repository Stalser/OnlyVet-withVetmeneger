// lib/supabaseAdmin.ts
// Админ-клиент Supabase (service role). Использовать ТОЛЬКО на сервере.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[SupabaseAdmin] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы. Админ-клиент работать не будет."
  );
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase admin client is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        // на сервере сессии хранить не нужно
        persistSession: false,
      },
    });
  }

  return adminClient;
}
