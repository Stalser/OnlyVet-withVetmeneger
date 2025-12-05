// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

// Админ-клиент Supabase (через service role key)
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin env vars are not set. Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      supabaseUserId,
      phone,
      firstName,
      middleName,
      lastName,
      email,
    } = body as {
      supabaseUserId?: string;
      phone?: string;
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
    };

    if (!supabaseUserId || !phone) {
      return NextResponse.json(
        { error: "supabaseUserId и phone обязательны" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // 1. Находим или создаём клиента в Vetmanager
    let vetmClientId: number | null = null;

    try {
      const client = await findOrCreateClientByPhone({
        phone,
        firstName,
        middleName,
        lastName,
        email,
      });

      vetmClientId = client.id;
    } catch (err) {
      console.error("[Vetmanager init] findOrCreateClientByPhone error:", err);
      // Не роняем ручку — просто вернём 200 без vetm_client_id,
      // чтобы регистрация на фронте не ломалась.
    }

    // 2. Обновляем/создаём профиль в Supabase
    try {
      const fullNameParts = [lastName, firstName, middleName].filter(
        (v) => v && `${v}`.trim().length > 0
      );
      const fullName = fullNameParts.join(" ");

      const upsertPayload: any = {
        id: supabaseUserId,
        email: email || null,
        full_name: fullName || null,
        last_name: lastName || null,
        first_name: firstName || null,
        middle_name: middleName || null,
        phone: phone || null,
      };

      if (vetmClientId != null) {
        upsertPayload.vetm_client_id = vetmClientId;
      }

      const { error: upsertError } = await admin
        .from("profiles")
        .upsert(upsertPayload, { onConflict: "id" });

      if (upsertError) {
        console.error("[Vetmanager init] profiles upsert error:", upsertError);
      }
    } catch (err) {
      console.error("[Vetmanager init] profiles upsert exception:", err);
    }

    return NextResponse.json(
      {
        ok: true,
        vetm_client_id: vetmClientId ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Vetmanager init] unexpected error:", err);
    // Возвращаем 200, чтобы фронт не падал, но помечаем ok:false
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 200 }
    );
  }
}
