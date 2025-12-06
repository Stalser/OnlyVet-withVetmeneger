// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

/**
 * POST /api/vetmanager/profile/init
 * Body: { supabaseUserId: string }
 */
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

    // 1. Берём профиль
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
        { ok: true, vetm_client_id: profile.vetm_client_id, alreadyLinked: true },
        { status: 200 }
      );
    }

    if (!profile.phone) {
      return NextResponse.json(
        {
          error:
            "В профиле не указан телефон. Добавьте телефон в профиле, чтобы связаться с картой клиники.",
        },
        { status: 400 }
      );
    }

    // Имя/фамилия
    const lastName: string =
      profile.last_name ||
      (profile.full_name ? String(profile.full_name).split(" ")[0] : "") ||
      "Клиент";
    const firstName: string =
      profile.first_name ||
      (profile.full_name ? String(profile.full_name).split(" ")[1] : "") ||
      "";
    const middleName: string | undefined =
      profile.middle_name ||
      (profile.full_name ? String(profile.full_name).split(" ")[2] : undefined);

    // 3. Найти или создать клиента в Vetmanager
    const client = await findOrCreateClientByPhone({
      phone: profile.phone as string,
      lastName,
      firstName,
      middleName,
      email: profile.email || undefined,
    });

    // 4. Обновить vetm_client_id
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ vetm_client_id: client.id })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[Vetmanager init] update vetm_client_id error:", updateError);
      return NextResponse.json(
        { error: "Не удалось сохранить связь с Vetmanager" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, vetm_client_id: client.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка при инициализации Vetmanager" },
      { status: 500 }
    );
  }
}
