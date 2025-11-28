// app/api/booking/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import type { BookingStatus } from "@/lib/types";
import { mockBookings } from "@/lib/mockBookings";

// GET /api/booking/:id — получить одну заявку
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const booking = findBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking }, { status: 200 });
}

// PATCH /api/booking/:id — обновить статус / причину отмены
// В будущем это будет вызываться:
//  - либо сайтом (когда клиент отменяет заявку),
//  - либо обработчиком вебхука от Vetmanager (когда меняется статус приёма).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = findBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();

    const { status, cancelReason } = body as {
      status?: BookingStatus;
      cancelReason?: string;
    };

    if (status && !["pending", "in_review", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (status) {
      booking.status = status;
    }

    if (cancelReason !== undefined) {
      booking.cancelReason = cancelReason;
    }

    // TODO (позже): на изменение статуса можно подвесить:
    //  - отправку письма клиенту,
    //  - синхронизацию с Vetmanager (например, отмена приёма).

    return NextResponse.json({ booking }, { status: 200 });
  } catch (err: any) {
    console.error("[API] /booking/:id PATCH error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
