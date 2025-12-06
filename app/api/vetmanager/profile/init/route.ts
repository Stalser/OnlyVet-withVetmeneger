// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[VmInit] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

/**
 * POST /api/vetmanager/profile/init
 *
 * Body: { supabaseUserId: string }
 *
 * Вызывается при входе в ЛК.
 * Делает:
 *  - читает профиль из public.profiles
 *  - по телефону создаёт/находит клиента в Vetmanager
 *  - записывает vetm_client_id в public.profiles
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

    // 1. Берём профиль пользователя
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, email, full_name, last_name, first_name, middle_name, phone, phone_normalized, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[VmInit] profile fetch error:", profileError);
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

    const phoneRaw: string | null =
      profile.phone || profile.phone_normalized || null;

    // Без телефона в Vetmanager смысла нет
    if (!phoneRaw) {
      return NextResponse.json(
        {
          error:
            "В профиле не указан телефон. Укажите телефон в профиле, чтобы связать аккаунт с картой в клинике.",
        },
        { status: 400 }
      );
    }

    const lastName: string =
      profile.last_name ||
      (profile.full_name ? String(profile.full_name).split(" ")[0] : "") ||
      "Клиент OnlyVet";

    const firstName: string | undefined =
      profile.first_name ||
      (profile.full_name
        ? String(profile.full_name).split(" ")[1] || undefined
        : undefined);

    const middleName: string | undefined = profile.middle_name || undefined;
    const email: string | undefined = profile.email || undefined;

    // 2. Создаём / находим клиента в Vetmanager по телефону
    const client = await findOrCreateClientByPhone({
      phone: phoneRaw,
      lastName,
      firstName,
      middleName,
      email,
    });

    // 3. Записываем vetm_client_id в public.profiles
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ vetm_client_id: client.id })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[VmInit] update vetm_client_id error:", updateError);
      return NextResponse.json(
        { error: "Не удалось сохранить связь с Vetmanager" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetm_client_id: client.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[VmInit] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка при инициализации Vetmanager" },
      { status: 500 }
    );
  }
}
