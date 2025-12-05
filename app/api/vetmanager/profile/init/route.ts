// app/api/vetmanager/profile/init/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  searchClientByPhone,
  createClient as vetmCreateClient,
} from "@/lib/vetmanagerClient";

/**
 * Нормализация телефона для поиска / хранения
 * ДОЛЖНА совпадать с тем, что мы используем на регистрации.
 */
function normalizePhoneForSearch(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return digits.slice(1);
  }

  return digits || null;
}

function getServiceSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service env vars are not set (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      supabaseUserId,
      phone: phoneFromBody,
      firstName,
      lastName,
      email,
    } = body as {
      supabaseUserId?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    if (!supabaseUserId) {
      return NextResponse.json(
        { ok: false, error: "supabaseUserId is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // 1. Берём профиль из public.profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, first_name, last_name, middle_name, phone, phone_normalized, vetm_client_id"
      )
      .eq("id", supabaseUserId)
      .maybeSingle();

    if (profileError) {
      console.error("[Vetmanager init] profileError:", profileError);
      return NextResponse.json(
        { ok: false, error: "Profile fetch error" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // 2. Если уже есть vetm_client_id → НИЧЕГО не создаём, выходим
    if (profile.vetm_client_id) {
      return NextResponse.json(
        {
          ok: true,
          alreadyLinked: true,
          vetmClientId: profile.vetm_client_id,
        },
        { status: 200 }
      );
    }

    // 3. Готовим нормализованный телефон
    const normalizedPhone =
      profile.phone_normalized ??
      normalizePhoneForSearch(profile.phone || phoneFromBody);

    if (!normalizedPhone) {
      // Нет телефона → не с чем работать. Просто выходим.
      return NextResponse.json(
        {
          ok: true,
          alreadyLinked: false,
          reason: "no phone",
        },
        { status: 200 }
      );
    }

    // 4. Пытаемся найти клиента в Vetmanager по телефону
    let vetmClient = await searchClientByPhone(normalizedPhone).catch((err) => {
      console.error("[Vetmanager init] searchClientByPhone error:", err);
      return null;
    });

    // 5. Если не нашли — создаём нового, НО только один раз
    if (!vetmClient) {
      const createPayload = {
        firstName: firstName || profile.first_name || "",
        middleName: profile.middle_name || "",
        lastName: lastName || profile.last_name || "",
        phone: normalizedPhone,
        email: email || profile.email || undefined,
      };

      vetmClient = await vetmCreateClient(createPayload).catch((err) => {
        console.error("[Vetmanager init] vetmCreateClient error:", err);
        return null;
      });

      if (!vetmClient) {
        return NextResponse.json(
          { ok: false, error: "Failed to create Vetmanager client" },
          { status: 500 }
        );
      }
    }

    // 6. Сохраняем vetm_client_id и нормализованный телефон в профиле
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        vetm_client_id: vetmClient.id,
        phone_normalized: normalizedPhone,
        // подравнять email / first_name / last_name, если нужно:
        email: profile.email || email || null,
        first_name: profile.first_name || firstName || null,
        last_name: profile.last_name || lastName || null,
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("[Vetmanager init] update profile error:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update profile with Vetm id" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        alreadyLinked: false,
        vetmClientId: vetmClient.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager init] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
