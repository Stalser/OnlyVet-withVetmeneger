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
    const phoneNormalized = (body.phone_normalized as string | null) ?? null;

    if (!email && !phoneNormalized) {
      return NextResponse.json(
        { error: "email или phone_normalized обязательны" },
        { status: 400 }
      );
    }

    const duplicateFields: string[] = [];

    // 1) проверка email в auth.users
    if (email) {
      const { data, error } = await supabaseAdmin
        .from("auth.users")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (error) {
        console.warn("[check-duplicate] email check error:", error);
      } else if (data && data.length > 0) {
        duplicateFields.push("email");
      }
    }

    // 2) проверка телефона в public.profiles.phone_normalized
    if (phoneNormalized) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone_normalized", phoneNormalized)
        .maybeSingle();

      if (error) {
        console.warn("[check-duplicate] phone check error:", error);
      } else if (data) {
        duplicateFields.push("phone");
      }
    }

    return NextResponse.json(
      {
        duplicate: duplicateFields.length > 0,
        fields: duplicateFields,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[check-duplicate] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
