// app/api/vetmanager/find-or-create-client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateClient } from "@/lib/vetmanagerClient";

/**
 * Вспомогательный эндпоинт:
 * POST /api/vetmanager/find-or-create-client
 *
 * Body:
 * {
 *   "phone": "+7 982 913 84 05",
 *   "email": "edk72@yandex.ru",
 *   "firstName": "Данила",
 *   "middleName": "Игоревич",
 *   "lastName": "Князев"
 * }
 *
 * Возвращает Vetmanager-клиента, либо найденного, либо созданного.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const phone = body.phone as string | undefined;
    const email = body.email as string | undefined;
    const firstName = body.firstName as string | undefined;
    const middleName = body.middleName as string | undefined;
    const lastName = body.lastName as string | undefined;

    if (!phone && !email) {
      return NextResponse.json(
        { error: "Нужен хотя бы phone или email" },
        { status: 400 }
      );
    }

    const client = await findOrCreateClient({
      phone,
      email,
      firstName,
      middleName,
      lastName,
    });

    return NextResponse.json(
      {
        ok: true,
        client,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[API /api/vetmanager/find-or-create-client] error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "Vetmanager error",
      },
      { status: 500 }
    );
  }
}
