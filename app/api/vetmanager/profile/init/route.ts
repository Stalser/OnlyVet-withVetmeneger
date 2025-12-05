// app/api/vetmanager/profile/init/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import {
  findOrCreateClientByPhone,
} from "@/lib/vetmanagerClient";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Получаем текущего пользователя
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Загружаем профиль
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(profileError);
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const phone = profile.phone;
    let vetmId = profile.vetm_client_id;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is missing in profile" },
        { status: 400 }
      );
    }

    // 3. Если vetm_client_id отсутствует → ищем/создаём в Vetmanager
    if (!vetmId) {
      console.log("[Init] Creating/Searching Vetmanager client for phone:", phone);

      const client = await findOrCreateClientByPhone({
        phone,
        firstName: profile.first_name || undefined,
        lastName: profile.last_name || undefined,
        email: profile.email || undefined,
      });

      vetmId = client.id;

      // сохраняем в таблицу Supabase
      await supabase
        .from("profiles")
        .update({ vetm_client_id: vetmId })
        .eq("id", user.id);
    }

    return NextResponse.json({
      success: true,
      vetm_client_id: vetmId,
    });
  } catch (err: any) {
    console.error("[Vetmanager:init] ERROR", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
