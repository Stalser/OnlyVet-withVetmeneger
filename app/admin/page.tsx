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

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <span className="text-slate-700">Админ-панель</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold">
                  Админ-панель OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь управляются отзывы, заявки и сервисные настройки
                  OnlyVet. Сейчас используется демонстрационный режим — цифры и
                  данные не являются реальными.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Сводка */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* Отзывы */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-1 text-[13px]">
              <div className="text-[12px] text-slate-500 mb-1">Отзывы</div>
              <div className="text-[24px] font-semibold text-onlyvet-navy leading-none">
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
                className="mt-auto text-[12px] text-onlyvet-coral font-medium hover:underline"
              >
                Перейти к модерации →
              </Link>
            </div>

            {/* Заявки */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-1 text-[13px]">
              <div className="text-[12px] text-slate-500 mb-1">
                Заявки на консультацию
              </div>
              <div className="text-[24px] font-semibold text-onlyvet-navy leading-none">
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
                className="mt-auto text-[12px] text-onlyvet-coral font-medium hover:underline"
              >
                Смотреть заявки →
              </Link>
            </div>

            {/* Сервис / настройки */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-2 text-[13px]">
              <div className="text-[12px] text-slate-500 mb-1">Сервис</div>
              <div className="text-[13px] text-slate-600">
                В дальнейшем здесь можно разместить:
              </div>
              <ul className="text-[12px] text-slate-600 list-disc pl-4 space-y-1">
                <li>настройки расписаний и слотов приёма</li>
                <li>управление карточками врачей и услуг</li>
                <li>служебные заметки и внутренние комментарии</li>
              </ul>
              <p className="text-[11px] text-slate-500 mt-1">
                Сейчас блок носит информационный характер и служит
                напоминанием, какие разделы стоит реализовать в первую очередь.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
