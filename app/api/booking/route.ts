// app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { BookingRequest } from "@/lib/types";

// пока — in-memory store вместо БД (для прототипа)
// потом это заменится на вызовы к Postgres / Supabase
const mockBookings: BookingRequest[] = [];

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

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "fullName и phone обязательны" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const now = new Date().toISOString();

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

      status: "pending",
    };

    // TODO: заменить на запись в БД
    mockBookings.push(booking);

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    console.error("[API] /booking POST error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// Дополнительно можно реализовать GET для списка заявок пользователя
export async function GET(req: NextRequest) {
  // TODO: фильтровать по userId из сессии
  return NextResponse.json({ bookings: mockBookings }, { status: 200 });
}
