// app/api/booking/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { BookingRequest, BookingStatus } from "@/lib/types";
import { mockBookings } from "./mockStore";
import { supabaseServer } from "@/lib/supabaseServer";

function buildPlannedAt(
  date: string | undefined,
  time: string | undefined
): string | null {
  if (!date || !time) return null;
  // date: "2025-01-10", time: "19:00"
  try {
    const iso = new Date(`${date}T${time}:00`).toISOString();
    return iso;
  } catch {
    return null;
  }
}

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
      complaint,
      supabaseUserId, // 🔹 опционально: id пользователя из Supabase (когда добавим на фронт)
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
      userId: undefined, // когда появится auth на уровне OnlyVet — сюда положим внутренний id
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

      complaint,
      status,
    };

    // 🧱 1) старое поведение — сохраняем в in-memory store для админки
    mockBookings.push(booking);

    // 🧱 2) НОВОЕ поведение — добавляем строку в consultations (Supabase)
    try {
      const plannedAt =
        timeMode === "choose"
          ? buildPlannedAt(preferredDate, preferredTime)
          : null;

      const insertPayload: Record<string, any> = {
        owner_id: supabaseUserId || null, // пока необязательно, но если придёт — будет связка с кабинетом
        pet_id: petId || null,
        status: "new",
        service_id: serviceId || null,
        planned_at: plannedAt,
        vm_request_id: vmSlotId || null,
        complaint: complaint || null,
      };

      // Вставляем с сервисным ключом, RLS не мешает
      const { error: insertError } = await supabaseServer
        .from("consultations")
        .insert(insertPayload);

      if (insertError) {
        console.error(
          "[API] Failed to insert consultation into Supabase:",
          insertError
        );
      }
    } catch (e) {
      console.error("[API] Unexpected error inserting consultation:", e);
    }

    // TODO (позже): отправить письма клиенту и регистратуре
    // TODO (позже): создать / обновить клиента и питомца в Vetmanager, создать черновой приём

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    console.error("[API] /booking POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET /api/booking — список заявок
export async function GET(_req: NextRequest) {
  return NextResponse.json({ bookings: mockBookings }, { status: 200 });
}
