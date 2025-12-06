// app/api/vetm/pets/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * ВРЕМЕННАЯ заглушка старого маршрута /api/vetm/pets.
 * Никаких запросов в Vetmanager здесь сейчас нет.
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Интеграция с клиникой временно отключена. Питомцы из Vetmanager будут подключены позже.",
    },
    { status: 503 }
  );
}
