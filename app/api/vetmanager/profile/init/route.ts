// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

// --------- Supabase service client (ТОЛЬКО на сервере) ---------

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // Это не ломает билд, но даёт понятный лог в проде
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseServer = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

// --------- Типы тела запроса ---------

type InitBody = {
  supabaseUserId: string;
  phone: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  noMiddleName?: boolean;
  telegram?: string;
};

// --------- Обработчик POST ---------

export async function POST(req: NextRequest) {
  if (!supabaseServer) {
    return NextResponse.json(
      { error: "Supabase service client is not configured." },
      { status: 500 }
    );
  }

  let body: InitBody;

  try {
    body = (await req.json()) as InitBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const {
    supabaseUserId,
    phone,
    firstName = "",
    middleName = "",
    lastName = "",
    email = "",
    noMiddleName = false,
    telegram = "",
  } = body;

  if (!supabaseUserId || !phone) {
    return NextResponse.json(
      { error: "supabaseUserId и phone обязательны." },
      { status: 400 }
    );
  }

  try {
    // 1. Найти или создать клиента в Vetmanager по телефону
    const vetmClient = await findOrCreateClientByPhone({
      phone,
      firstName,
      lastName,
      middleName: noMiddleName ? "Нет отчества" : middleName,
      email,
    });

    // 2. Обновить/создать профиль в Supabase (public.profiles)
    const fullNameParts = [
      lastName.trim(),
      firstName.trim(),
      !noMiddleName && middleName.trim(),
    ].filter(Boolean);

    const fullName = fullNameParts.join(" ");

    const { error: upsertError } = await supabaseServer
      .from("profiles")
      .upsert(
        {
          uuid: supabaseUserId,
          email: email || null,
          full_name: fullName || null,
          last_name: lastName || null,
          first_name: firstName || null,
          middle_name: noMiddleName ? null : middleName || null,
          phone: phone || null,
          telegram: telegram || null,
          role: "user",
          vetm_client_id: vetmClient?.id ?? null,
        },
        { onConflict: "uuid" }
      );

    if (upsertError) {
      console.error("[Vetmanager init] Supabase upsert error:", upsertError);
      // Это не критично для пользователя, но важно для логов
    }

    return NextResponse.json(
      {
        ok: true,
        vetm_client_id: vetmClient?.id ?? null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Vetmanager init failed." },
      { status: 500 }
    );
  }
}
