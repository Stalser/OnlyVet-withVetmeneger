import Link from "next/link";

type ConsultationStatus = "new" | "in_progress" | "done";

type MockConsultation = {
  id: string;
  petName: string;
  serviceName: string;
  date: string;
  status: ConsultationStatus;
};

const mockConsultations: MockConsultation[] = [
  {
    id: "c1",
    petName: "Локи",
    serviceName: "Онлайн-консультация терапевта",
    date: "2024-12-01 19:00",
    status: "in_progress",
  },
  {
    id: "c2",
    petName: "Рекс",
    serviceName: "Второе мнение по анализам",
    date: "2024-11-20 14:00",
    status: "done",
  },
  {
    id: "c3",
    petName: "Локи",
    serviceName: "Разбор УЗИ и плана лечения",
    date: "2024-11-10 18:30",
    status: "done",
  },
];

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const map: Record<
    ConsultationStatus,
    { label: string; className: string }
  > = {
    new: {
      label: "Новая заявка",
      className: "bg-sky-50 text-sky-700 border-sky-200",
    },
    in_progress: {
      label: "В работе",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    done: {
      label: "Завершена",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  };

  const cfg = map[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export default function ConsultationsSection({ user }: { user: any }) {
  // пока просто используем мок-данные; позже можно будет подтянуть реальные консультации из Supabase
  const items = mockConsultations;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши консультации
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Ниже — список заявок и консультаций в OnlyVet. В реальной версии
            здесь будут данные из вашей истории обращений и Vetmanager.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
        >
          Новая консультация
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-[12px] text-slate-500">
          У вас пока нет консультаций. Вы можете оставить первую заявку через
          форму записи.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 text-[13px]">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3"
            >
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">
                  {c.serviceName}
                </div>
                <div className="text-slate-600">
                  Питомец: <span className="font-medium">{c.petName}</span>
                </div>
                <div className="text-[12px] text-slate-500">
                  Дата и время: {c.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                <Link
                  href={`/account/consultations/${c.id}`}
                  className="text-[12px] text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
                >
                  Открыть карточку
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
