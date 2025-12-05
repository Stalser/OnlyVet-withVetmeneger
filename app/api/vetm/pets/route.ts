// app/api/vetm/pets/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  findOrCreateClientByPhone,
  getPetsByClientId,
  VetmClient,
  VetmPet,
} from "@/lib/vetmanagerClient";

// Этот эндпоинт вызывается ТОЛЬКО с сервера (через наш фронт).
// На вход: phone (+ опционально firstName/lastName/email).
// На выход: client + список pets из Vetmanager.

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName, email } = (await req.json()) as {
      phone?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    if (!phone) {
      return NextResponse.json(
        { error: "phone is required" },
        { status: 400 }
      );
    }

    const client: VetmClient = await findOrCreateClientByPhone({
      phone,
      firstName,
      lastName,
      email,
    });

    const pets: VetmPet[] = await getPetsByClientId(client.id);

    return NextResponse.json(
      {
        client,
        pets,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[API /api/vetm/pets] error:", e);
    return NextResponse.json(
      { error: "Vetmanager error: " + (e?.message || "unknown") },
      { status: 500 }
    );
  }
}
