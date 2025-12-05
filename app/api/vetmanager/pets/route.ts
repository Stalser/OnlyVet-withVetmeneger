// app/api/vetmanager/pets/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  findOrCreateClientByPhone,
  getPetsByClientId,
} from "@/lib/vetmanagerClient";

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName, email } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "phone is required" },
        { status: 400 }
      );
    }

    // Ищем или создаём клиента в Vetmanager
    const client = await findOrCreateClientByPhone({
      phone,
      firstName,
      lastName,
      email,
    });

    // Получаем питомцев этого клиента
    const pets = await getPetsByClientId(client.id);

    return NextResponse.json(
      {
        client: {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          cell_phone: client.cell_phone,
        },
        pets,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Vetmanager pets API] error:", err?.message || err);
    return NextResponse.json(
      { error: "Не удалось получить список питомцев." },
      { status: 500 }
    );
  }
}
