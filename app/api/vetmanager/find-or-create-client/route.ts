// app/api/vetmanager/find-or-create-client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

export async function POST(req: NextRequest) {
  try {
    const { phone, lastName, firstName, middleName, email } =
      (await req.json()) as {
        phone?: string;
        lastName?: string;
        firstName?: string;
        middleName?: string;
        email?: string;
      };

    if (!phone || !lastName) {
      return NextResponse.json(
        { error: "phone и lastName обязательны" },
        { status: 400 }
      );
    }

    const client = await findOrCreateClientByPhone({
      phone,
      lastName,
      firstName,
      middleName,
      email,
    });

    return NextResponse.json({ client }, { status: 200 });
  } catch (e: any) {
    console.error("[API /api/vetmanager/find-or-create-client] error:", e);
    return NextResponse.json(
      { error: e?.message || "Vetmanager error" },
      { status: 500 }
    );
  }
}
