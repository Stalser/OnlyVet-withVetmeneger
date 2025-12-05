// app/api/booking/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { BookingRequest, BookingStatus } from "@/lib/types";
import { mockBookings } from "./mockStore";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

function buildPlannedAt(
  date: string | undefined,
  time: string | undefined
): string | null {
  if (!date || !time) return null;
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
      supabaseUserId, // 🔹 id пользователя в Supabase (может быть undefined)
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
      userId: undefined,
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

    // 1) сохраняем в in-memory store (как раньше)
    mockBookings.push(booking);

    // 2) Пытаемся записать в Supabase, если серверный клиент настроен
    const supabaseServer = getSupabaseServerClient();

    if (supabaseServer) {
      try {
        const ownerId: string | null =
          typeof supabaseUserId === "string" && supabaseUserId.trim()
            ? supabaseUserId
            : null;

        let resolvedPetId: string | null = petId || null;

        // Новый питомец → создаём запись в pets
        if (
          ownerId &&
          petMode !== "existing" &&
          (petName && String(petName).trim().length > 0)
        ) {
          const insertPetPayload: Record<string, any> = {
            owner_id: ownerId,
            name: String(petName).trim(),
            species: petSpecies || null,
            age_text: null,
            weight_kg: null,
            notes: petNotes || null,
          };

          const { data: petInsertData, error: petInsertError } =
            await supabaseServer
              .from("pets")
              .insert(insertPetPayload)
              .select("id")
              .single();

          if (petInsertError) {
            console.error(
              "[API] Failed to insert pet into Supabase:",
              petInsertError
            );
          } else if (petInsertData?.id) {
            resolvedPetId = petInsertData.id as string;
          }
        }

        const plannedAt =
          timeMode === "choose"
            ? buildPlannedAt(preferredDate, preferredTime)
            : null;

        const insertConsultationPayload: Record<string, any> = {
          owner_id: ownerId,
          pet_id: resolvedPetId,
          status: "new",
          service_id: serviceId || null,
          planned_at: plannedAt,
          vm_request_id: vmSlotId || null,
          complaint: complaint || null,
        };

        const { error: insertConsultationError } = await supabaseServer
          .from("consultations")
          .insert(insertConsultationPayload);

        if (insertConsultationError) {
          console.error(
            "[API] Failed to insert consultation into Supabase:",
            insertConsultationError
          );
        }
      } catch (e) {
        console.error("[API] Unexpected error inserting into Supabase:", e);
        // не роняем основной ответ клиенту — просто логируем
      }
    } else {
      console.warn(
        "[API] Supabase server client is not configured; skipping DB insert."
      );
    }

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
