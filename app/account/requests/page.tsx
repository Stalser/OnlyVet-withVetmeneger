// app/account/requests/page.tsx

"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import {
  ConsultationCard,
  type ConsultationStatus,
} from "@/components/ConsultationCard";

type RequestStatus = "pending" | "scheduled" | "done";

type Request = {
  id: string;
  createdAt: string;
  petName: string;
  doctorId?: string;
  serviceId?: string;
  status: RequestStatus;
};

const mockRequests: Request[] = [
  {
    id: "req1",
    createdAt: "2025-01-15T12:00:00+03:00",
    petName: "Локи",
    doctorId: "elvin",
    serviceId: "second-opinion",
    status: "done",
  },
  {
    id: "req2",
    createdAt: "2025-02-01T15:30:00+03:00",
    petName: "Рекс",
    doctorId: "diana",
    serviceId: "online-consult",
    status: "scheduled",
  },
  {
    id: "req3",
    createdAt: "2025-02-05T09:10:00+03:00",
    petName: "Рекс",
    status: "pending",
  },
];

function mapStatus(status: RequestStatus): ConsultationStatus {
  // пока прямое соответствие, позже можно добавить "in_review"/"cancelled"
  if (status === "pending") return "pending";
  if (status === "scheduled") return "scheduled";
  return "done";
}

export default function RequestsPage() {
  const getDoctorName = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;

  const getServiceName = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

  const active = mockRequests.filter(
    (r) => r.status === "pending" || r.status === "scheduled"
  );
  const done = mockRequests.filter((r) => r.status === "done");

  const hasAny = mockRequests.length > 0;

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
                  История онлайн-консультаций и статусы заявок. Сейчас
                  отображаются демонстрационные данные.
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
                  {mockRequests.length}
                </span>
              </div>
              <Link
                href="/booking"
                className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] shadow-[0_10px_24px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Записаться на консультацию
              </Link>
            </div>

            {/* Если заявок нет */}
            {!hasAny && (
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

            {hasAny && (
              <div className="space-y-5">
                {/* Активные */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800">
                      Активные заявки и консультации
                    </h2>
                    <span className="text-[12px] text-slate-500">
                      {active.length > 0
                        ? `Сейчас в работе: ${active.length}`
                        : "Нет активных заявок"}
                    </span>
                  </div>

                  {active.length === 0 ? (
                    <div className="text-[12px] text-slate-500 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-2">
                      Активных заявок сейчас нет. Новые запросы на консультацию
                      появятся здесь сразу после оформления.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {active.map((req) => {
                        const doctorName = getDoctorName(req.doctorId);
                        const serviceName = getServiceName(req.serviceId);

                        return (
                          <ConsultationCard
                            key={req.id}
                            id={req.id}
                            createdAt={req.createdAt}
                            petName={req.petName}
                            doctorName={doctorName}
                            doctorId={req.doctorId}
                            serviceName={serviceName}
                            // пока нет отдельного поля для даты консультации — используем createdAt
                            dateTime={req.createdAt}
                            status={mapStatus(req.status)}
                            showPetLink={false}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Завершённые */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-800">
                      Завершённые консультации
                    </h2>
                    <span className="text-[12px] text-slate-500">
                      {done.length > 0
                        ? `Всего завершено: ${done.length}`
                        : "Пока нет завершённых консультаций"}
                    </span>
                  </div>

                  {done.length === 0 ? (
                    <div className="text-[12px] text-slate-500 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-2">
                      После проведения консультаций они будут отображаться
                      здесь.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {done.map((req) => {
                        const doctorName = getDoctorName(req.doctorId);
                        const serviceName = getServiceName(req.serviceId);

                        return (
                          <ConsultationCard
                            key={req.id}
                            id={req.id}
                            createdAt={req.createdAt}
                            petName={req.petName}
                            doctorName={doctorName}
                            doctorId={req.doctorId}
                            serviceName={serviceName}
                            dateTime={req.createdAt}
                            status={mapStatus(req.status)}
                            showPetLink={false}
                          />
                        );
                      })}
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
