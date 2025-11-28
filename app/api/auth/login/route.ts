// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone, normalizePhone } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Телефон и пароль обязательны" },
        { status: 400 }
      );
    }

    const normPhone = normalizePhone(phone);
    const user = await getUserByPhone(normPhone);

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном не найден" },
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

    // TODO: здесь нужно создать сессию (httpOnly cookie / JWT)
    // Сейчас просто возвращаем user, чисто для проверки.

    return NextResponse.json(
      {
        user: {
          id: user.id,
          phone: user.phone,
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
