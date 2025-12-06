// app/api/auth/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    const phoneNormalized = (body.phoneNormalized as string | null) || null;

    let phoneExists = false;

    if (phoneNormalized) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone_normalized", phoneNormalized)
        .limit(1);

      if (!error && data && data.length > 0) {
        phoneExists = true;
      }
    }

    // exists = сейчас проверяем только телефон
    return NextResponse.json({
      exists: phoneExists,
      phoneExists,
    });
  } catch (err) {
    console.error("[check-duplicate] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error in check-duplicate" },
      { status: 500 }
    );
  }
}
