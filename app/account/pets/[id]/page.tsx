// app/account/pets/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

type PetRecord = {
  id: string;
  name: string;
  kind: string;
  age: string;
  sex?: string;
  color?: string;
  notes?: string;
};

type PetVisit = {
  id: string;
  date: string;
  doctor: string;
  summary: string;
  status: "done" | "scheduled";
};

type PetDocument = {
  id: string;
  category: "analyzes" | "imaging" | "discharge" | "other";
  title: string;
  date: string;
  description?: string;
};

// Демонстрационные данные — потом будут приходить из БД/Vetmanager.
const demoPets: PetRecord[] = [
  {
    id: "pet1",
    name: "Локи",
    kind: "Кошка, шотландская",
    age: "2 года",
    sex: "самка",
    color: "голубой",
    notes: "Хронический гастрит, эпизодические рвоты, на лечебной диете.",
  },
  {
    id: "pet2",
    name: "Рекс",
    kind: "Собака, метис",
    age: "6 лет",
    sex: "самец",
    color: "чёрно-рыжий",
    notes:
      "Перенесён острый панкреатит, требуется контроль диеты, веса и анализов крови.",
  },
];

const demoVisits: Record<string, PetVisit[]> = {
  pet1: [
    {
      id: "v1",
      date: "2025-01-10",
      doctor: "Эльвин Мазагирович",
      summary: "Обострение гастрита, коррекция диеты, назначение терапии.",
      status: "done",
    },
    {
      id: "v2",
      date: "2025-02-05",
      doctor: "Диана Чемерилова",
      summary: "Плановый контроль, динамика положительная.",
      status: "done",
    },
  ],
  pet2: [
    {
      id: "v3",
      date: "2024-12-20",
      doctor: "Диана Чемерилова",
      summary: "После панкреатита, подбор поддерживающей схемы.",
      status: "done",
    },
  ],
};

const demoDocs: Record<string, PetDocument[]> = {
  pet1: [
    {
      id: "d1",
      category: "analyzes",
      title: "Биохимический анализ крови",
      date: "2025-01-09",
      description: "Повышены ALT/AST, лёгкая гипопротеинемия.",
    },
    {
      id: "d2",
      category: "imaging",
      title: "УЗИ брюшной полости",
      date: "2025-01-09",
      description: "Признаки гастрита, другие органы без особенностей.",
    },
    {
      id: "d3",
      category: "discharge",
      title: "Выписка по итогам консультации",
      date: "2025-01-10",
    },
  ],
  pet2: [
    {
      id: "d4",
      category: "analyzes",
      title: "Биохимический анализ крови",
      date: "2024-12-19",
      description: "Амилаза/липаза в верхней границе нормы.",
    },
    {
      id: "d5",
      category: "discharge",
      title: "Выписка после панкреатита",
      date: "2024-12-20",
    },
  ],
};

function getPetById(id: string): PetRecord | undefined {
  return demoPets.find((p) => p.id === id);
}

export default function PetPage({ params }: { params: { id: string } }) {
  const pet = getPetById(params.id);
  if (!pet) {
    notFound();
  }

  const visits = demoVisits[pet.id] || [];
  const docs = demoDocs[pet.id] || [];

  const analyzes = docs.filter((d) => d.category === "analyzes");
  const imaging = docs.filter((d) => d.category === "imaging");
  const discharge = docs.filter((d) => d.category === "discharge");
  const other = docs.filter((d) => d.category === "other");

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/account" className="hover:text-onlyvet-coral">
              Личный кабинет
            </Link>{" "}
            /{" "}
            <Link href="/account/pets" className="hover:text-onlyvet-coral">
              Питомцы
            </Link>{" "}
            / <span className="text-slate-700">{pet.name}</span>
          </nav>

          {/* Шапка карточки питомца */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-onlyvet-teal/10 flex items-center justify-center text-onlyvet-navy text-xl font-semibold">
                {pet.name[0]}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  {pet.name}
                </h1>
                <div className="text-[13px] text-slate-600">
                  {pet.kind} · {pet.age}
                  {pet.sex && ` · ${pet.sex}`}
                  {pet.color && ` · окрас: ${pet.color}`}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-[12px]">
              <Link
                href={`/booking?petId=${pet.id}`}
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition text-center"
              >
                Записаться с этим питомцем
              </Link>
              <Link
                href="/account/requests"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
              >
                История консультаций
              </Link>
            </div>
          </section>

          {/* Основные блоки: информация + медкарта */}
          <section className="grid gap-4 md:grid-cols-[1.4fr,1fr] items-start">
            {/* Краткая информация о питомце */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
                <h2 className="text-[15px] font-semibold mb-2">
                  Краткая информация
                </h2>
                <div className="space-y-1 text-[13px] text-slate-700">
                  <p>
                    <span className="text-slate-500">Вид и порода: </span>
                    {pet.kind}
                  </p>
                  <p>
                    <span className="text-slate-500">Возраст: </span>
                    {pet.age}
                  </p>
                  {pet.sex && (
                    <p>
                      <span className="text-slate-500">Пол: </span>
                      {pet.sex}
                    </p>
                  )}
                  {pet.color && (
                    <p>
                      <span className="text-slate-500">Окрас: </span>
                      {pet.color}
                    </p>
                  )}
                  {pet.notes && (
                    <p className="mt-2">
                      <span className="text-slate-500">
                        Особенности здоровья:{" "}
                      </span>
                      {pet.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
                <h2 className="text-[15px] font-semibold mb-2">
                  Медицинская карта (демо)
                </h2>
                {visits.length === 0 ? (
                  <p className="text-[13px] text-slate-600">
                    Записей пока нет. После проведения консультаций здесь будут
                    отображаться краткие резюме приёмов.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {visits.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-2xl border border-slate-200 bg-onlyvet-bg px-3 py-2 text-[12px]"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-800">
                            {new Date(v.date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            className={
                              v.status === "done"
                                ? "px-2 py-[2px] rounded-full bg-teal-50 text-teal-700"
                                : "px-2 py-[2px] rounded-full bg-amber-50 text-amber-700"
                            }
                          >
                            {v.status === "done"
                              ? "Проведена"
                              : "Запланирована"}
                          </span>
                        </div>
                        <div className="text-slate-600 mb-1">
                          Врач: {v.doctor}
                        </div>
                        <div className="text-slate-700">{v.summary}</div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-slate-500">
                  В боевой версии данные медкарты будут подтягиваться из
                  Vetmanager и синхронизироваться с онлайн-консультациями.
                </p>
              </div>
            </div>

            {/* Документы питомца */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
                <h3 className="text-[15px] font-semibold mb-2">
                  Документы питомца
                </h3>
                <p className="text-[12px] text-slate-600 mb-2">
                  Здесь сгруппированы документы по основным категориям: анализы,
                  результаты исследований, выписки и прочее.
                </p>

                <div className="space-y-2 text-[12px] text-slate-700">
                  <DocCategoryBlock
                    title="Анализы"
                    docs={analyzes}
                    emptyText="Анализы пока не добавлены."
                  />
                  <DocCategoryBlock
                    title="Исследования (УЗИ, рентген и т.д.)"
                    docs={imaging}
                    emptyText="Исследования пока не добавлены."
                  />
                  <DocCategoryBlock
                    title="Выписки и заключения"
                    docs={discharge}
                    emptyText="Выписки пока не добавлены."
                  />
                  <DocCategoryBlock
                    title="Прочие документы"
                    docs={other}
                    emptyText="Прочие документы пока не добавлены."
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  В будущем сюда можно будет загружать файлы напрямую из
                  личного кабинета и из Vetmanager.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DocCategoryBlock({
  title,
  docs,
  emptyText,
}: {
  title: string;
  docs: PetDocument[];
  emptyText: string;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl bg-onlyvet-bg px-3 py-2">
      <div className="text-[12px] font-semibold text-slate-800 mb-1">
        {title}
      </div>
      {docs.length === 0 ? (
        <div className="text-[11px] text-slate-500">{emptyText}</div>
      ) : (
        <ul className="space-y-1">
          {docs.map((d) => (
            <li key={d.id} className="flex justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium">{d.title}</div>
                {d.description && (
                  <div className="text-[11px] text-slate-600">
                    {d.description}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-slate-500 whitespace-nowrap">
                {new Date(d.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return demoPets.map((p) => ({ id: p.id }));
}
