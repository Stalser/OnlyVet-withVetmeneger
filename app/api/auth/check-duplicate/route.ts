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
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const phoneNormalized = body.phoneNormalized as string | null;

  let phoneExists = false;

  if (phoneNormalized) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("phone_normalized", phoneNormalized)
      .maybeSingle();

    if (error) {
      console.warn("[check-duplicate] phone check error:", error);
    }
    if (data) {
      phoneExists = true;
    }
  }

  return NextResponse.json({
    exists: phoneExists,
    emailExists: false, // email ловим по ошибке signUp
    phoneExists,
  });
}
