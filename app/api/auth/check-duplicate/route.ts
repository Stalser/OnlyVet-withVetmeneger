// app/api/auth/check-duplicate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Для этой ручки нужны серверные переменные окружения:
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn(
    "[check-duplicate] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы."
  );
}

const supabaseAdmin =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

type CheckDuplicateBody = {
  email?: string | null;
  phoneNormalized?: string | null; // только цифры, как 79829138405 или 9829138405
};

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as CheckDuplicateBody;

    const email = body.email?.trim().toLowerCase() || "";
    const phoneNormalized = (body.phoneNormalized || "").trim();

    if (!email && !phoneNormalized) {
      return NextResponse.json(
        { error: "email или phoneNormalized должны быть указаны" },
        { status: 400 }
      );
    }

    let emailExists = false;
    let phoneExists = false;

    // 1) Проверка email (по profiles)
    if (email) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("email", email) // email в profiles хранится в нижнем регистре, но на всякий случай ilike
        .maybeSingle();

      if (error) {
        console.error("[check-duplicate] email check error:", error);
      } else if (data) {
        emailExists = true;
      }
    }

    // 2) Проверка телефона (по нормализованному полю)
    if (phoneNormalized) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone_normalized", phoneNormalized)
        .maybeSingle();

      if (error) {
        console.error("[check-duplicate] phone check error:", error);
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
  } catch (err: any) {
    console.error("[check-duplicate] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error in check-duplicate" },
      { status: 500 }
    );
  }
}
