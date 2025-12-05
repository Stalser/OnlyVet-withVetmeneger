// app/api/auth/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "[check-duplicate] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы"
  );
}

// admin-клиент, обходит RLS
const supabaseAdmin =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email: string | undefined = body.email?.trim();
    const phoneNormalized: string | undefined =
      body.phone_normalized?.toString().trim();

    if (!email && !phoneNormalized) {
      return NextResponse.json(
        { error: "email или phone_normalized должны быть переданы" },
        { status: 400 }
      );
    }

    // Собираем OR-фильтр
    const orParts: string[] = [];
    if (email) orParts.push(`email.eq.${email}`);
    if (phoneNormalized) orParts.push(`phone_normalized.eq.${phoneNormalized}`);

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, phone_normalized")
      .or(orParts.join(","))
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[check-duplicate] DB error:", error);
      return NextResponse.json(
        { error: "db_error" },
        { status: 500 }
      );
    }

    if (!data) {
      // Ничего не найдено → дубликата нет
      return NextResponse.json({ duplicate: false });
    }

    const fields: string[] = [];
    if (email && data.email === email) fields.push("email");
    if (phoneNormalized && data.phone_normalized === phoneNormalized)
      fields.push("phone");

    return NextResponse.json({ duplicate: true, fields });
  } catch (err) {
    console.error("[check-duplicate] Internal error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
