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

type StatusFilter = "all" | BookingStatus;

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
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export default function AdminRequestsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/booking", { cache: "no-store" });
        if (!res.ok) throw new Error("Не удалось загрузить заявки");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Ошибка загрузки заявок");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const {
    total,
    byStatus,
    filtered,
  }: {
    total: number;
    byStatus: Record<BookingStatus, number>;
    filtered: BookingRequest[];
  } = useMemo(() => {
    const byStatus: Record<BookingStatus, number> = {
      pending: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
    };

    for (const b of bookings) {
      byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
    }

    let list = [...bookings];
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }

    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da; // новые выше
    });

    return {
      total: bookings.length,
      byStatus,
      filtered: list,
    };
  }, [bookings, statusFilter]);

  const getDoctorName = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;

  const getServiceName = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

  const formatCreatedAt = (iso: string) =>
    new Date(iso).toLocaleString("ru-RU", {
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
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              / <span className="text-slate-700">Заявки на консультацию</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Заявки, оставленные через сайт
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь отображаются заявки, отправленные через форму записи на
                  сайте. В боевом режиме эти данные будут синхронизироваться с
                  Vetmanager, но уже сейчас можно использовать их как рабочий
                  журнал для обработки обращений.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Статистика */}
          <section className="grid gap-3 md:grid-cols-4 text-[13px]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Всего заявок</div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {total}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Новые</div>
              <div className="text-[22px] font-semibold text-amber-700">
                {byStatus.pending}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">В работе</div>
              <div className="text-[22px] font-semibold text-sky-700">
                {byStatus.in_review}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Подтверждены / отклонены
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {byStatus.approved + byStatus.rejected}
              </div>
            </div>
          </section>

          {/* Фильтр по статусу */}
          <section className="space-y-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Статус:</span>
              {([
                { key: "all", label: "Все" },
                { key: "pending", label: "Новые" },
                { key: "in_review", label: "В работе" },
                { key: "approved", label: "Подтверждённые" },
                { key: "rejected", label: "Отклонённые" },
              ] as { key: StatusFilter; label: string }[]).map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setStatusFilter(btn.key)}
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
          </section>

          {/* Список заявок */}
          <section className="space-y-3">
            {loading && (
              <div className="text-[13px] text-slate-500">
                Загрузка заявок…
              </div>
            )}
            {error && (
              <div className="text-[13px] text-rose-600">{error}</div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-[13px] text-slate-500">
                По выбранному фильтру заявок пока нет.
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="space-y-2">
                {filtered.map((req) => {
                  const meta = statusMeta(req.status);
                  const doctorName = getDoctorName(req.doctorId);
                  const serviceName = getServiceName(req.serviceId);

                  return (
                    <article
                      key={req.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-1 text-[13px]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-onlyvet-navy">
                          Заявка{" "}
                          <Link
                            href={`/admin/requests/${req.id}`}
                            className="hover:underline"
                          >
                            #{req.id}
                          </Link>
                        </div>
                        <span
                          className={`px-2 py-[2px] rounded-full text-[11px] ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      <div className="text-[12px] text-slate-500">
                        {formatCreatedAt(req.createdAt)}
                      </div>

                      <div className="text-[12px] text-slate-600">
                        Клиент:{" "}
                        <span className="font-medium">
                          {req.fullName || "—"}
                        </span>{" "}
                        · Телефон:{" "}
                        <span className="font-medium">{req.phone}</span>
                      </div>

                      {req.petMode === "existing" && (
                        <div className="text-[12px] text-slate-600">
                          Питомец:{" "}
                          <span className="font-medium">
                            (существующий в ЛК)
                          </span>
                        </div>
                      )}
                      {req.petMode === "new" && req.petName && (
                        <div className="text-[12px] text-slate-600">
                          Питомец:{" "}
                          <span className="font-medium">{req.petName}</span>
                        </div>
                      )}

                      <div className="text-[12px] text-slate-600 flex flex-wrap gap-2">
                        {serviceName && (
                          <span>
                            Услуга:{" "}
                            <Link
                              href={`/services/${req.serviceId}`}
                              className="text-onlyvet-coral hover:underline"
                            >
                              {serviceName}
                            </Link>
                          </span>
                        )}
                        {doctorName && (
                          <span>
                            Врач:{" "}
                            <Link
                              href={`/doctors/${req.doctorId}`}
                              className="text-onlyvet-coral hover:underline"
                            >
                              {doctorName}
                            </Link>
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                        >
                          Открыть карточку заявки
                        </Link>
                        <Link
                          href={`/booking?doctorId=${req.doctorId ?? ""}&serviceId=${req.serviceId ?? ""}`}
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                        >
                          Открыть форму записи с этими параметрами
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Пояснение про mock-состояние */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Текущее состояние интеграции
            </div>
            <p>
              Сейчас заявки хранятся во временном in-memory хранилище на сервере
              (аналогично <code>mockBookings</code>). Это значит, что при
              перезапуске деплоя данные могут сбрасываться. Архитектура
              страницы уже рассчитана на подключение постоянной базы данных
              и/или Vetmanager.
            </p>
            <p>
              В дальнейшем здесь можно будет:
              <br />— изменять статус заявки (новая / в работе / подтверждена /
              отклонена);<br />— привязывать заявку к клиенту и питомцу из
              Vetmanager;<br />— автоматически создавать приём в расписании
              врача.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
