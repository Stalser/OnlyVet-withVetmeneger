// app/account/pets/[id]/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// =============================
// 🔹 Типы данных
// =============================
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

// =============================
// 🔹 Демоданные (Локи / Рекс / Мурчик — как пример)
// =============================
const demoPets: PetRecord[] = [
  {
    id: "pet1",
    name: "Локи",
    kind: "Кошка, шотландская",
    age: "2 года",
    sex: "самка",
    color: "голубой",
    notes: "Хронический гастрит, периодические эпизоды рвоты. Наблюдается.",
  },
  {
    id: "pet2",
    name: "Рекс",
    kind: "Собака, метис",
    age: "6 лет",
    sex: "самец",
    color: "чёрно-рыжий",
    notes: "Перенесён острый панкреатит, требуется контроль диеты и анализов.",
  },
];

const demoVisits: Record<string, PetVisit[]> = {
  pet1: [
    {
      id: "v1",
      date: "2025-01-10",
      doctor: "Эльвин Мазагирович",
      summary: "Обострение гастрита, коррекция диеты, назначена терапия.",
      status: "done",
    },
    {
      id: "v2",
      date: "2025-02-05",
      doctor: "Диана Чемерилова",
      summary: "Плановый контроль. Динамика положительная.",
      status: "done",
    },
  ],
  pet2: [
    {
      id: "v3",
      date: "2024-12-20",
      doctor: "Диана Чемерилова",
      summary: "Постпанкреатитное наблюдение, корректировки схемы.",
      status: "done",
    },
  ],
};

const demoDocs: Record<string, PetDocument[]> = {
  pet1: [
    {
      id: "d1",
      category: "analyzes",
      title: "Биохимия крови",
      date: "2025-01-09",
      description: "ALT/AST слегка повышены. Лёгкая гипопротеинемия.",
    },
    {
      id: "d2",
      category: "imaging",
      title: "УЗИ брюшной полости",
      date: "2025-01-09",
      description: "Признаки гастрита. Остальные органы без особенностей.",
    },
    {
      id: "d3",
      category: "discharge",
      title: "Выписка после консультации",
      date: "2025-01-10",
    },
  ],
  pet2: [
    {
      id: "d4",
      category: "analyzes",
      title: "Анализ крови (биохимия)",
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

// =============================
// 🔹 Основная логика
// =============================
function getPetById(id: string): PetRecord | undefined {
  return demoPets.find((p) => p.id === id);
}

export default function PetPage({ params }: { params: { id: string } }) {
  const pet = getPetById(params.id);

  // Если питомец с таким id не найден — больше НЕ отдаём 404,
  // а показываем аккуратный экран "Питомец не найден".
  if (!pet) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4 space-y-6">
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
              / <span className="text-slate-700">Питомец не найден</span>
            </nav>

            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-center space-y-3">
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                Питомец не найден
              </h1>
              <p className="text-[13px] text-slate-600 max-w-md mx-auto">
                Карточка питомца с таким идентификатором пока недоступна.
                Возможно, это новый питомец, для которого ещё не создана
                отдельная страница. Позже здесь будет полноценная медкарта.
              </p>
              <div className="flex justify-center gap-2 text-[13px]">
                <Link
                  href="/account/pets"
                  className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  К списку питомцев
                </Link>
                <Link
                  href="/booking"
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
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

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
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

          {/* Шапка: имя, вид, кнопки */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center text-onlyvet-navy text-xl font-semibold">
                {pet.name[0]}
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  {pet.name}
                </h1>
                <div className="text-[13px] text-slate-600">
                  {pet.kind} • {pet.age}
                  {pet.sex && ` • ${pet.sex}`}
                  {pet.color && ` • окрас: ${pet.color}`}
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
                href="/account/pets"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
              >
                К списку питомцев
              </Link>
            </div>
          </section>

          {/* Две колонки */}
          <section className="grid gap-5 md:grid-cols-[1.4fr,1fr] items-start">
            {/* Левая колонка */}
            <div className="space-y-5">
              {/* Краткая информация */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
                <h2 className="text-[15px] font-semibold mb-3">
                  Краткая информация
                </h2>

                <div className="space-y-1 text-[13px] leading-relaxed text-slate-700">
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
                    <p className="pt-1">
                      <span className="text-slate-500">
                        Особенности здоровья:{" "}
                      </span>
                      {pet.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Медкарта */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-3">
                <h2 className="text-[15px] font-semibold">
                  Медицинская карта (демо)
                </h2>

                {visits.length === 0 ? (
                  <p className="text-[13px] text-slate-600">
                    Записей пока нет. После консультаций здесь появятся краткие
                    резюме приёмов.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {visits.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 text-[13px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-900">
                            Консультация #{v.id}
                          </div>
                          <span className="text-[12px] text-slate-500">
                            {v.date}
                          </span>
                        </div>
                        <div className="text-[12px] text-slate-600">
                          Врач: <span className="font-medium">{v.doctor}</span>
                        </div>
                        <p className="text-[12px] text-slate-700">
                          {v.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-1 text-[11px] text-slate-500">
                  В будущем данные будут синхронизироваться с Vetmanager.
                </p>
              </div>
            </div>

            {/* Правая колонка: документы */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
                <h3 className="text-[15px] font-semibold mb-3">
                  Документы питомца
                </h3>
                <p className="text-[12px] text-slate-600 mb-3 leading-relaxed">
                  Документы распределены по категориям: анализы, исследования,
                  выписки и другие материалы.
                </p>

                <div className="space-y-3">
                  <DocCategory title="Анализы" docs={analyzes} />
                  <DocCategory title="Исследования" docs={imaging} />
                  <DocCategory title="Выписки" docs={discharge} />
                  <DocCategory title="Прочее" docs={other} />
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  Позже можно будет загружать документы прямо здесь.
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

// =============================
// 🔹 Компонент категории документов
// =============================
function DocCategory({
  title,
  docs,
}: {
  title: string;
  docs: PetDocument[];
}) {
  return (
    <div className="border border-slate-200 rounded-2xl bg-onlyvet-bg px-4 py-3">
      <div className="text-[13px] font-semibold text-slate-800 mb-2">
        {title}
      </div>

      {docs.length === 0 ? (
        <div className="text-[12px] text-slate-500">Документов пока нет.</div>
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex justify-between items-start gap-3 text-[12px]"
            >
              <div className="flex-1">
                <div className="font-medium text-slate-800">{d.title}</div>
                {d.description && (
                  <div className="text-[11px] text-slate-600 leading-tight mt-[2px]">
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

// =============================
// 🔹 Генерация статических маршрутов (для демо-питомцев Локи/Рекс)
// =============================
export function generateStaticParams() {
  return demoPets.map((p) => ({ id: p.id }));
}
