// app/api/consultations/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import type { ConsultationStatus } from "@/lib/types";
import {
  mockConsultations,
  findConsultationById,
} from "@/lib/mockConsultations";

// GET /api/consultations/:id — получить одну консультацию
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const consultation = findConsultationById(params.id);
  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  return NextResponse.json({ consultation }, { status: 200 });
}

// PATCH /api/consultations/:id — обновить статус, время, резюме
// В перспективе это будет использоваться обработчиком вебхуков от Vetmanager.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultation = findConsultationById(params.id);
    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    const body = await req.json();

    const {
      status,
      startTime,
      endTime,
      summaryForOwner,
    } = body as {
      status?: ConsultationStatus;
      startTime?: string;
      endTime?: string;
      summaryForOwner?: string;
    };

    const allowedStatuses: ConsultationStatus[] = [
      "scheduled",
      "done",
      "cancelled",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (status) {
      consultation.status = status;
    }
    if (startTime !== undefined) {
      consultation.startTime = startTime;
    }
    if (endTime !== undefined) {
      consultation.endTime = endTime;
    }
    if (summaryForOwner !== undefined) {
      consultation.summaryForOwner = summaryForOwner;
    }

    // В будущем:
    //  - сюда прилетит "приём завершён" из Vetmanager,
    //  - мы обновим статус и резюме для владельца,
    //  - отправим письмо клиенту, что консультация завершена.

    return NextResponse.json({ consultation }, { status: 200 });
  } catch (err: any) {
    console.error("[API] /consultations/:id PATCH error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
