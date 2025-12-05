// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  searchClientByPhone,
  createClient as createVetmClient,
  type VetmClient,
} from "@/lib/vetmanagerClient";

// Эти переменные ДОЛЖНЫ быть заданы в Vercel:
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы"
    );
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdmin;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const {
      supabaseUserId,
      phone: phoneFromBody,
      firstName: firstNameFromBody,
      middleName: middleNameFromBody,
      lastName: lastNameFromBody,
      email: emailFromBody,
    } = body as {
      supabaseUserId?: string;
      phone?: string;
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
    };

    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "supabaseUserId is required" },
        { status: 400 }
      );
    }

    // 1. Берём профиль пользователя из таблицы profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profile select error:", profileError);
      return NextResponse.json(
        { error: "Ошибка чтения профиля" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Профиль не найден" },
        { status: 404 }
      );
    }

    // Если уже привязан к Vetmanager – ничего не делаем
    if (profile.vetm_client_id) {
      return NextResponse.json(
        { ok: true, clientId: profile.vetm_client_id },
        { status: 200 }
      );
    }

    // 2. Собираем исходные данные: что есть в профиле, что пришло из тела
    const phoneRaw: string | null =
      typeof phoneFromBody === "string" && phoneFromBody.trim()
        ? phoneFromBody
        : profile.phone ?? profile.phone_raw ?? null;

    const email: string | null =
      typeof emailFromBody === "string" && emailFromBody.trim()
        ? emailFromBody
        : profile.email ?? null;

    const firstName: string =
      firstNameFromBody ??
      profile.first_name ??
      profile.full_name?.split(" ")[1] ??
      "";
    const lastName: string =
      lastNameFromBody ??
      profile.last_name ??
      profile.full_name?.split(" ")[0] ??
      "";
    const middleName: string =
      middleNameFromBody ??
      profile.middle_name ??
      (profile.full_name?.split(" ")[2] ?? "");

    if (!phoneRaw) {
      return NextResponse.json(
        { error: "Нет телефона для связи с Vetmanager" },
        { status: 400 }
      );
    }

    let vetmClient: VetmClient | null = null;

    // 3. Пытаемся найти клиента по телефону
    try {
      vetmClient = await searchClientByPhone(phoneRaw);
    } catch (err) {
      console.warn("[Vetmanager init] searchClientByPhone error:", err);
    }

    // 4. Если не нашли – создаём нового клиента
    if (!vetmClient) {
      try {
        vetmClient = await createVetmClient({
          phone: phoneRaw,
          email: email ?? undefined,
          firstName: firstName || undefined,
          middleName: middleName || undefined,
          lastName: lastName || undefined,
        });
      } catch (err) {
        console.error("[Vetmanager init] createVetmClient error:", err);
        return NextResponse.json(
          { error: "Не удалось создать клиента в Vetmanager" },
          { status: 500 }
        );
      }
    }

    // 5. Сохраняем привязку в Supabase (profiles.vetm_client_id)
    if (vetmClient && vetmClient.id) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ vetm_client_id: vetmClient.id })
        .eq("id", supabaseUserId);

      if (updateError) {
        console.error("[Vetmanager init] profiles update error:", updateError);
        return NextResponse.json(
          { error: "Не удалось сохранить привязку к Vetmanager" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { ok: true, clientId: vetmClient?.id ?? null },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка Vetmanager init" },
      { status: 500 }
    );
  }
}
