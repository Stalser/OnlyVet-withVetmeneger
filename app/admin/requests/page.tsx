// app/admin/requests/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type RequestStatus = "new" | "in_progress" | "done" | "rejected";

type AdminRequest = {
  id: string;
  createdAt: string;
  clientName: string;
  phone: string;
  petName: string;
  doctorId?: string;
  serviceId?: string;
  status: RequestStatus;
};

const mockAdminRequests: AdminRequest[] = [
  {
    id: "req1",
    createdAt: "2025-02-10T12:00:00+03:00",
    clientName: "Екатерина С.",
    phone: "+7 900 000-00-01",
    petName: "Локи",
    doctorId: "elvin",
    serviceId: "second-opinion",
    status: "new",
  },
  {
    id: "req2",
    createdAt: "2025-02-09T16:30:00+03:00",
    clientName: "Анна К.",
    phone: "+7 900 000-00-02",
    petName: "Рекс",
    doctorId: "diana",
    serviceId: "online-consult",
    status: "in_progress",
  },
  {
    id: "req3",
    createdAt: "2025-02-05T09:10:00+03:00",
    clientName: "Ольга П.",
    phone: "+7 900 000-00-03",
    petName: "Барсик",
    doctorId: "elvin",
    serviceId: "long-term",
    status: "done",
  },
];

function statusMeta(status: RequestStatus) {
  switch (status) {
    case "new":
      return {
        label: "Новая",
        className: "bg-amber-50 text-amber-700",
      };
    case "in_progress":
      return {
        label: "В работе",
        className: "bg-sky-50 text-sky-700",
      };
    case "done":
      return {
        label: "Завершена",
        className: "bg-slate-100 text-slate-700",
      };
    case "rejected":
      return {
        label: "Отклонена",
        className: "bg-rose-50 text-rose-700",
      };
  }
}

export default function AdminRequestsPage() {
  const [requestsState, setRequestsState] =
    useState<AdminRequest[]>(mockAdminRequests);
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");

  const filtered = useMemo(
    () =>
      requestsState.filter((r) =>
        filter === "all" ? true : r.status === filter
      ),
    [requestsState, filter]
  );

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequestsState((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const getDoctorName = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;

  const getServiceName = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

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
              / <span className="text-slate-700">Заявки</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Заявки на консультации
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Интерфейс для обработки заявок на онлайн-консультации. Пока
                  используются демонстрационные данные. В боевой версии здесь
                  будут заявки из формы записи.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-slate-500 mr-1">Статус:</span>
              {[
                { key: "all", label: "Все" },
                { key: "new", label: "Новые" },
                { key: "in_progress", label: "В работе" },
                { key: "done", label: "Завершённые" },
                { key: "rejected", label: "Отклонённые" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setFilter(btn.key as "all" | RequestStatus)}
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
              {filtered.map((req) => {
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
                      <span className="font-medium">{req.clientName}</span>
                    </div>
                    <div className="text-[12px] text-slate-600">
                      Телефон:{" "}
                      <span className="font-medium">{req.phone}</span>
                    </div>
                    <div className="text-[12px] text-slate-600">
                      Питомец:{" "}
                      <span className="font-medium">{req.petName}</span>
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
                      {req.status !== "done" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "done")}
                          className="px-3 py-1.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition"
                        >
                          Отметить как завершённую
                        </button>
                      )}

                      {req.status !== "in_progress" &&
                        req.status !== "done" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(req.id, "in_progress")
                            }
                            className="px-3 py-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition"
                          >
                            В работу
                          </button>
                        )}

                      {req.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "rejected")}
                          className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition"
                        >
                          Отклонить
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-[13px] text-slate-500">
                  По выбранному фильтру нет заявок.
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
