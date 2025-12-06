// app/api/vetmanager/debug/route.ts
import { NextRequest, NextResponse } from "next/server";

const VETM_DOMAIN = process.env.VETM_DOMAIN;
const VETM_API_KEY = process.env.VETM_API_KEY;

if (!VETM_DOMAIN || !VETM_API_KEY) {
  console.warn(
    "[Vetmanager DEBUG] VETM_DOMAIN или VETM_API_KEY не заданы в env."
  );
}

/**
 * GET /api/vetmanager/debug?phone=...
 *
 * ВРЕМЕННЫЙ debug-роут.
 * Ничего не создаёт, только делает запрос в Vetmanager и возвращает сырой ответ.
 */
export async function GET(req: NextRequest) {
  try {
    if (!VETM_DOMAIN || !VETM_API_KEY) {
      return NextResponse.json(
        { error: "Vetmanager env не сконфигурирован" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone") ?? "";

    if (!phone.trim()) {
      return NextResponse.json(
        { error: "Параметр phone обязателен" },
        { status: 400 }
      );
    }

    const digits = phone.replace(/\D/g, "");

    // ⚠️ Здесь самый важный момент — property.
    // Мы сейчас пробуем "phone". Если окажется, что нужно другое,
    // это станет видно из ответа.
    const filter = encodeURIComponent(
      JSON.stringify([
        {
          property: "phone",
          value: digits,
          operator: "=", // по докам может быть другой, но начнём с "="
        },
      ])
    );

    const url = `${VETM_DOMAIN}/rest/api/client?filter=${filter}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-REST-API-KEY": VETM_API_KEY,
        "X-REST-TIME-ZONE": "Europe/Moscow",
      },
    });

    const text = await res.text();

    console.log("[Vetmanager DEBUG] status:", res.status);
    console.log("[Vetmanager DEBUG] body:", text);

    // просто возвращаем, как есть (Vetmanager обычно шлёт JSON)
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Vetmanager DEBUG] unexpected error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка debug-роута Vetmanager" },
      { status: 500 }
    );
  }
}
