// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const {
      supabaseUserId,
      phone,
      firstName,
      lastName,
      email,
    }: {
      supabaseUserId?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    } = body;

    if (!supabaseUserId || !phone) {
      return NextResponse.json(
        { error: "supabaseUserId и phone обязательны" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const digitsPhone = phone.replace(/\D/g, "");

    // 1. Обновляем/создаём профиль в таблице profiles
    //    Предполагаем структуру: id (uuid) references auth.users(id)
    const fullName =
      [lastName, firstName].filter(Boolean).join(" ") || undefined;

    const { error: upsertError } = await admin.from("profiles").upsert(
      {
        id: supabaseUserId,
        email: email || null,
        full_name: fullName || null,
        last_name: lastName || null,
        first_name: firstName || null,
        phone: digitsPhone || null,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error("[Vetmanager init] profiles upsert error:", upsertError);
      // не ломаем запрос, но логируем
    }

    // 2. Ищем / создаём клиента в Vetmanager
    let client = null;
    try {
      client = await findOrCreateClientByPhone({
        phone: digitsPhone,
        firstName,
        lastName,
        email,
      });
    } catch (vmErr) {
      console.error("[Vetmanager init] Vetmanager error:", vmErr);
      // Клиента создать не удалось — возвращаем 200, но без связки
      return NextResponse.json(
        {
          ok: true,
          vetmClientLinked: false,
          message: "Профиль создан, но Vetmanager временно недоступен.",
        },
        { status: 200 }
      );
    }

    if (!client) {
      return NextResponse.json(
        {
          ok: true,
          vetmClientLinked: false,
          message: "Не удалось создать/найти клиента в Vetmanager.",
        },
        { status: 200 }
      );
    }

    // 3. Записываем vetm_client_id в профиле
    const { error: linkError } = await admin
      .from("profiles")
      .update({ vetm_client_id: client.id, phone: digitsPhone })
      .eq("id", supabaseUserId);

    if (linkError) {
      console.error("[Vetmanager init] link profile->vetm_client_id error:", linkError);
    }

    return NextResponse.json(
      {
        ok: true,
        vetmClientLinked: true,
        vetmClientId: client.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
