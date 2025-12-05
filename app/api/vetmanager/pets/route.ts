// app/api/vetmanager/pets/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import {
  findOrCreateClientByPhone,
  getPetsByClientId,
} from "@/lib/vetmanagerClient";

/**
 * GET /api/vetmanager/pets
 *
 * 1. Берём текущего пользователя из Supabase auth.
 * 2. Загружаем его профиль из таблицы profiles.
 * 3. Если нет vetm_client_id — ищем/создаём клиента в Vetmanager по телефону и обновляем профиль.
 * 4. По vetm_client_id забираем список питомцев из Vetmanager.
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Текущий пользователь
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Профиль
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("[VetmPets] profile error:", profileError);
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const phone: string | null = profile.phone;
    let vetmClientId: number | null = profile.vetm_client_id ?? null;

    if (!phone) {
      return NextResponse.json(
        { error: "Для загрузки питомцев нужен телефон в профиле" },
        { status: 400 }
      );
    }

    // 3. Если нет связки с Vetmanager — создаём/ищем клиента
    if (!vetmClientId) {
      const client = await findOrCreateClientByPhone({
        phone,
        firstName: profile.first_name || undefined,
        lastName: profile.last_name || undefined,
        email: profile.email || undefined,
      });

      vetmClientId = client.id;

      // обновляем связку в Supabase
      await supabase
        .from("profiles")
        .update({ vetm_client_id: vetmClientId })
        .eq("id", user.id);
    }

    // 4. Загружаем питомцев из Vetmanager
    const pets = await getPetsByClientId(vetmClientId);

    return NextResponse.json(
      {
        success: true,
        vetm_client_id: vetmClientId,
        pets,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[VetmPets] ERROR", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
