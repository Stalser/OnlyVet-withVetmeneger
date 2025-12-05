// app/api/vetmanager/pets/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getPetsByClientId,
  findOrCreateClientByPhone,
  type VetmPet,
} from "@/lib/vetmanagerClient";

// Админ-клиент Supabase (service role)
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

type ProfileRow = {
  id: string;
  email?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  vetm_client_id?: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { supabaseUserId } = body as { supabaseUserId?: string };

    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "supabaseUserId обязателен" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // 1. Получаем профиль пользователя
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, email, phone, first_name, last_name, vetm_client_id")
      .eq("id", supabaseUserId)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      console.error("[VetmPets] profile select error:", profileError);
      return NextResponse.json(
        { error: "Не удалось получить профиль" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Профиль не найден" },
        { status: 404 }
      );
    }

    let vetmClientId = profile.vetm_client_id ?? null;

    // 2. Если ещё нет связки с Vetmanager — создаём / находим клиента по телефону
    if (!vetmClientId) {
      const phone = (profile.phone || "").trim();

      if (!phone) {
        return NextResponse.json(
          {
            error:
              "Для работы с питомцами нужен номер телефона в профиле. Обратитесь в поддержку.",
          },
          { status: 400 }
        );
      }

      try {
        const client = await findOrCreateClientByPhone({
          phone,
          firstName: profile.first_name || undefined,
          lastName: profile.last_name || undefined,
          email: profile.email || undefined,
        });

        vetmClientId = client.id;

        // Сохраняем vetm_client_id в профиле
        const { error: updateError } = await admin
          .from("profiles")
          .update({ vetm_client_id: vetmClientId })
          .eq("id", profile.id);

        if (updateError) {
          console.error(
            "[VetmPets] update profile vetm_client_id error:",
            updateError
          );
        }
      } catch (err) {
        console.error("[VetmPets] Vetmanager client error:", err);
        return NextResponse.json(
          {
            error:
              "Не удалось связать профиль с системой клиники. Попробуйте позже или обратитесь в поддержку.",
          },
          { status: 502 }
        );
      }
    }

    if (!vetmClientId) {
      // защита от совсем странных случаев
      return NextResponse.json(
        {
          error:
            "Связка с клиентом в системе клиники отсутствует. Обратитесь в поддержку.",
        },
        { status: 500 }
      );
    }

    // 3. Получаем список питомцев из Vetmanager
    let pets: VetmPet[] = [];
    try {
      pets = await getPetsByClientId(vetmClientId);
    } catch (err) {
      console.error("[VetmPets] getPetsByClientId error:", err);
      return NextResponse.json(
        {
          error:
            "Не удалось загрузить список питомцев из системы клиники. Попробуйте позже.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetmClientId,
        pets,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[VetmPets] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
