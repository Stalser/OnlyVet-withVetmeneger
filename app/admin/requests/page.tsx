// app/admin/requests/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import type { BookingRequest, BookingStatus } from "@/lib/types";

type FilterStatus = "all" | BookingStatus;

function statusMeta(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Новая",
        className: "bg-amber-50 text-amber-700",
      };
    case "in_review":
      return {
        label: "В работе",
        className: "bg-sky-50 text-sky-700",
      };
    case "approved":
      return {
        label: "Подтверждена",
        className: "bg-teal-50 text-teal-700",
      };
    case "rejected":
      return {
        label: "Отклонена",
        className: "bg-rose-50 text-rose-700",
      };
  }
}

export default function AdminRequestsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/booking", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Не удалось получить заявки");
      }

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка загрузки заявок");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(
    () =>
      bookings.filter((b) =>
        filter === "all" ? true : b.status === filter
      ),
    [bookings, filter]
  );

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      setIsUpdating(id);
      const res = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error("Не удалось обновить статус заявки");
      }
      const data = await res.json();
      const updated = data.booking as BookingRequest;

      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    } catch (err: any) {
      console.error(err);
      // Можно добавить уведомление
    } finally {
      setIsUpdating(null);
    }
  };

  const getDoctorName = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;

  const getServiceName = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

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
              / <span className="text-slate-700">Заявки</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Заявки на консультации
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Интерфейс для обработки заявок на онлайн-консультации.
                  Сейчас используется временное хранилище в памяти — после
                  перезапуска деплоя заявки обнуляются.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-slate-500 mr-1">Статус:</span>
              {(
                [
                  { key: "all", label: "Все" },
                  { key: "pending", label: "Новые" },
                  { key: "in_review", label: "В работе" },
                  { key: "approved", label: "Подтверждённые" },
                  { key: "rejected", label: "Отклонённые" },
                ] as { key: FilterStatus; label: string }[]
              ).map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setFilter(btn.key)}
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

            {/* Список заявок */}
            <div className="space-y-2">
              {isLoading && (
                <div className="text-[13px] text-slate-500">
                  Загрузка заявок...
                </div>
              )}

              {error && (
                <div className="text-[13px] text-rose-600">{error}</div>
              )}

              {!isLoading && !error && filtered.length === 0 && (
                <div className="text-[13px] text-slate-500">
                  По выбранному фильтру нет заявок.
                </div>
              )}

              {!isLoading &&
                !error &&
                filtered.map((req) => {
                  const dt = new Date(req.createdAt).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const meta = statusMeta(req.status);
                  const doctorName = getDoctorName(req.doctorId);
                  const serviceName = getServiceName(req.serviceId);

                  return (
                    <article
                      key={req.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-1 text-[13px]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-onlyvet-navy">
                          Заявка #{req.id.toUpperCase()}
                        </div>
                        <span
                          className={`px-2 py-[2px] rounded-full text-[11px] ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      <div className="text-[12px] text-slate-500">{dt}</div>
                      <div className="text-[12px] text-slate-600">
                        Клиент:{" "}
                        <span className="font-medium">{req.fullName}</span>
                      </div>
                      <div className="text-[12px] text-slate-600">
                        Телефон:{" "}
                        <span className="font-medium">{req.phone}</span>
                      </div>
                      <div className="text-[12px] text-slate-600">
                        Питомец:{" "}
                        <span className="font-medium">{req.petName || "—"}</span>
                      </div>
                      {doctorName && (
                        <div className="text-[12px] text-slate-600">
                          Врач:{" "}
                          <Link
                            href={`/doctors/${req.doctorId}`}
                            className="text-onlyvet-coral hover:underline"
                          >
                            {doctorName}
                          </Link>
                        </div>
                      )}
                      {serviceName && (
                        <div className="text-[12px] text-slate-600">
                          Услуга:{" "}
                          <Link
                            href={`/services/${req.serviceId}`}
                            className="text-onlyvet-coral hover:underline"
                          >
                            {serviceName}
                          </Link>
                        </div>
                      )}

                      {/* Кнопки управления статусом */}
                      <div className="flex flex-wrap gap-2 mt-2 text-[12px]">
                        {req.status !== "in_review" &&
                          req.status !== "approved" &&
                          req.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={isUpdating === req.id}
                              onClick={() => updateStatus(req.id, "in_review")}
                              className="px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-60"
                            >
                              В работу
                            </button>
                          )}

                        {req.status !== "approved" &&
                          req.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={isUpdating === req.id}
                              onClick={() => updateStatus(req.id, "approved")}
                              className="px-3 py-1.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-60"
                            >
                              Подтвердить
                            </button>
                          )}

                        {req.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={isUpdating === req.id}
                            onClick={() => updateStatus(req.id, "rejected")}
                            className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-60"
                          >
                            Отклонить
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
