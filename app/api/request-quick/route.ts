// app/api/request-quick/route.ts

import { NextRequest, NextResponse } from "next/server";

// Временное in-memory хранилище коротких заявок
type QuickRequest = {
  id: string;
  createdAt: string;
  name?: string;
  phone: string;
  telegram?: string;
  message?: string;
  source: "short-form";
};

const quickRequests: QuickRequest[] = [];

// POST /api/request-quick — создать короткую заявку
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, telegram, message } = body as {
      name?: string;
      phone?: string;
      telegram?: string;
      message?: string;
    };

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Телефон обязателен для связи" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id =
      Math.random().toString(36).slice(2) + Date.now().toString(36);

    const quick: QuickRequest = {
      id,
      createdAt: now,
      name: name?.trim() || undefined,
      phone: phone.trim(),
      telegram: telegram?.trim() || undefined,
      message: message?.trim() || undefined,
      source: "short-form",
    };

    quickRequests.push(quick);

    // В будущем: отправка письма/уведомления регистратору
    return NextResponse.json({ request: quick }, { status: 201 });
  } catch (err) {
    console.error("[API] /request-quick POST error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// GET /api/request-quick — список коротких заявок (для будущей админки)
export async function GET(_req: NextRequest) {
  return NextResponse.json({ requests: quickRequests }, { status: 200 });
}
