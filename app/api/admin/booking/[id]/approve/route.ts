// app/api/admin/booking/[id]/approve/route.ts

import { NextRequest, NextResponse } from "next/server";

/**
 * ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ОДОБРЕНИЯ ЗАЯВОК.
 *
 * Раньше здесь была логика с mockBookings и вызовами Vetmanager,
 * но сейчас нам важно, чтобы сайт нормально деплоился,
 * поэтому мы убираем все импорт-зависимости и оставляем честный 501.
 *
 * Когда появится реальная БД и ключи Vetmanager, сюда вернём полноценную логику:
 *  - найти заявку в БД
 *  - найти/создать клиента и питомца в Vetmanager
 *  - создать приём
 *  - обновить статус заявки и консультации
 */

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    {
      error: "Одобрение заявок пока не реализовано (демо-режим).",
      id: params.id,
    },
    { status: 501 }
  );
}
