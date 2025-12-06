// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

/**
 * POST /api/vetmanager/profile/init
 *
 * Body: { supabaseUserId: string }
 *
 * Делает РОВНО ОДНО:
 *  - берёт профиль пользователя из public.profiles
 *  - по телефону ищет/создаёт клиента в Vetmanager
 *  - пишет vetm_client_id в public.profiles
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

    // 1. Берём профиль из public.profiles
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
      console.error("[VmInit] profile not found for", supabaseUserId);
      return NextResponse.json(
        { error: "Профиль пользователя не найден" },
        { status: 404 }
      );
    }

    console.log("[VmInit] profile", {
      supabaseUserId,
      profile,
    });

    // 2. Если уже привязан — просто выходим
    if (profile.vetm_client_id) {
      console.log(
        "[VmInit] уже привязан к Vetmanager:",
        profile.vetm_client_id
      );
      return NextResponse.json(
        { ok: true, vetm_client_id: profile.vetm_client_id },
        { status: 200 }
      );
    }

    // 3. Берём телефон
    const rawPhone: string | null =
      (profile.phone as string | null) ||
      (profile.phone_normalized as string | null);

    if (!rawPhone) {
      console.warn("[VmInit] нет телефона в профиле, Vetmanager пропускаем");
      return NextResponse.json(
        {
          error:
            "В профиле нет телефона. Для привязки к клинике нужно указать номер телефона в личном кабинете.",
        },
        { status: 400 }
      );
    }

    // 4. Ищем/создаём клиента в Vetmanager
    console.log("[VmInit] call Vetmanager with", {
      phone: rawPhone,
      lastName: profile.last_name || "",
      firstName: profile.first_name || "",
      middleName: profile.middle_name || "",
      email: profile.email || "",
    });

    const client = await findOrCreateClientByPhone({
      phone: rawPhone,
      lastName: profile.last_name || "",
      firstName: profile.first_name || "",
      middleName: profile.middle_name || "",
      email: profile.email || "",
    });

    console.log("[VmInit] Vetmanager client:", client);

    // 5. Пишем vetm_client_id в public.profiles
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
      { ok: true, vetm_client_id: client.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[VmInit] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка при инициализации Vetmanager" },
      { status: 500 }
    );
  }
}
