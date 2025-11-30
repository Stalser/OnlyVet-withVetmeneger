// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { reviews } from "@/data/reviews";

type UserRole = "guest" | "user" | "admin";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("guest");
  const [loaded, setLoaded] = useState(false);

  // читаем роль из localStorage на клиенте
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedRole = localStorage.getItem("onlyvet_role");
    if (storedRole === "admin") {
      setRole("admin");
    } else if (storedRole === "user") {
      setRole("user");
    } else {
      setRole("guest");
    }
    setLoaded(true);
  }, []);

  // пока не знаем роль — просто не дёргаем глаза
  if (!loaded) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4 text-[13px] text-slate-500">
            Загрузка…
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // если не админ — мягкая заглушка
  if (role !== "admin") {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-3 text-[13px] text-slate-700">
              <h1 className="text-[16px] font-semibold">
                Доступ только для администратора
              </h1>
              <p>
                Этот раздел предназначен для сотрудников, которые обрабатывают
                заявки, отзывы и настраивают сервис. Если вы являетесь
                администратором, войдите в систему под своей учётной записью.
              </p>
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="
                  w-full mt-1 px-4 py-2.5 rounded-full 
                  bg-onlyvet-coral text-white text-[13px] font-medium 
                  shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                  hover:brightness-105 transition
                "
              >
                Войти как администратор
              </button>
              <p className="text-[11px] text-slate-500">
                После подключения полноценной авторизации и ролей эта страница
                будет защищена на уровне сервера. Сейчас ограничение реализовано
                только на стороне интерфейса.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // === обычный админ-дашборд, как у тебя был ===

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
              <div className="text-[12px] text-slate-500">Отзывы</div>
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
              <div className="text-[12px] text-slate-500">Сервис</div>
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
