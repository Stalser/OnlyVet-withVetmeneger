// app/api/auth/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[check-duplicate] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = (body.email as string | undefined)?.trim().toLowerCase();
    const phoneNormalized = (body.phoneNormalized as string | undefined)?.trim();

    let emailExists = false;
    let phoneExists = false;

    // 1. Проверяем email в profiles (можно добавить check и по auth.users, если нужно)
    if (email) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.warn("[check-duplicate] email check error:", error);
      } else if (data) {
        emailExists = true;
      }
    }

    // 2. Проверяем телефон в profiles
    if (phoneNormalized) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone_normalized", phoneNormalized)
        .maybeSingle();

      if (error) {
        console.warn("[check-duplicate] phone check error:", error);
      } else if (data) {
        phoneExists = true;
      }
    }

    const exists = emailExists || phoneExists;

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
