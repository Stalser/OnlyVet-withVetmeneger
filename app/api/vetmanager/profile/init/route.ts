// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

/**
 * Инициализация связки профиля пользователя с клиентом Vetmanager.
 *
 * Вход: JSON:
 *  {
 *    userId: string;         // uuid из auth.users / profiles.uuid
 *    phone: string;
 *    firstName?: string;
 *    middleName?: string;
 *    lastName?: string;
 *    email?: string;
 *  }
 *
 * Делает:
 *  1) upsert профиля в public.profiles
 *  2) findOrCreate клиента в Vetmanager по телефону
 *  3) пишет vetm_client_id в profiles
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null as any);

    const {
      userId,
      phone,
      firstName,
      middleName,
      lastName,
      email,
    }: {
      userId?: string;
      phone?: string;
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
    } = body || {};

    if (!userId || !phone) {
      return NextResponse.json(
        { error: "userId и phone обязательны" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // 1. Обновляем / создаём профиль в public.profiles
    const fullName = [lastName, firstName, middleName]
      .filter(Boolean)
      .join(" ");

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          uuid: userId,
          email: email ?? null,
          full_name: fullName || null,
          last_name: lastName ?? null,
          first_name: firstName ?? null,
          middle_name: middleName ?? null,
          phone: phone ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "uuid" }
      )
      .select()
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profiles upsert error:", profileError);
      return NextResponse.json(
        { error: "Не удалось обновить профиль", details: profileError.message },
        { status: 500 }
      );
    }

    // 2. Ищем или создаём клиента в Vetmanager
    const vetmClient = await findOrCreateClientByPhone({
      phone,
      firstName,
      middleName,
      lastName,
      email,
    });

    // 3. Записываем vetm_client_id в профиль
    const { error: linkError } = await admin
      .from("profiles")
      .update({
        vetm_client_id: vetmClient.id,
        updated_at: new Date().toISOString(),
      })
      .eq("uuid", userId);

    if (linkError) {
      console.error("[Vetmanager init] update vetm_client_id error:", linkError);
      return NextResponse.json(
        {
          error: "Не удалось сохранить связку с Vetmanager",
          details: linkError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        vetmClientId: vetmClient.id,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[Vetmanager init] Unexpected error:", e);
    return NextResponse.json(
      { error: "Internal error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
