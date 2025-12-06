// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { findOrCreateClient } from "@/lib/vetmanagerClient";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
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
    const supabaseUserId = body.supabaseUserId as string | undefined;

    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "supabaseUserId is required" },
        { status: 400 }
      );
    }

    // 1. Профиль из public.profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, email, full_name, last_name, first_name, middle_name, phone, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profile fetch error:", profileError);
      return NextResponse.json(
        { error: "Не удалось получить профиль пользователя" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Профиль пользователя не найден" },
        { status: 404 }
      );
    }

    // 2. Если уже привязан — выходим
    if (profile.vetm_client_id) {
      return NextResponse.json(
        { ok: true, vetm_client_id: profile.vetm_client_id },
        { status: 200 }
      );
    }

    const phone: string | undefined = profile.phone || undefined;
    const email: string | undefined = profile.email || undefined;

    if (!phone && !email) {
      return NextResponse.json(
        {
          error:
            "Недостаточно данных для привязки к Vetmanager (нет телефона и email). Обратитесь в регистратуру.",
        },
        { status: 400 }
      );
    }

    // 3. Найти или создать клиента в Vetmanager
    const client = await findOrCreateClient({
      phone,
      email,
      firstName: profile.first_name || undefined,
      middleName: profile.middle_name || undefined,
      lastName: profile.last_name || undefined,
    });

    // 4. Сохраняем vetm_client_id
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ vetm_client_id: client.id })
      .eq("id", profile.id);

    if (updateError) {
      console.error(
        "[Vetmanager init] update vetm_client_id error:",
        updateError
      );
      return NextResponse.json(
        { error: "Не удалось сохранить связь с Vetmanager" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, vetm_client_id: client.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка при инициализации Vetmanager" },
      { status: 500 }
    );
  }
}
