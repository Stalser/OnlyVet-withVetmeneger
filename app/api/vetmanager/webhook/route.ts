// app/api/vetmanager/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Этот эндпоинт нужно будет указать в настройках Веб-хуков Vetmanager.
 * Vetmanager будет отправлять сюда события в формате:
 * {
 *   "name": "admissionEdit",
 *   "data": {...},
 *   "params": {...}
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[Vetmanager webhook]", payload);

    const { name, data } = payload;

    // TODO: обработать разные типы событий
    // Например, если name === 'admissionEdit' или 'admissionClose':
    // - достать appointment_id из data
    // - найти консультацию в нашей БД по vetmanagerAppointmentId
    // - обновить статус на 'done'

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Vetmanager webhook] error:", err);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
