// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByPhone, normalizePhone } from "@/lib/db";
import { hashPassword, isPasswordStrong } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, fullName, password, password2, email, telegram } = body;

    if (!phone || !password || !password2) {
      return NextResponse.json(
        { error: "Телефон и пароль обязательны" },
        { status: 400 }
      );
    }

    if (password !== password2) {
      return NextResponse.json(
        { error: "Пароли не совпадают" },
        { status: 400 }
      );
    }

    if (!isPasswordStrong(password)) {
      return NextResponse.json(
        { error: "Пароль слишком простой. Минимум 8 символов." },
        { status: 400 }
      );
    }

    const normPhone = normalizePhone(phone);
    const existing = await getUserByPhone(normPhone);
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);

    const user = await createUser({
      phone: normPhone,
      email,
      password_hash,
      full_name: fullName,
      telegram,
    });

    // TODO: создать сессию (cookie / JWT) и вернуть юзера
    // Пока просто возвращаем json
    return NextResponse.json(
      {
        user: {
          id: user.id,
          phone: user.phone,
          full_name: user.full_name,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] /auth/register error:", err);
    const msg =
      err?.message === "USER_DUPLICATE_PHONE"
        ? "Пользователь с таким телефоном уже есть"
        : "Internal error";
    const status = err?.message === "USER_DUPLICATE_PHONE" ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
