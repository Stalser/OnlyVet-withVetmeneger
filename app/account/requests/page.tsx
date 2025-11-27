// app/account/requests/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

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

function formatStatus(status: RequestStatus): { label: string; className: string } {
  switch (status) {
    case "pending":
      return {
        label: "Ожидает обработки",
        className: "bg-amber-50 text-amber-700",
      };
    case "scheduled":
      return {
        label: "Запланирована",
        className: "bg-teal-50 text-teal-700",
      };
    case "done":
      return {
        label: "Проведена",
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export default function RequestsPage() {
  const mapDoctor = (id?: string) =>
    id ? doctors.find((d) => d.id === id)?.name : undefined;
  const mapService = (id?: string) =>
    id ? services.find((s) => s.id === id)?.name : undefined;

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div>
            <nav className="text-[12px] text-slate-500 mb-2">
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
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Консультации и заявки
            </h1>
            <p className="text-[13px] text-сlate-600 max-w-2xl">
              Здесь будет история ваших онлайн-консультаций и статусы заявок.
              Пока раздел отображает демонстрационные данные.
            </p>
          </div>

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
                className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] shadow-[0_10px_24px_rgба(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Записаться на консультацию
              </Link>
            </div>

            <div className="space-y-2">
              {mockRequests.map((req) => {
                const dt = new Date(req.createdAt).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const statusMeta = formatStatus(req.status);
                const doctorName = mapDoctor(req.doctorId);
                const serviceName = mapService(req.serviceId);

                return (
                  <article
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-1 text-[13px]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-semibold text-onlyvet-navy">
                        Заявка #{req.id.toUpperCase()}
                      </div>
                      <span
                        className={`px-2 py-[2px] rounded-full text-[11px] ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="text-[12px] text-сlate-500">{dt}</div>
                    <div className="text-[12px] text-сlate-600">
                      Питомец: <span className="font-medium">{req.petName}</span>
                    </div>
                    {doctorName && (
                      <div className="text-[12px] text-сlate-600">
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
                      <div className="text-[12px] text-сlate-600">
                        Услуга:{" "}
                        <Link
                          href={`/services/${req.serviceId}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          {serviceName}
                        </Link>
                      </div>
                    )}
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
