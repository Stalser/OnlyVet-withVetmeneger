// app/api/prices/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockPrices } from "../mockStore";

// PATCH /api/prices/:id — обновить позицию прайса
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = mockPrices.find((p) => p.id === params.id);
    if (!item) {
      return NextResponse.json({ error: "Price item not found" }, { status: 404 });
    }

    const body = await req.json();

    if (typeof body.name === "string") item.name = body.name;
    if (typeof body.shortDescription === "string")
      item.shortDescription = body.shortDescription;
    if (typeof body.priceLabel === "string") item.priceLabel = body.priceLabel;
    if (typeof body.isActive === "boolean") item.isActive = body.isActive;
    if (body.kind === "main" || body.kind === "extra") item.kind = body.kind;

    return NextResponse.json({ item }, { status: 200 });
  } catch (err: any) {
    console.error("[API] /prices/:id PATCH error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// DELETE /api/prices/:id — удалить позицию
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = mockPrices.findIndex((p) => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "Price item not found" }, { status: 404 });
  }
  mockPrices.splice(index, 1);
  return NextResponse.json({ ok: true }, { status: 200 });
}
