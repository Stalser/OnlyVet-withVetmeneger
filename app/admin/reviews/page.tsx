// app/admin/reviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { reviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";

type ModerationStatus = "pending" | "approved" | "rejected";

type ModerationState = {
  [id: string]: ModerationStatus;
};

export default function AdminReviewsPage() {
  // по умолчанию считаем всё "pending" (для демо)
  const initialState: ModerationState = useMemo(() => {
    const state: ModerationState = {};
    for (const r of reviews) {
      state[r.id] = "pending";
    }
    return state;
  }, []);

  const [modState, setModState] = useState<ModerationState>(initialState);
  const [filter, setFilter] = useState<"all" | ModerationStatus>("pending");

  const filteredReviews = useMemo(
    () =>
      reviews.filter((r) =>
        filter === "all" ? true : modState[r.id] === filter
      ),
    [filter, modState]
  );

  const setStatus = (id: string, status: ModerationStatus) => {
    setModState((prev) => ({ ...prev, [id]: status }));
  };

  const statusLabel = (status: ModerationStatus) => {
    switch (status) {
      case "pending":
        return { label: "На модерации", className: "bg-amber-50 text-amber-700" };
      case "approved":
        return { label: "Опубликован", className: "bg-teal-50 text-teal-700" };
      case "rejected":
        return { label: "Отклонён", className: "bg-rose-50 text-rose-700" };
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Отзывы (модерация)</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Модерация отзывов
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl">
                  Здесь можно просматривать новые отзывы, одобрять их к
                  публикации или отклонять. Пока статус хранится только в
                  интерфейсе (без сохранения в базу).
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-slate-500 mr-1">Статус:</span>
              {[
                { key: "pending", label: "На модерации" },
                { key: "approved", label: "Опубликованы" },
                { key: "rejected", label: "Отклонённые" },
                { key: "all", label: "Все" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() =>
                    setFilter(
                      btn.key as "all" | ModerationStatus
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border transition ${
                    filter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Список отзывов */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredReviews.map((rev) => {
                const status = modState[rev.id] ?? "pending";
                const smeta = statusLabel(status);
                return (
                  <article
                    key={rev.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-[12px] text-slate-500">
                        Отзыв #{rev.id.toUpperCase()}
                      </div>
                      <span
                        className={`px-2 py-[2px] rounded-full text-[11px] ${smeta.className}`}
                      >
                        {smeta.label}
                      </span>
                    </div>

                    <ReviewCard review={rev} truncate />

                    <div className="flex flex-wrap gap-2 pt-1 text-[12px]">
                      <button
                        type="button"
                        onClick={() => setStatus(rev.id, "approved")}
                        className="px-3 py-1.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition"
                      >
                        Одобрить
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(rev.id, "rejected")}
                        className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition"
                      >
                        Отклонить
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(rev.id, "pending")}
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                      >
                        Сбросить
                      </button>
                      <Link
                        href={`/reviews/${rev.id}`}
                        className="ml-auto text-onlyvet-coral font-medium"
                      >
                        Открыть на сайте →
                      </Link>
                    </div>
                  </article>
                );
              })}
              {filteredReviews.length === 0 && (
                <div className="text-[13px] text-slate-500 col-span-full">
                  По выбранному статусу пока нет отзывов.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
