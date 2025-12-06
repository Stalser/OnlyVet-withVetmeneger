// app/api/auth/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[check-duplicate] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

/**
 * POST /api/auth/check-duplicate
 * Body: { email?: string; phoneNormalized?: string | null }
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      phoneNormalized?: string | null;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const phoneNormalized = (body.phoneNormalized || "").trim();

    console.log("[check-duplicate] incoming", {
      email,
      phoneNormalized,
    });

    let emailExists = false;
    let phoneExists = false;

    // 1. Проверяем email в auth.users
    if (email) {
      const { data, error } = await supabaseAdmin
        .from("auth.users") // системная таблица
        .select("id")
        .ilike("email", email)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows
        console.error("[check-duplicate] email check error:", error);
      }

      if (data) {
        emailExists = true;
      }
    }

    // 2. Проверяем телефон в public.profiles.phone_normalized
    if (phoneNormalized) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone_normalized", phoneNormalized)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("[check-duplicate] phone check error:", error);
      }

      if (data) {
        phoneExists = true;
      }
    }

    const exists = emailExists || phoneExists;

    console.log("[check-duplicate] result", {
      exists,
      emailExists,
      phoneExists,
    });

    return NextResponse.json(
      {
        exists,
        emailExists,
        phoneExists,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[check-duplicate] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error in check-duplicate" },
      { status: 500 }
    );
  }
}
