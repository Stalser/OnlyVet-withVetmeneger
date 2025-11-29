// app/api/prices/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockPrices, createPriceItem } from "./mockStore";

// GET /api/prices — получить весь прайс
export async function GET(_req: NextRequest) {
  const sorted = [...mockPrices].sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ prices: sorted }, { status: 200 });
}

// POST /api/prices — добавить новую позицию
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = createPriceItem(body);
    mockPrices.push(item);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err: any) {
    console.error("[API] /prices POST error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
