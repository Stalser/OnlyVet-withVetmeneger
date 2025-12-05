// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
  normalizePhone,
} from "@/lib/vetmanagerClient";

// ВАЖНО: используем сервисный ключ только на сервере
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы."
  );
}

function getServerSupabase() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service credentials are not configured");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * POST /api/vetmanager/profile/init
 *
 * Тело:
 * {
 *   supabaseUserId: string;
 *   phone: string;
 *   firstName?: string;
 *   middleName?: string;
 *   lastName?: string;
 *   email?: string;
 * }
 *
 * Делает:
 * 1) Находит профиль по supabaseUserId в public.profiles
 * 2) Если уже есть vetm_client_id — ничего не делает.
 * 3) Иначе: findOrCreateClientByPhone → пишет vetm_client_id в profiles.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.supabaseUserId || !body.phone) {
      return NextResponse.json(
        { ok: false, error: "supabaseUserId и phone обязательны" },
        { status: 400 }
      );
    }

    const {
      supabaseUserId,
      phone,
      firstName,
      middleName,
      lastName,
      email,
    } = body as {
      supabaseUserId: string;
      phone: string;
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
    };

    console.log("[Vetmanager init] incoming", {
      supabaseUserId,
      phone,
      firstName,
      middleName,
      lastName,
      email,
    });

    const supabase = getServerSupabase();

    // 1. Находим профиль по uuid
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("uuid", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profiles query error:", profileError);
      return NextResponse.json(
        { ok: false, error: "profiles query error" },
        { status: 500 }
      );
    }

    if (!profile) {
      console.warn(
        "[Vetmanager init] profile not found for userId:",
        supabaseUserId
      );
      return NextResponse.json(
        { ok: false, error: "profile not found" },
        { status: 404 }
      );
    }

    console.log("[Vetmanager init] found profile:", {
      uuid: profile.uuid,
      vetm_client_id: profile.vetm_client_id,
      phone_in_profile: profile.phone,
    });

    // 2. Если уже есть связка с Vetmanager — выходим
    if (profile.vetm_client_id) {
      console.log(
        "[Vetmanager init] profile already linked to Vetmanager client:",
        profile.vetm_client_id
      );
      return NextResponse.json({ ok: true, alreadyLinked: true });
    }

    // 3. Ищем / создаём клиента в Vetmanager
    const phoneToUse = phone || profile.phone || "";
    if (!phoneToUse.trim()) {
      console.warn(
        "[Vetmanager init] phone is empty, cannot create Vetmanager client."
      );
      return NextResponse.json(
        { ok: false, error: "phone is empty for Vetmanager client" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phoneToUse);
    console.log("[Vetmanager init] normalizedPhone:", normalizedPhone);

    const client = await findOrCreateClientByPhone({
      phone: normalizedPhone,
      firstName: firstName || profile.first_name || undefined,
      middleName: middleName || profile.middle_name || undefined,
      lastName: lastName || profile.last_name || undefined,
      email: email || profile.email || undefined,
    });

    console.log("[Vetmanager init] Vetmanager client:", client);

    if (!client || !client.id) {
      console.error(
        "[Vetmanager init] Vetmanager client not created / not found."
      );
      return NextResponse.json(
        { ok: false, error: "Vetmanager client not created" },
        { status: 500 }
      );
    }

    // 4. Обновляем профиль — сохраняем vetm_client_id
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        vetm_client_id: client.id,
        phone: phoneToUse, // заодно записываем телефон в профайл, если его там не было
      })
      .eq("uuid", supabaseUserId);

    if (updateError) {
      console.error("[Vetmanager init] profiles update error:", updateError);
      return NextResponse.json(
        { ok: false, error: "profiles update error" },
        { status: 500 }
      );
    }

    console.log(
      "[Vetmanager init] profile linked to Vetmanager client id:",
      client.id
    );

    return NextResponse.json({ ok: true, vetm_client_id: client.id });
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "unexpected error" },
      { status: 500 }
    );
  }
}
