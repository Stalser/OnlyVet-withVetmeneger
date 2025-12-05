// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
} from "@/lib/vetmanagerClient";

/**
 * Этот endpoint:
 * 1) По supabaseUserId находит профиль в таблице profiles
 * 2) Берёт телефон из тела запроса (и из профиля как fallback)
 * 3) В Vetmanager ищет клиента по телефону, если нет — создаёт
 * 4) Записывает vetm_client_id в profiles
 *
 * Вызывается из:
 *   - /app/auth/register/page.tsx после успешного signUp
 */

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "[Vetmanager init] Supabase service env vars are not set (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
  );
}

function getServiceSupabase() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service role is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      supabaseUserId,
      phone: rawPhoneFromBody,
      firstName,
      middleName,
      lastName,
      email,
    } = body || {};

    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "supabaseUserId is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // 1. Находим профиль по user id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, phone, vetm_client_id")
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] load profile error:", profileError);
      return NextResponse.json(
        { error: "Не удалось загрузить профиль пользователя." },
        { status: 500 }
      );
    }

    if (!profile) {
      console.warn(
        "[Vetmanager init] profile not found for user",
        supabaseUserId
      );
      return NextResponse.json(
        { error: "Профиль пользователя не найден." },
        { status: 404 }
      );
    }

    // 2. Если уже есть vetm_client_id — ничего не делаем (идемпотентность)
    if (profile.vetm_client_id) {
      return NextResponse.json(
        {
          ok: true,
          vetm_client_id: profile.vetm_client_id,
          skipped: true,
          reason: "already_linked",
        },
        { status: 200 }
      );
    }

    // 3. Определяем телефон: приоритет — из тела запроса, затем из профиля
    const phoneFromProfile: string | null = profile.phone ?? null;
    const phone = (rawPhoneFromBody || phoneFromProfile || "").toString().trim();

    if (!phone) {
      return NextResponse.json(
        { error: "phone is required for Vetmanager linking" },
        { status: 400 }
      );
    }

    // 4. В Vetmanager ищем или создаём клиента по телефону
    const vetmClient = await findOrCreateClientByPhone({
      phone,
      firstName,
      middleName,
      lastName,
      email,
    });

    // 5. Записываем vetm_client_id в profiles
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ vetm_client_id: vetmClient.id })
      .eq("id", supabaseUserId);

    if (updateError) {
      console.error(
        "[Vetmanager init] update profile.vetm_client_id error:",
        updateError
      );
      return NextResponse.json(
        { error: "Не удалось сохранить связку с Vetmanager." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetm_client_id: vetmClient.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error in Vetmanager init." },
      { status: 500 }
    );
  }
}
