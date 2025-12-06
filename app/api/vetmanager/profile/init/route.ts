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
 *
 * Body: { supabaseUserId: string }
 *
 * Вызывается ТОЛЬКО на сервере, после того как пользователь:
 *  - подтвердил email,
 *  - вошёл в личный кабинет.
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error("[Vetmanager init] supabaseAdmin не сконфигурирован");
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const supabaseUserId = body.supabaseUserId as string | undefined;

    console.log("[Vetmanager init] incoming body", body);

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
        "id, email, full_name, last_name, first_name, middle_name, phone_normalized, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle();

    console.log("[Vetmanager init] loaded profile", {
      supabaseUserId,
      profile,
      profileError,
    });

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

    // 2. Если уже есть связь с Vetmanager — ничего не делаем
    if (profile.vetm_client_id) {
      console.log("[Vetmanager init] already linked to Vetmanager", {
        profileId: profile.id,
        vetm_client_id: profile.vetm_client_id,
      });
      return NextResponse.json(
        { ok: true, message: "Уже привязан к Vetmanager" },
        { status: 200 }
      );
    }

    // 3. Нужен хотя бы телефон или email
    const phoneDigits = (profile.phone_normalized as string | null)?.replace(
      /\D/g,
      ""
    );
    const hasPhone = !!phoneDigits && phoneDigits.length >= 7;
    const hasEmail = !!profile.email;

    console.log("[Vetmanager init] profile contact info", {
      phone_normalized: profile.phone_normalized,
      phoneDigits,
      hasPhone,
      email: profile.email,
      hasEmail,
    });

    if (!hasPhone && !hasEmail) {
      return NextResponse.json(
        {
          error:
            "Недостаточно данных для привязки к Vetmanager (нет телефона и email). Обратитесь в регистратуру.",
        },
        { status: 400 }
      );
    }

    // 4. Найти или создать клиента в Vetmanager
    console.log("[Vetmanager init] calling findOrCreateClientByPhone", {
      phoneDigits,
      firstName: profile.first_name,
      middleName: profile.middle_name,
      lastName: profile.last_name,
      email: profile.email,
    });

    const client = await findOrCreateClientByPhone({
      phone: phoneDigits || "",
      firstName: profile.first_name || undefined,
      middleName: profile.middle_name || undefined,
      lastName: profile.last_name || undefined,
      email: profile.email || undefined,
    });

    console.log("[Vetmanager init] Vetmanager client returned", client);

    // 5. Запишем vetm_client_id в профайл
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

    console.log("[Vetmanager init] vetm_client_id updated", {
      profileId: profile.id,
      vetm_client_id: client.id,
    });

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
