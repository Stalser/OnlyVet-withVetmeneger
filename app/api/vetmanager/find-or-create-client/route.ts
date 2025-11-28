// app/api/vetmanager/find-or-create-client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateClientByPhone } from "@/lib/vetmanagerClient";

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName, email } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "phone is required" },
        { status: 400 }
      );
    }

    const client = await findOrCreateClientByPhone({
      phone,
      firstName,
      lastName,
      email,
    });

    return NextResponse.json({ client }, { status: 200 });
  } catch (err: any) {
    console.error("[API] find-or-create-client error:", err);
    return NextResponse.json(
      { error: "Vetmanager integration error" },
      { status: 500 }
    );
  }
}
