// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
  normalizePhoneForVetm,
} from "@/lib/vetmanagerClient";

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

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { ok: false, error: "Supabase admin не сконфигурирован" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const supabaseUserId = body.supabaseUserId as string | undefined;

    if (!supabaseUserId) {
      return NextResponse.json(
        { ok: false, error: "supabaseUserId обязателен" },
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

    console.log("[VmInit] profile", { supabaseUserId, profile, profileError });

    if (profileError) {
      console.error("[VmInit] profile fetch error:", profileError);
      return NextResponse.json(
        { ok: false, error: "Не удалось получить профиль" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Профиль не найден" },
        { status: 404 }
      );
    }

    // 2. Если уже привязан — выходим
    if (profile.vetm_client_id) {
      console.log("[VmInit] уже привязан к Vetmanager:", profile.vetm_client_id);
      return NextResponse.json(
        { ok: true, vetm_client_id: profile.vetm_client_id },
        { status: 200 }
      );
    }

    // 3. Готовим телефон
    const phoneRaw: string = profile.phone || "";
    const phoneDigits = normalizePhoneForVetm(phoneRaw);

    if (!phoneDigits) {
      console.log("[VmInit] нет телефона, пропускаем создание клиента", {
        supabaseUserId,
      });
      return NextResponse.json(
        {
          ok: false,
          error:
            "В профиле нет телефона. Клиента в Vetmanager можно завести через регистратуру.",
        },
        { status: 400 }
      );
    }

    // 4. Создаём / находим клиента в Vetmanager
    const vetmClient = await findOrCreateClientByPhone({
      phone: phoneDigits,
      lastName: profile.last_name || profile.full_name || "OnlyVet",
      firstName: profile.first_name || "",
      middleName: profile.middle_name || "",
      email: profile.email || undefined,
    });

    console.log("[VmInit] Vetmanager client:", vetmClient);

    // 5. Сохраняем vetm_client_id в профиле
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ vetm_client_id: vetmClient.id })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[VmInit] update vetm_client_id error:", updateError);
      return NextResponse.json(
        { ok: false, error: "Не удалось сохранить vetm_client_id" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, vetm_client_id: vetmClient.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[VmInit] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Внутренняя ошибка Vetmanager init" },
      { status: 500 }
    );
  }
}
