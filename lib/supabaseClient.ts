// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Серверный Supabase-клиент.
 * Может быть null, если env-переменные не заданы (например, на этапе настройки).
 * В таком случае код, который пишет в Supabase, просто пропускается.
 */
export const supabaseServer: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;
