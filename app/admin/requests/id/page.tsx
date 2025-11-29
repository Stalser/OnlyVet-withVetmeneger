// app/admin/requests/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import type { BookingRequest } from "@/lib/types";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type PageProps = {
  params: { id: string };
};

function statusMeta(status: BookingRequest["status"]) {
  switch (status) {
    case "pending":
      return { label: "Новая", className: "bg-amber-50 text-amber-700" };
    case "in_review":
      return { label: "В работе", className: "bg-sky-50 text-sky-700" };
    case "approved":
      return { label: "Подтверждена", className: "bg-teal-50 text-teal-700" };
    case "rejected":
      return { label: "Отклонена", className: "bg-rose-50 text-rose-700" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-700" };
  }
}

export default function AdminRequestDetailPage({ params }: PageProps) {
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/booking/${params.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Не удалось загрузить заявку");
        }

        const data = await res.json();
        setBooking(data.booking);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Ошибка загрузки заявки");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  const doctorName = booking?.doctorId
    ? doctors.find((d) => d.id === booking.doctorId)?.name
    : undefined;

  const serviceName = booking?.serviceId
    ? services.find((s) => s.id === booking.serviceId)?.name
    : undefined;

  const createdLabel =
    booking &&
    new Date(booking.createdAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Заголовок / хлебные */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              /{" "}
              <Link href="/admin/requests" className="hover:text-onlyvet-coral">
                Заявки
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">
                Заявка #{params.id.toUpperCase()}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Заявка #{params.id.toUpperCase()}
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Подробный бланк заявки: контакты владельца, данные о
                  питомце, услуге и враче. Далее сюда можно будет добавить
                  связи с Vetmanager.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Контент */}
          {loading && (
            <div className="text-[13px] text-slate-500">Загрузка заявки…</div>
          )}

          {error && (
            <div className="text-[13px] text-rose-600">{error}</div>
          )}

          {!loading && !error && !booking && (
            <div className="text-[13px] text-slate-500">
              Заявка не найдена. Возможно, она была удалена.
            </div>
          )}

          {booking && (
            <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr] items-start">
              {/* Левая колонка — основные данные */}
              <section className="space-y-4">
                {/* Клиент */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[14px] font-semibold text-slate-800">
                      Владелец
                    </div>
                    <span
                      className={`px-2 py-[2px] rounded-full text-[11px] ${
                        statusMeta(booking.status).className
                      }`}
                    >
                      {statusMeta(booking.status).label}
                    </span>
                  </div>

                  {createdLabel && (
                    <div className="text-[12px] text-slate-500">
                      Заявка создана: {createdLabel}
                    </div>
                  )}

                  <div className="text-[13px] text-slate-700 space-y-1">
                    <p>
                      <span className="text-slate-500">ФИО: </span>
                      <span className="font-medium">
                        {booking.fullName || "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-500">Телефон: </span>
                      <span className="font-medium">{booking.phone}</span>
                    </p>
                    {booking.email && (
                      <p>
                        <span className="text-slate-500">Email: </span>
                        <span className="font-medium">{booking.email}</span>
                      </p>
                    )}
                    {booking.telegram && (
                      <p>
                        <span className="text-slate-500">Telegram: </span>
                        <span className="font-medium">
                          {booking.telegram}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Питомец */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-2">
                  <div className="text-[14px] font-semibold text-slate-800 mb-1">
                    Питомец
                  </div>
                  <div className="text-[13px] text-slate-700 space-y-1">
                    <p>
                      <span className="text-slate-500">Режим: </span>
                      {booking.petMode === "existing"
                        ? "существующий питомец (из личного кабинета)"
                        : "новый питомец"}
                    </p>
                    {booking.petName && (
                      <p>
                        <span className="text-slate-500">Кличка: </span>
                        <span className="font-medium">{booking.petName}</span>
                      </p>
                    )}
                    {booking.petSpecies && (
                      <p>
                        <span className="text-slate-500">Вид: </span>
                        {booking.petSpecies}
                      </p>
                    )}
                    {booking.petNotes && (
                      <p>
                        <span className="text-slate-500">
                          Дополнительно:
                        </span>{" "}
                        {booking.petNotes}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Позже здесь можно будет отобразить карточку питомца из
                    Vetmanager или локальной БД.
                  </p>
                </div>
              </section>

              {/* Правая колонка — услуга, врач, время */}
              <section className="space-y-4">
                {/* Услуга и врач */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-2">
                  <div className="text-[14px] font-semibold text-slate-800 mb-1">
                    Услуга и врач
                  </div>

                  <div className="text-[13px] text-slate-700 space-y-1">
                    <p>
                      <span className="text-slate-500">Услуга: </span>
                      {serviceName ? (
                        <Link
                          href={`/services/${booking.serviceId}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          {serviceName}
                        </Link>
                      ) : (
                        "Не выбрана (нужна помощь с выбором)"
                      )}
                    </p>

                    <p>
                      <span className="text-slate-500">Врач: </span>
                      {booking.doctorId && doctorName ? (
                        <Link
                          href={`/doctors/${booking.doctorId}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          {doctorName}
                        </Link>
                      ) : (
                        "Автоматический подбор / регистратор выбирает"
                      )}
                    </p>
                  </div>
                </div>

                {/* Дата и время */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-2">
                  <div className="text-[14px] font-semibold text-slate-800 mb-1">
                    Дата и время
                  </div>
                  <div className="text-[13px] text-slate-700 space-y-1">
                    <p>
                      <span className="text-slate-500">Режим: </span>
                      {booking.timeMode === "choose"
                        ? "клиент предложил дату и время"
                        : "любое ближайшее (подбор администратором)"}
                    </p>
                    {booking.preferredDate && (
                      <p>
                        <span className="text-slate-500">
                          Предпочтительная дата:{" "}
                        </span>
                        {booking.preferredDate}
                      </p>
                    )}
                    {booking.preferredTime && (
                      <p>
                        <span className="text-slate-500">
                          Предпочтительное время:{" "}
                        </span>
                        {booking.preferredTime}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    В дальнейшем здесь можно будет отображать фактический слот
                    из Vetmanager и ссылку на приём.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
