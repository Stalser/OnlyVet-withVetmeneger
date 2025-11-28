// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByPhone, getUserByEmail, normalizePhone } from "@/lib/db";
import { hashPassword, isPasswordStrong } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      phone,
      email,
      lastName,
      firstName,
      middleName,
      password,
      password2,
      telegram,
    } = body;

    if (!phone || !email || !password || !password2 || !lastName || !firstName) {
      return NextResponse.json(
        { error: "Фамилия, имя, телефон, email и пароль обязательны" },
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

    const existingByPhone = await getUserByPhone(normPhone);
    if (existingByPhone) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 409 }
      );
    }

    const existingByEmail = await getUserByEmail(email);
    if (existingByEmail) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    const full_name = [lastName, firstName, middleName].filter(Boolean).join(" ");

    const user = await createUser({
      phone,
      email,
      password_hash,
      full_name,
      telegram,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] /auth/register error:", err);
    let msg = "Internal error";
    let status = 500;

    if (err?.message === "USER_DUPLICATE_PHONE") {
      msg = "Пользователь с таким телефоном уже есть";
      status = 409;
    } else if (err?.message === "USER_DUPLICATE_EMAIL") {
      msg = "Пользователь с таким email уже есть";
      status = 409;
    }

    return NextResponse.json({ error: msg }, { status });
  }
}
