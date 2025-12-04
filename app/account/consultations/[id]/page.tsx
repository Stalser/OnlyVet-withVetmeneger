// app/account/consultations/[id]/page.tsx

import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type ConsultationStatus = "new" | "in_progress" | "done";

type ConsultationDetail = {
  id: string;
  petId: string;
  petName: string;
  serviceName: string;
  date: string;
  status: ConsultationStatus;
  complaint: string;
  doctorName?: string;
  doctorSpec?: string;
  notes: string[];
  files: { id: string; name: string; type: string }[];
};

const mockConsultations: ConsultationDetail[] = [
  {
    id: "c1",
    petId: "pet1",
    petName: "Локи",
    serviceName: "Онлайн-консультация терапевта",
    date: "2024-12-01 19:00",
    status: "in_progress",
    complaint:
      "Периодическая рвота, снижение аппетита, подозрение на гастрит. Нужна оценка анализов и плана лечения.",
    doctorName: "Чемерилова Диана Сергеевна",
    doctorSpec: "Терапевт, гастроэнтерология",
    notes: [
      "Собраны жалобы, предварительно подтверждается хронический гастрит.",
      "Рекомендовано дообследование: контрольный биохимический анализ крови, УЗИ брюшной полости через 7–10 дней.",
      "Скорректирована схема гастропротекторов, договорённость о повторной связи после результатов.",
    ],
    files: [
      { id: "f1", name: "Анализ крови 20.11.2024.pdf", type: "Анализы" },
      { id: "f2", name: "УЗИ брюшной полости 18.11.2024.jpg", type: "УЗИ" },
    ],
  },
  {
    id: "c2",
    petId: "pet2",
    petName: "Рекс",
    serviceName: "Второе мнение по анализам",
    date: "2024-11-20 14:00",
    status: "done",
    complaint:
      "Повышены печёночные показатели по анализам, нужно второе мнение и корректировка терапии.",
    doctorName: "Балмашова Елена Викторовна",
    doctorSpec: "Терапевт, нефро/гепатология",
    notes: [
      "Проведён разбор анализов, озвучены дифференциальные диагнозы.",
      "Дана рекомендация по дообследованию и мягкая корректировка дозировки гепатопротектора.",
    ],
    files: [
      {
        id: "f3",
        name: "Биохимический анализ крови 15.11.2024.pdf",
        type: "Анализы",
      },
    ],
  },
  {
    id: "c3",
    petId: "pet1",
    petName: "Локи",
    serviceName: "Разбор УЗИ и плана лечения",
    date: "2024-11-10 18:30",
    status: "done",
    complaint:
      "Нужно обсудить результаты УЗИ брюшной полости, сопоставить с анализами и скорректировать дальнейший план лечения.",
    doctorName: "Чемерилова Диана Сергеевна",
    doctorSpec: "Терапевт, гастроэнтерология",
    notes: [
      "Проанализированы результаты УЗИ: подтверждены изменения, соответствующие хроническому гастриту и лёгкому гепатиту.",
      "Согласован щадящий план диеты и поддерживающей терапии.",
      "Договорённость о повторной связи через 3–4 недели или при ухудшении состояния.",
    ],
    files: [
      {
        id: "f4",
        name: "УЗИ брюшной полости 05.11.2024.pdf",
        type: "УЗИ",
      },
    ],
  },
];

export default function ConsultationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const consultation = mockConsultations.find((c) => c.id === id);

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/60">
        <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
          {/* Навигация / хлебные крошки */}
          <div className="mb-4 md:mb-5">
            <nav className="text-[11px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Карточка консультации</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Консультация{" "}
              {consultation ? `по питомцу ${consultation.petName}` : ""}
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь собрана ключевая информация по конкретной онлайн-консультации:
              статус, жалоба, врач, прикреплённые файлы и заметки.
            </p>
          </div>

          {!consultation ? (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 text-[13px]">
              <p className="text-slate-700">
                Консультация с указанным идентификатором не найдена.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                <Link
                  href="/account"
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  Вернуться в личный кабинет
                </Link>
                <Link
                  href="/booking"
                  className="px-3.5 py-1.5 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                >
                  Новая консультация
                </Link>
              </div>
            </section>
          ) : (
            <section className="space-y-4 md:space-y-5">
              {/* Основной блок */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <h2 className="text-[15px] md:text-[16px] font-semibold">
                      {consultation.serviceName}
                    </h2>
                    <div className="text-[13px] text-slate-700">
                      Питомец:{" "}
                      <Link
                        href={`/account/pets/${consultation.petId}`}
                        className="font-medium text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
                      >
                        {consultation.petName}
                      </Link>
                    </div>
                    <div className="text-[12px] text-slate-500">
                      Дата и время: {consultation.date}
                    </div>
                    {consultation.doctorName && (
                      <div className="text-[12px] text-slate-600">
                        Врач:{" "}
                        <span className="font-medium">
                          {consultation.doctorName}
                        </span>
                        {consultation.doctorSpec && (
                          <> · {consultation.doctorSpec}</>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <StatusBadge status={consultation.status} />
                    <div className="flex flex-wrap gap-2 text-[12px]">
                      <Link
                        href="/account"
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                      >
                        В кабинет
                      </Link>
                      <Link
                        href="/booking"
                        className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                      >
                        Новая консультация
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Жалоба */}
                <div className="mt-3">
                  <h3 className="text-[14px] font-semibold mb-1.5">
                    Жалоба / причина обращения
                  </h3>
                  <p className="text-[13px] text-slate-700">
                    {consultation.complaint}
                  </p>
                </div>
              </div>

              {/* Заметки врача и динамика */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
                <h3 className="text-[14px] font-semibold mb-2">
                  Заметки и ход консультации
                </h3>
                {consultation.notes.length === 0 ? (
                  <p className="text-[12px] text-slate-500">
                    В этой демонстрационной версии ещё нет сохранённых заметок.
                    В реальной системе здесь будет отображаться ход консультации
                    и ключевые решения врача.
                  </p>
                ) : (
                  <ol className="text-[13px] text-slate-700 space-y-1.5 list-decimal list-inside">
                    {consultation.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Файлы */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="text-[14px] font-semibold">
                    Прикреплённые документы и файлы
                  </h3>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                  >
                    Загрузить файлы
                  </button>
                </div>
                {consultation.files.length === 0 ? (
                  <p className="text-[12px] text-slate-500">
                    Пока нет прикреплённых файлов. В реальной версии здесь будут ваши
                    анализы, УЗИ, выписки и другие документы, связанные с консультацией.
                  </p>
                ) : (
                  <ul className="text-[13px] text-slate-700 space-y-1.5">
                    {consultation.files.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-onlyvet-bg px-3 py-2"
                      >
                        <div>
                          <div className="font-medium">{f.name}</div>
                          <div className="text-[12px] text-slate-500">
                            Тип: {f.type}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-[12px] text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
                        >
                          Скачать
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const map: Record<ConsultationStatus, { label: string; className: string }> =
    {
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
