// app/api/admin/booking/[id]/approve/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { findOrCreateClientByPhone, createPet } from "@/lib/vetmanagerClient";
import type { BookingRequest } from "@/lib/types";

// Сейчас: используем тот же mockBookings, что и в /api/booking.
// В реальности тут будут запросы к БД.
import { mockBookings } from "@/lib/mockBookings"; // Вынеси массив в отдельный модуль

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const booking = mockBookings.find((b) => b.id === bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // 1) Найти или создать клиента в Vetmanager по телефону
    const client = await findOrCreateClientByPhone({
      phone: booking.phone,
      firstName: booking.fullName.split(" ")[1],
      lastName: booking.fullName.split(" ")[0],
      email: booking.email,
    });

    // 2) Найти/создать питомца
    // На этом шаге можно сначала попытаться найти похожего питомца у этого клиента через Vetmanager,
    // но для простоты сразу создадим, если petMode === "new".
    let petVmId: number | undefined = booking.vetmanagerPatientId;

    if (!petVmId && booking.petMode === "new" && booking.petName) {
      const pet = await createPet({
        clientId: client.id,
        alias: booking.petName,
        birthday: undefined, // TODO: когда появится поле даты рождения
        sex: undefined,
      });
      petVmId = pet.id;
    }

    // 3) TODO: Создать приём / запись в Vetmanager (через отдельный helper)
    // например createAppointment({ clientId: client.id, petId: petVmId, doctorId, datetime, ... })
    // а пока просто имитируем
    const vmAppointmentId = Math.floor(Math.random() * 1000000);

    // 4) Обновить заявку (у нас) — сохранить vm-id'шки и статус
    booking.vetmanagerClientId = client.id;
    if (petVmId) booking.vetmanagerPatientId = petVmId;
    booking.vetmanagerAppointmentId = vmAppointmentId;
    booking.status = "approved";

    // TODO: также создать запись в consultations таблице

    return NextResponse.json(
      { booking, vetmanager: { clientId: client.id, patientId: petVmId, appointmentId: vmAppointmentId } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API] /admin/booking/[id]/approve error:", err);
    return NextResponse.json(
      { error: "Vetmanager integration error" },
      { status: 500 }
    );
  }
}
