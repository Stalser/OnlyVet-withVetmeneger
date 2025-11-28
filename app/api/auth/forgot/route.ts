// app/api/auth/forgot/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone, normalizePhone } from "@/lib/db";

// На будущее можно будет добавить поиск по email. Пока — по телефону.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body as { identifier?: string };

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { error: "Не указан телефон или email" },
        { status: 400 }
      );
    }

    // Простая логика: если строка похожа на телефон — ищем по телефону
    const trimmed = identifier.trim();
    const isPhone = /\d/.test(trimmed);

    if (isPhone) {
      const normPhone = normalizePhone(trimmed);
      const user = await getUserByPhone(normPhone);
      // НИКОГДА не говорим пользователю, есть он или нет — это важно для безопасности
      if (user) {
        console.log("[AUTH FORGOT] Запрос на восстановление для phone:", normPhone);
        // TODO: создать token, сохранить его, отправить email/SMS с ссылкой
      }
    } else {
      // TODO: поиск по email, когда появится поле email и методы
      console.log("[AUTH FORGOT] В будущем: обработка по email", trimmed);
    }

    // Всегда одинаковый ответ, чтобы не раскрывать, есть пользователь или нет
    return NextResponse.json(
      {
        ok: true,
        message:
          "Если аккаунт с таким телефоном или email существует, мы отправим на него инструкции по восстановлению.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API] /auth/forgot error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
