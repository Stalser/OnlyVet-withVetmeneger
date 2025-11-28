// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone, getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Телефон/email и пароль обязательны" },
        { status: 400 }
      );
    }

    const trimmed = String(identifier).trim();

    const isEmail = trimmed.includes("@");
    const user = isEmail
      ? await getUserByEmail(trimmed)
      : await getUserByPhone(trimmed);

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь с такими данными не найден" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 401 }
      );
    }

    // TODO: создать сессию (cookie) и возвращать только нужные данные
    return NextResponse.json(
      {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API] /auth/login error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
