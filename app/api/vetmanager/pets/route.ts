// app/api/vetmanager/pets/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Связка с клиникой временно отключена. Обратитесь в поддержку, если вам нужно видеть питомцев из карты клиники.",
    },
    { status: 503 }
  );
}
