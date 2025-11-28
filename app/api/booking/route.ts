// app/api/booking/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { BookingRequest, BookingStatus } from "@/lib/types";
import { mockBookings } from "@/lib/mockBookings";

// POST /api/booking — создать новую заявку
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      phone,
      telegram,
      email,
      petMode,
      petId,
      petName,
      petSpecies,
      petNotes,
      serviceId,
      doctorId,
      timeMode,
      preferredDate,
      preferredTime,
      vmSlotId,
    } = body;

    // минимальная валидация
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "fullName и phone обязательны" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const status: BookingStatus = "pending";

    const booking: BookingRequest = {
      id,
      userId: undefined, // когда появится auth — сюда положим id пользователя
      createdAt: now,

      fullName,
      phone,
      telegram,
      email,

      petMode: petMode === "existing" ? "existing" : "new",
      petId,
      petName,
      petSpecies,
      petNotes,

      serviceId,
      doctorId,
      timeMode: timeMode === "choose" ? "choose" : "any",
      preferredDate,
      preferredTime,
      vmSlotId,

      status,
    };

    // TODO: заменить на запись в БД
    mockBookings.push(booking);

    // TODO (позже): отправить письма клиенту и регистратуре
    // TODO (позже): создать / обновить клиента и питомца в Vetmanager, создать черновой приём

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    console.error("[API] /booking POST error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// GET /api/booking — список заявок
// В будущем здесь:
//  - если запрос от клиента — только его заявки (по userId из сессии)
//  - если запрос от админа — все заявки или с фильтрами
export async function GET(_req: NextRequest) {
  // TODO: фильтровать по userId из сессии
  return NextResponse.json({ bookings: mockBookings }, { status: 200 });
}
