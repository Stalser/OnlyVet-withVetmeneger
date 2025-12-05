// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  findOrCreateClientByPhone,
  type VetmClient,
} from "@/lib/vetmanagerClient";

/**
 * ВАЖНО:
 *  - этот роут вызывается только с сервера (fetch из /auth/register/page.tsx)
 *  - здесь используется service role key, поэтому НЕЛЬЗЯ импортировать это на клиент
 */

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

// Админ-клиент Supabase для работы с таблицами (profiles и т.п.)
const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

type InitPayload = {
  supabaseUserId: string;
  phone: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
};

/**
 * POST /api/vetmanager/profile/init
 *
 * Логика:
 *  1) найти или создать клиента в Vetmanager по телефону
 *  2) привязать его к supabase-профилю (profiles.vetm_client_id)
 */
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured" },
      { status: 500 }
    );
  }

  let body: InitPayload;
  try {
    body = (await req.json()) as InitPayload;
  } catch (e) {
    console.error("[Vetmanager init] invalid JSON", e);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { supabaseUserId, phone, firstName, middleName, lastName, email } =
    body;

  if (!supabaseUserId || !phone) {
    return NextResponse.json(
      { error: "supabaseUserId и phone обязательны" },
      { status: 400 }
    );
  }

  try {
    // 1. Найти или создать клиента в Vetmanager
    const vetmClient: VetmClient = await findOrCreateClientByPhone({
      phone,
      firstName,
      middleName,
      lastName,
      email,
    });

    // Подстрахуемся: если по какой-то причине нет id — считаем ошибкой
    if (!vetmClient || !vetmClient.id) {
      console.error(
        "[Vetmanager init] findOrCreateClientByPhone вернул пустой результат",
        vetmClient
      );
      return NextResponse.json(
        { error: "Не удалось получить клиента в Vetmanager" },
        { status: 500 }
      );
    }

    // 2. Обновляем / создаём профиль в Supabase
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          uuid: supabaseUserId,
          email: email || null,
          full_name:
            [lastName, firstName, middleName].filter(Boolean).join(" ") ||
            null,
          last_name: lastName || null,
          first_name: firstName || null,
          middle_name: middleName || null,
          phone: phone || null,
          role: "user",
          vetm_client_id: vetmClient.id,
        },
        { onConflict: "uuid" }
      );

    if (upsertError) {
      console.error("[Vetmanager init] upsert profiles error:", upsertError);
      return NextResponse.json(
        { error: "Не удалось обновить профиль в Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, vetmClientId: vetmClient.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error during Vetmanager init" },
      { status: 500 }
    );
  }
}
