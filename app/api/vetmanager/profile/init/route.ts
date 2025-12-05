import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
  searchClientByPhone,
} from "@/lib/vetmanagerClient";

export const dynamic = "force-dynamic";

// Клиент Supabase (server-side), чтобы обновлять таблицу profiles
function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVICE KEY, НЕ anon
  );
}

export async function POST(req: Request) {
  try {
    const { supabaseUserId } = await req.json();
    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "Missing supabaseUserId" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Получаем профиль
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileErr || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Уже связан? — выходим
    if (profile.vetm_client_id) {
      return NextResponse.json({ ok: true, msg: "Already linked" });
    }

    // Телефон обязателен
    if (!profile.phone_normalized) {
      return NextResponse.json(
        { error: "User has no normalized phone" },
        { status: 400 }
      );
    }

    // Ищем клиента в Vetmanager по телефону
    const existing = await searchClientByPhone(profile.phone_normalized);

    let vmClient;
    if (existing) {
      vmClient = existing;
    } else {
      // Создаём нового в Vetmanager
      vmClient = await findOrCreateClientByPhone({
        phone: profile.phone_normalized,
        firstName: profile.first_name,
        lastName: profile.last_name,
        middleName: profile.middle_name || "",
        email: profile.email,
      });
    }

    // Обновляем Supabase профайл
    await supabase
      .from("profiles")
      .update({ vetm_client_id: vmClient.id })
      .eq("id", supabaseUserId);

    return NextResponse.json({ ok: true, clientId: vmClient.id });
  } catch (e) {
    console.error("Vetmanager init error:", e);
    return NextResponse.json(
      { error: "Vetmanager init failed", details: String(e) },
      { status: 500 }
    );
  }
}
