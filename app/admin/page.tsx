// app/admin/page.tsx
"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { reviews } from "@/data/reviews";

export default function AdminDashboardPage() {
  // Пока моковые цифры
  const stats = {
    reviewsTotal: reviews.length,
    reviewsPending: 2, // допустим, 2 на модерации
    requestsTotal: 5,
    requestsPending: 2,
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <span className="text-slate-700">Админ-панель</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Админ-панель OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl">
                  В этом разделе будут управляться отзывы, заявки и внутренние
                  настройки сервиса. Сейчас это демонстрационный каркас
                  интерфейса.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Сводка */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-1 text-[13px]">
              <div className="text-[12px] text-slate-500">
                Отзывы
              </div>
              <div className="text-[24px] font-semibold text-onlyvet-navy">
                {stats.reviewsTotal}
              </div>
              <div className="text-[12px] text-slate-600">
                На модерации:{" "}
                <span className="font-semibold text-amber-700">
                  {stats.reviewsPending}
                </span>
              </div>
              <Link
                href="/admin/reviews"
                className="mt-auto text-[12px] text-onlyvet-coral font-medium"
              >
                Перейти к модерации →
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-1 text-[13px]">
              <div className="text-[12px] text-slate-500">
                Заявки на консультацию
              </div>
              <div className="text-[24px] font-semibold text-onlyvet-navy">
                {stats.requestsTotal}
              </div>
              <div className="text-[12px] text-slate-600">
                Ожидают обработки:{" "}
                <span className="font-semibold text-amber-700">
                  {stats.requestsPending}
                </span>
              </div>
              <Link
                href="/admin/requests"
                className="mt-auto text-[12px] text-onlyvet-coral font-medium"
              >
                Смотреть заявки →
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-1 text-[13px]">
              <div className="text-[12px] text-slate-500">
                Сервис
              </div>
              <div className="text-[13px] text-slate-600">
                Здесь позже можно разместить:
              </div>
              <ul className="text-[12px] text-slate-600 list-disc pl-4">
                <li>настройки расписаний</li>
                <li>управление врачами</li>
                <li>служебные заметки</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
