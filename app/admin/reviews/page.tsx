// app/admin/reviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type ModerationStatus = "pending" | "approved" | "rejected";

type ModerationState = {
  [id: string]: ModerationStatus;
};

type SourceFilter = "all" | "yandex" | "2gis" | "google" | "site";
type DoctorFilter = "all" | string;
type ServiceFilter = "all" | string;

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
  const [statusFilter, setStatusFilter] = useState<"all" | ModerationStatus>("pending");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [doctorFilter, setDoctorFilter] = useState<DoctorFilter>("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    // по статусу модерации
    list = list.filter((r) =>
      statusFilter === "all" ? true : modState[r.id] === statusFilter
    );

    // по источнику
    if (sourceFilter !== "all") {
      list = list.filter((r) => r.source === sourceFilter);
    }

    // по врачу
    if (doctorFilter !== "all") {
      list = list.filter((r) => r.doctorId === doctorFilter);
    }

    // по услуге
    if (serviceFilter !== "all") {
      list = list.filter((r) => r.serviceId === serviceFilter);
    }

    // новые сначала
    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return db - da;
    });

    return list;
  }, [statusFilter, sourceFilter, doctorFilter, serviceFilter, modState]);

  const setStatus = (id: string, status: ModerationStatus) => {
    setModState((prev) => ({ ...prev, [id]: status }));
  };

  const statusLabel = (status: ModerationStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "На модерации",
          className: "bg-amber-50 text-amber-700",
        };
      case "approved":
        return {
          label: "Опубликован",
          className: "bg-teal-50 text-teal-700",
        };
      case "rejected":
        return {
          label: "Отклонён",
          className: "bg-rose-50 text-rose-700",
        };
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Отзывы (модерация)</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Модерация отзывов
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь можно просматривать новые отзывы, одобрять их к
                  публикации или отклонять. В демо-версии статус хранится только
                  в интерфейсе (без записи в базу и влияния на публичную
                  страницу отзывов).
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Фильтры */}
          <section className="space-y-3 text-[12px]">
            {/* Статус */}
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
                    setStatusFilter(btn.key as "all" | ModerationStatus)
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

            {/* Источник */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Источник:</span>
              {([
                { key: "all", label: "Все" },
                { key: "yandex", label: "Яндекс" },
                { key: "2gis", label: "2ГИС" },
                { key: "google", label: "Google" },
                { key: "site", label: "Сайт OnlyVet" },
              ] as { key: SourceFilter; label: string }[]).map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setSourceFilter(btn.key)}
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

            {/* Врач */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Врач:</span>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value as DoctorFilter)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[12px] text-onlyvet-navy focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="all">Все врачи</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Услуга */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Услуга:</span>
              <select
                value={serviceFilter}
                onChange={(e) =>
                  setServiceFilter(e.target.value as ServiceFilter)
                }
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[12px] text-onlyvet-navy focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="all">Все услуги</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Список отзывов */}
          <section className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredReviews.map((rev) => {
                const status = modState[rev.id] ?? "pending";
                const smeta = statusLabel(status);

                return (
                  <article
                    key={rev.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-3"
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

                    {/* Карточка отзыва в компактном виде */}
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
                        className="ml-auto text-onlyvet-coral font-medium hover:underline"
                      >
                        Открыть на сайте →
                      </Link>
                    </div>
                  </article>
                );
              })}

              {filteredReviews.length === 0 && (
                <div className="text-[13px] text-slate-500 col-span-full">
                  По выбранным фильтрам пока нет отзывов.
                </div>
              )}
            </div>
          </section>

          {/* Пояснение про демо-состояние */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Текущее состояние модуля отзывов
            </div>
            <p>
              Сейчас статусы модерации отзывов (на модерации, опубликован, отклонён)
              хранятся только в интерфейсе и не влияют на публичную страницу{" "}
              <code>/reviews</code>. Все отзывы берутся из статического списка{" "}
              <code>data/reviews.ts</code>.
            </p>
            <p>
              В дальнейшем сюда можно будет добавить:
              <br />— хранение статусов в базе данных или Vetmanager;
              <br />— показ на сайте только одобренных отзывов;
              <br />— автоматический импорт отзывов с внешних площадок
              (Яндекс, 2ГИС и др.) с возможностью ручной модерации.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
