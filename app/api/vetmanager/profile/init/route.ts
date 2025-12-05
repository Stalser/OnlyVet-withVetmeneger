// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
  type VetmClient,
} from "@/lib/vetmanagerClient";

/**
 * Админ-клиент Supabase (service role).
 * Используем только на сервере для записи в свои таблицы (profiles, pets и т.п.).
 */

function getSupabaseAdmin(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * POST /api/vetmanager/profile/init
 *
 * Тело запроса:
 * {
 *   supabaseUserId: string;  // id из auth.users
 *   phone: string;
 *   firstName?: string;
 *   middleName?: string;
 *   lastName?: string;
 *   email?: string;
 * }
 *
 * Задача:
 *  1) найти или создать клиента в Vetmanager по телефону;
 *  2) записать vetm_client_id в таблицу profiles (поле vetm_client_id);
 *  3) если записи в profiles нет — создать.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as
      | {
          supabaseUserId?: string;
          phone?: string;
          firstName?: string;
          middleName?: string;
          lastName?: string;
          email?: string;
        }
      | null;

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
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

    const supabase = getSupabaseAdmin();

    // 1. Найти или создать клиента в Vetmanager по телефону
    let client: VetmClient;
    try {
      client = await findOrCreateClientByPhone({
        phone,
        firstName,
        middleName,
        lastName,
        email,
      });
    } catch (err) {
      console.error("[Vetmanager init] findOrCreateClientByPhone error:", err);
      return NextResponse.json(
        {
          error:
            "Не удалось создать или найти клиента в системе клиники. Попробуйте позже или свяжитесь с поддержкой.",
        },
        { status: 502 }
      );
    }

    if (!client || !client.id) {
      return NextResponse.json(
        {
          error:
            "Система клиники вернула некорректный ответ (нет id клиента). Обратитесь в поддержку.",
        },
        { status: 502 }
      );
    }

    const vetmClientId = client.id;

    // 2. Обновить / создать запись профиля пользователя в Supabase
    // Таблица profiles:
    //  - id (uuid) — PK, ссылка на auth.users.id
    //  - email, full_name, last_name, first_name, middle_name, phone, telegram, role, vetm_client_id, ...
    const fullNameParts = [lastName, firstName, middleName].filter(Boolean);
    const fullName = fullNameParts.join(" ");

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: supabaseUserId,
          email: email ?? null,
          full_name: fullName || null,
          last_name: lastName ?? null,
          first_name: firstName ?? null,
          middle_name: middleName ?? null,
          phone: phone ?? null,
          vetm_client_id: vetmClientId,
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      console.error("[Vetmanager init] upsert profiles error:", upsertError);
      return NextResponse.json(
        {
          error:
            "Не получилось связать аккаунт с системой клиники. Попробуйте позже или свяжитесь с поддержкой.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetmClientId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      {
        error:
          "Техническая ошибка при инициализации связи с системой клиники.",
      },
      { status: 500 }
    );
  }
}
