// app/api/vetmanager/pets/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getPetsByClientId,
  findOrCreateClientByPhone,
  type VetmPet,
} from "@/lib/vetmanagerClient";

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
    const body = await req.json().catch(() => null);

    if (!body || !body.supabaseUserId) {
      return NextResponse.json(
        { error: "supabaseUserId is required" },
        { status: 400 }
      );
    }

    const supabaseUserId: string = body.supabaseUserId;
    const admin = getSupabaseAdmin();

    // 1. Получаем профиль
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(
        "id, email, phone, first_name, last_name, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      console.error("[Pets] profile select error:", profileError);
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
    let phoneDigits = (profile.phone || "").replace(/\D/g, "");

    // 2. Если ещё нет клиента в Vetmanager — создаём/ищем
    if (!vetmClientId) {
      if (!phoneDigits) {
        return NextResponse.json(
          {
            error:
              "Для связки с клиникой нужен номер телефона. Обратитесь в поддержку.",
          },
          { status: 400 }
        );
      }

      try {
        const client = await findOrCreateClientByPhone({
          phone: phoneDigits,
          firstName: profile.first_name || undefined,
          lastName: profile.last_name || undefined,
          email: profile.email || undefined,
        });

        vetmClientId = client.id;

        // записываем обратно в профиль
        const { error: updateError } = await admin
          .from("profiles")
          .update({
            vetm_client_id: vetmClientId,
            phone: phoneDigits,
          })
          .eq("id", profile.id);

        if (updateError) {
          console.error("[Pets] update profile vetm_client_id error:", updateError);
        }
      } catch (vmErr) {
        console.error("[Pets] Vetmanager error:", vmErr);
        return NextResponse.json(
          {
            error:
              "Не удалось получить данные из клиники. Попробуйте позже или обратитесь в поддержку.",
          },
          { status: 502 }
        );
      }
    }

    if (!vetmClientId) {
      // на всякий случай
      return NextResponse.json(
        {
          error:
            "Связка с клиникой не настроена. Обратитесь в поддержку.",
        },
        { status: 500 }
      );
    }

    // 3. Получаем питомцев
    let pets: VetmPet[] = [];
    try {
      pets = await getPetsByClientId(vetmClientId);
    } catch (vmErr) {
      console.error("[Pets] getPetsByClientId error:", vmErr);
      return NextResponse.json(
        {
          error:
            "Не удалось загрузить список питомцев из клиники. Попробуйте позже.",
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
  } catch (err: any) {
    console.error("[Pets] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
