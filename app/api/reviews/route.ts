// app/api/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { reviews, type Review } from "@/data/reviews";

// Простое in-memory хранилище для отзывов, оставленных с сайта.
// ⚠ На Vercel и т.п. это не будет постоянным хранилищем — чисто демо-режим.
const dynamicReviews: Review[] = [];

// GET /api/reviews — вернуть статические + динамические отзывы
export async function GET(_req: NextRequest) {
  const all = [...reviews, ...dynamicReviews];
  return NextResponse.json({ reviews: all }, { status: 200 });
}

// POST /api/reviews — принять новый отзыв с сайта в статусе "pending"
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      clientName,
      petName,
      doctorId,
      serviceId,
      rating,
      text,
    } = body as {
      clientName?: string;
      petName?: string;
      doctorId?: string;
      serviceId?: string;
      rating?: number;
      text?: string;
    };

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Текст отзыва обязателен" },
        { status: 400 }
      );
    }

    const safeRating =
      typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;

    const newReview: Review = {
      id: randomUUID(),
      clientName: clientName?.trim() || "Анонимный владелец",
      petName: petName?.trim() || undefined,
      rating: safeRating,
      text: text.trim(),
      date: new Date().toISOString(),
      doctorId: doctorId || undefined,
      serviceId: serviceId || undefined,
      source: "site",
      status: "pending",
    };

    dynamicReviews.push(newReview);

    return NextResponse.json(
      {
        ok: true,
        review: newReview,
        message:
          "Отзыв сохранён и отправлен на модерацию. Он появится на сайте после проверки.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] /api/reviews POST error:", err);
    return NextResponse.json(
      { error: "Ошибка при отправке отзыва. Попробуйте позже." },
      { status: 500 }
    );
  }
}
