// app/api/consultations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { Consultation, ConsultationStatus } from "@/lib/types";
import { mockConsultations } from "@/lib/mockConsultations";

// GET /api/consultations — список консультаций
// Пока отдаём все. В будущем:
//  - если клиент: только свои (по userId из сессии);
//  - если админ: все, с фильтрами по врачу/статусу.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ consultations: mockConsultations }, { status: 200 });
}

// POST /api/consultations — создать консультацию (демо / под будущие вебхуки)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      petId,
      bookingRequestId,
      doctorId,
      serviceId,
      vetmanagerAppointmentId,
      startTime,
      endTime,
      status,
      summaryForOwner,
    } = body as Partial<Consultation>;

    // минимальная проверка статуса
    const allowedStatuses: ConsultationStatus[] = [
      "scheduled",
      "done",
      "cancelled",
    ];
    const normalizedStatus: ConsultationStatus =
      allowedStatuses.includes(status as ConsultationStatus)
        ? (status as ConsultationStatus)
        : "scheduled";

    const id = randomUUID();

    const consultation: Consultation = {
      id,
      userId,
      petId,
      bookingRequestId,
      doctorId,
      serviceId,
      vetmanagerAppointmentId,
      startTime,
      endTime,
      status: normalizedStatus,
      summaryForOwner,
    };

    mockConsultations.push(consultation);

    // В будущем сюда "сядет":
    //  - обработка вебхуков от Vetmanager,
    //  - привязка Consultation к BookingRequest, Pet и User,
    //  - отправка писем клиенту по событиям (завершена, перенесена и т.д.).

    return NextResponse.json({ consultation }, { status: 201 });
  } catch (err: any) {
    console.error("[API] /consultations POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
