// lib/supabaseClient.ts
"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Минимальная защита от забытых env
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env vars are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Пока без типизации Database, можно добавить позже
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
