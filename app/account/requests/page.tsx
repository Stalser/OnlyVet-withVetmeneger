// app/account/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import type { BookingRequest, BookingStatus } from "@/lib/types";
import {
  ConsultationCard,
  type ConsultationStatus,
  type ConsultationCardProps,
} from "@/components/ConsultationCard";

// маппим статус заявки -> статус консультации для карточки
function mapBookingStatusToConsultationStatus(
  status: BookingStatus
): ConsultationStatus {
  switch (status) {
    case "pending":
      return "pending";
    case "in_review":
      return "in_review";
    case "approved":
      // заявка подтверждена / консультация запланирована
      return "scheduled";
    case "rejected":
      return "cancelled";
    default:
      return "pending";
  }
}

export default function RequestsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/booking", { cache: "no-store" });
      if (!res.ok) throw new Error("Не удалось получить заявки");

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка загрузки заявок");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // пока нет auth — показываем все заявки (демо)
  const hasAny = bookings.length > 0;

  const active = bookings.filter(
    (b) =>
      b.status === "pending" ||
      b.status === "in_review" ||
      b.status === "approved"
  );
  const rejected = bookings.filter((b) => b.status === "rejected");

  const getDoctorName = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;

  const getServiceName = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

  const mapBookingToCard = (b: BookingRequest): ConsultationCardProps => {
    const doctorName = getDoctorName(b.doctorId);
    const serviceName = getServiceName(b.serviceId);

    // в демо у нас нет отдельного поля "назначенное время" — пока не подставляем
    const dateTime = undefined;

    return {
      id: b.id,
      createdAt: b.createdAt,
      petName: b.petName || "Питомец",
      serviceName,
      doctorName,
      doctorId: b.doctorId,
      dateTime,
      status: mapBookingStatusToConsultationStatus(b.status),
      cancelReason: b.cancelReason,
      showPetLink: false,
    };
  };

  const handleCancel = async (booking: BookingRequest) => {
    if (cancellingId) return;

    const baseLabel =
      booking.status === "approved"
        ? "консультацию"
        : "заявку";

    const ok = window.confirm(
      `Вы уверены, что хотите отменить ${baseLabel}?`
    );
    if (!ok) return;

    const reason = window.prompt(
      "Если хотите, укажите причину отмены (необязательно):",
      ""
    );

    try {
      setCancellingId(booking.id);

      const res = await fetch(`/api/booking/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected" as BookingStatus,
          cancelReason: reason?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || "Не удалось отменить заявку. Попробуйте позже."
        );
      }

      await fetchBookings();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Ошибка при отмене заявки.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Консультации и заявки</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Консультации и заявки
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь будут отображаться ваши онлайн-заявки и их статусы.
                  Сейчас используется демонстрационный режим — заявки не
                  привязаны к конкретному аккаунту.
                </p>
              </div>
              <AccountNav />
            </div>
          </div>

          {/* Заголовок + кнопка */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[13px] text-slate-600">
                Всего заявок:{" "}
                <span className="font-medium text-onlyvet-navy">
                  {bookings.length}
                </span>
              </div>
              <Link
                href="/booking"
                className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] shadow-[0_10px_24px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Записаться на консультацию
              </Link>
            </div>

            {loading && (
              <div className="text-[13px] text-slate-500">Загрузка заявок…</div>
            )}
            {error && (
              <div className="text-[13px] text-rose-600">{error}</div>
            )}

            {!loading && !error && !hasAny && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-center space-y-3">
                <div className="text-[14px] font-semibold text-slate-700">
                  У вас пока нет заявок
                </div>
                <p className="text-[12px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Как только вы оформите заявку на консультацию, здесь появится
                  информация о статусе и истории онлайн-приёмов.
                </p>
                <Link
                  href="/booking"
                  className="inline-flex justify-center px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            )}

            {!loading && !error && hasAny && (
              <div className="space-y-5">
                {/* Активные */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800">
                      Активные заявки
                    </h2>
                    <span className="text-[12px] text-slate-500">
                      {active.length > 0
                        ? `Сейчас в работе: ${active.length}`
                        : "Нет активных заявок"}
                    </span>
                  </div>

                  {active.length === 0 ? (
                    <div className="text-[12px] text-slate-500 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-2">
                      Активных заявок сейчас нет. Новые запросы появятся здесь
                      сразу после оформления.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {active.map((b) => (
                        <ConsultationCard
                          key={b.id}
                          {...mapBookingToCard(b)}
                          onCancel={
                            cancellingId === b.id
                              ? undefined
                              : () => handleCancel(b)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Отменённые / отклонённые */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800">
                      Отменённые / отклонённые заявки
                    </h2>
                  <span className="text-[12px] text-slate-500">
                      {rejected.length > 0
                        ? `Всего: ${rejected.length}`
                        : "Пока нет отменённых заявок"}
                    </span>
                  </div>

                  {rejected.length === 0 ? (
                    <div className="text-[12px] text-slate-500 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-2">
                      Если какая-то заявка будет отменена или отклонена, она
                      появится здесь.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {rejected.map((b) => (
                        <ConsultationCard
                          key={b.id}
                          {...mapBookingToCard(b)}
                          // можно позже добавить onBookAgain -> /booking?serviceId...
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
