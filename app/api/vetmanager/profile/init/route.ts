// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
  VetmClient,
} from "@/lib/vetmanagerClient";

// ВАЖНО: используем сервисный ключ, ТОЛЬКО на сервере
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы в env."
  );
}

const supabaseAdmin = SUPABASE_URL && SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null) as {
      supabaseUserId?: string;
    } | null;

    const supabaseUserId = body?.supabaseUserId;

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
        "id, email, first_name, last_name, phone, phone_normalized, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profile select error:", profileError);
      return NextResponse.json(
        { error: "Failed to load profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // 2. Если уже есть vetm_client_id — НИЧЕГО не создаём
    if (profile.vetm_client_id) {
      return NextResponse.json(
        {
          ok: true,
          vetm_client_id: profile.vetm_client_id,
          source: "already_linked",
        },
        { status: 200 }
      );
    }

    // 3. Без телефона и email мы не можем нормально создать клиента
    const phoneNormalized: string | null = profile.phone_normalized || null;
    const email: string | null = profile.email || null;

    if (!phoneNormalized && !email) {
      return NextResponse.json(
        {
          error:
            "Невозможно создать клиента в клинике: нет телефона и email.",
        },
        { status: 400 }
      );
    }

    const firstName: string | undefined = profile.first_name || undefined;
    const lastName: string | undefined = profile.last_name || undefined;

    // 4. Ищем/создаём клиента в Vetmanager по телефону
    let vetmClient: VetmClient;

    try {
      vetmClient = await findOrCreateClientByPhone({
        phone: phoneNormalized || "", // функция сама нормализует
        firstName,
        lastName,
        email: email || undefined,
      });
    } catch (vmErr) {
      console.error("[Vetmanager init] Vetmanager error:", vmErr);
      return NextResponse.json(
        { error: "Vetmanager error" },
        { status: 502 }
      );
    }

    // 5. Сохраняем vetm_client_id в профиле (чтобы больше НИКОГДА не создавать дубликаты)
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        vetm_client_id: vetmClient.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supabaseUserId);

    if (updateError) {
      console.error("[Vetmanager init] profile update error:", updateError);
      // Клиент в Vetmanager уже создан/найден, но связь не записалась.
      // На всякий случай возвращаем id, но в следующий раз init попробует ещё раз.
      return NextResponse.json(
        {
          error: "Failed to update profile with vetm_client_id",
          vetm_client_id: vetmClient.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetm_client_id: vetmClient.id,
        source: "created_or_found",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
