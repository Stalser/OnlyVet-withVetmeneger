// app/admin/reviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { ReviewCard } from "@/components/ReviewCard";
import { reviews, type Review, type ReviewModerationStatus } from "@/data/reviews";

type StatusFilter = "all" | ReviewModerationStatus;
type SourceFilter = "all" | "yandex" | "2gis" | "google" | "site";

function getInitialStatus(r: Review): ReviewModerationStatus {
  // если статус не задан — считаем, что он уже одобрен (для старых отзывов)
  return r.status ?? "approved";
}

export default function AdminReviewsPage() {
  // локальное состояние модерации (поверх данных)
  const [state, setState] = useState<Record<string, ReviewModerationStatus>>(
    () =>
      reviews.reduce((acc, r) => {
        acc[r.id] = getInitialStatus(r);
        return acc;
      }, {} as Record<string, ReviewModerationStatus>)
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const {
    total,
    pendingCount,
    approvedCount,
    rejectedCount,
    filtered,
  } = useMemo(() => {
    const total = reviews.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    const withStatus = reviews.map((r) => {
      const s = state[r.id] ?? getInitialStatus(r);
      if (s === "pending") pendingCount++;
      if (s === "approved") approvedCount++;
      if (s === "rejected") rejectedCount++;
      return { review: r, status: s };
    });

    let list = withStatus;

    // фильтр по статусу
    if (statusFilter !== "all") {
      list = list.filter((item) => item.status === statusFilter);
    }

    // фильтр по источнику
    if (sourceFilter !== "all") {
      list = list.filter((item) => item.review.source === sourceFilter);
    }

    // сортируем по дате — сначала новые
    list.sort((a, b) => {
      const da = new Date(a.review.date).getTime();
      const db = new Date(b.review.date).getTime();
      return db - da;
    });

    return {
      total,
      pendingCount,
      approvedCount,
      rejectedCount,
      filtered: list,
    };
  }, [state, statusFilter, sourceFilter]);

  const setReviewStatus = (id: string, status: ReviewModerationStatus) => {
    setState((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              / <span className="text-slate-700">Отзывы (модерация)</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Модерация отзывов
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь можно просматривать отзывы, менять их статус (на
                  модерации / опубликован / отклонён) и смотреть, откуда они
                  пришли (Яндекс, 2ГИС, Google или с сайта OnlyVet). Публикация
                  на витрине сайта происходит только для одобренных отзывов.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Статистика */}
          <section className="grid gap-3 md:grid-cols-4 text-[13px]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Всего отзывов</div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {total}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">На модерации</div>
              <div className="text-[22px] font-semibold text-amber-700">
                {pendingCount}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Опубликованы</div>
              <div className="text-[22px] font-semibold text-emerald-700">
                {approvedCount}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Отклонены</div>
              <div className="text-[22px] font-semibold text-rose-700">
                {rejectedCount}
              </div>
            </div>
          </section>

          {/* Фильтры по статусу и источнику */}
          <section className="space-y-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-2">
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
                    setStatusFilter(btn.key as StatusFilter)
                  }
                  className={`px-3 py-1.5 rounded-full border transition ${
                    statusFilter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Источник:</span>
              {[
                { key: "all", label: "Все" },
                { key: "yandex", label: "Яндекс" },
                { key: "2gis", label: "2ГИС" },
                { key: "google", label: "Google" },
                { key: "site", label: "Сайт OnlyVet" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() =>
                    setSourceFilter(btn.key as SourceFilter)
                  }
                  className={`px-3 py-1.5 rounded-full border transition ${
                    sourceFilter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* Список отзывов с действиями */}
          <section className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2 items-stretch">
              {filtered.map(({ review, status }) => (
                <article
                  key={review.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-3"
                >
                  {/* Верх: статус + краткая инфа */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="px-2 py-[2px] rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                      ID: {review.id}
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {/* Карточка отзыва (как видит клиент, но в мини-сетке) */}
                  <ReviewCard review={review} truncate />

                  {/* Действия модерации */}
                  <div className="flex flex-wrap gap-2 text-[12px]">
                    {status !== "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewStatus(review.id, "approved")
                        }
                        className="px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Одобрить
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewStatus(review.id, "rejected")
                        }
                        className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition"
                      >
                        Отклонить
                      </button>
                    )}
                    {status !== "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewStatus(review.id, "pending")
                        }
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                      >
                        Вернуть на модерацию
                      </button>
                    )}
                    <Link
                      href={`/reviews/${review.id}`}
                      className="ml-auto text-onlyvet-coral font-medium"
                    >
                      Открыть на сайте →
                    </Link>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && (
                <div className="text-[13px] text-slate-500 col-span-full">
                  По выбранным фильтрам отзывов пока нет.
                </div>
              )}
            </div>
          </section>

          {/* Пояснение про сохранение */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Важно про текущее состояние модерации
            </div>
            <p>
              Сейчас статусы отзывов в этой панели хранятся только в памяти
              браузера (state). Это демо-режим: при перезагрузке страницы
              изменения не сохраняются обратно в <code>data/reviews.ts</code>,
              так как нет подключённой базы данных или API.
            </p>
            <p>
              Когда появится постоянное хранилище (например, база или
              интеграция с Vetmanager / отдельным backend), эти же статусы
              можно будет сохранять и использовать напрямую на витрине сайта.
              Структура уже готова: поле <code>status</code> в{" "}
              <code>Review</code> и фильтрация на странице{" "}
              <code>/reviews</code>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: ReviewModerationStatus }) {
  if (status === "pending") {
    return (
      <span className="px-2 py-[2px] rounded-full bg-amber-50 text-amber-700 text-[11px]">
        На модерации
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span className="px-2 py-[2px] rounded-full bg-emerald-50 text-emerald-700 text-[11px]">
        Опубликован
      </span>
    );
  }
  return (
    <span className="px-2 py-[2px] rounded-full bg-rose-50 text-rose-700 text-[11px]">
      Отклонён
    </span>
  );
}
