// app/api/vetmanager/profile/init/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ВРЕМЕННО: init Vetmanager отключён, чтобы не создавать дубликаты.
  return NextResponse.json(
    {
      ok: false,
      message:
        "Автоматическая привязка к Vetmanager временно отключена. " +
        "Клиента можно завести и связать только через персонал клиники.",
    },
    { status: 200 }
  );
}
