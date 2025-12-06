// app/api/auth/check-duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("[check-duplicate] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы.");
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
    const rawEmail = (body.email as string | undefined) || "";
    const rawPhone = (body.phoneNormalized as string | undefined) || "";

    const email = rawEmail.trim().toLowerCase();
    const phoneNormalized = rawPhone.replace(/\D/g, "");

    let emailExists = false;
    let phoneExists = false;

    // 1. Проверка email в profiles
    if (email) {
      const { count, error } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .ilike("email", email);

      if (error) {
        console.warn("[check-duplicate] email check error:", error);
      } else if ((count ?? 0) > 0) {
        emailExists = true;
      }
    }

    // 2. Проверка телефона в profiles.phone_normalized
    if (phoneNormalized) {
      const { count, error } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("phone_normalized", phoneNormalized);

      if (error) {
        console.warn("[check-duplicate] phone check error:", error);
      } else if ((count ?? 0) > 0) {
        phoneExists = true;
      }
    }

    const duplicate = emailExists || phoneExists;

    return NextResponse.json({
      duplicate,
      emailExists,
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
