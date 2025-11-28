// app/api/admin/booking/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * ВРЕМЕННАЯ ЗАГЛУШКА.
 *
 * Этот эндпоинт будет использоваться для одобрения заявок
 * и интеграции с Vetmanager (создание клиента, питомца, приёма).
 *
 * Сейчас он только возвращает "Not implemented", чтобы не ломать сборку.
 * Когда появится реальная БД и ключи Vetmanager, сюда вернём полноценную логику.
 */

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    {
      error: "Одобрение заявок пока не реализовано в демо-версии.",
      id: params.id,
    },
    { status: 501 }
  );
}
