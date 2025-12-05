// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  findOrCreateClientByPhone,
} from "@/lib/vetmanagerClient";

// ВАЖНО: нужны эти переменные в Vercel
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  // Логируем, но не падаем при импорте
  console.warn(
    "[Vetmanager init] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы."
  );
}

// Админ-клиент Supabase (только на сервере!)
const supabaseAdmin =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const supabaseUserId = body.supabaseUserId as string | undefined;

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
        "id, email, full_name, first_name, last_name, middle_name, phone, phone_normalized, vetm_client_id"
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
      // Пользователь ещё не успел попасть в profiles (хотя уже есть в auth)
      return NextResponse.json(
        { ok: true, linked: false, reason: "no_profile" },
        { status: 200 }
      );
    }

    // 2. Если уже привязан к Vetmanager — выходим
    if (profile.vetm_client_id) {
      return NextResponse.json(
        { ok: true, linked: true, vetm_client_id: profile.vetm_client_id },
        { status: 200 }
      );
    }

    // 3. Если нормализованного телефона нет — не пытаемся создавать клиента
    if (!profile.phone_normalized) {
      return NextResponse.json(
        { ok: true, linked: false, reason: "no_phone" },
        { status: 200 }
      );
    }

    // 4. Ищем / создаём клиента в Vetmanager по нормализованному телефону
    const vetmClient = await findOrCreateClientByPhone({
      phone: profile.phone_normalized as string,
      firstName: profile.first_name || undefined,
      lastName: profile.last_name || undefined,
      email: profile.email || undefined,
    });

    // 5. Обновляем профиль, пишем vetm_client_id
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ vetm_client_id: vetmClient.id })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[Vetmanager init] update vetm_client_id error:", updateError);
      // Клиента в Vetmanager уже создали / нашли, но в профиле не записали —
      // это не смертельно, но лучше зафиксировать в логах.
      return NextResponse.json(
        { ok: true, linked: true, vetm_client_id: vetmClient.id, warning: "profile_not_updated" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, linked: true, vetm_client_id: vetmClient.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error in Vetmanager init" },
      { status: 500 }
    );
  }
}
