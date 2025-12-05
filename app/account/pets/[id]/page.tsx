// app/account/pets/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ConsultationCard,
  type ConsultationStatus,
} from "@/components/ConsultationCard";

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
// 🔹 Демоданные (заглушки)
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
      summary: "Постпанкреатитное наблюдение, корректировка схемы.",
      status: "done",
    },
  ],
};

const demoDocs: Record<string, PetDocument[]> = {
  pet1: [
    {
      id: "d1",
      category: "analyzes",
      title: "Биохимия крови (демо)",
      date: "2025-01-09",
      description: "ALT/AST слегка повышены. Лёгкая гипопротеинемия.",
    },
    {
      id: "d2",
      category: "imaging",
      title: "УЗИ брюшной полости (демо)",
      date: "2025-01-09",
      description: "Признаки гастрита. Остальные органы без выраженных изменений.",
    },
    {
      id: "d3",
      category: "discharge",
      title: "Выписка после консультации (демо)",
      date: "2025-01-10",
    },
  ],
  pet2: [
    {
      id: "d4",
      category: "analyzes",
      title: "Биохимия крови (демо)",
      date: "2024-12-19",
      description: "Амилаза/липаза в верхней границе нормы.",
    },
    {
      id: "d5",
      category: "discharge",
      title: "Выписка после панкреатита (демо)",
      date: "2024-12-20",
    },
  ],
};

// =============================
// 🔹 Вспомогательная логика
// =============================
function getPetById(id: string): PetRecord | undefined {
  return demoPets.find((p) => p.id === id);
}

// =============================
// 🔹 Страница карточки питомца
// =============================
export default function PetPage({ params }: { params: { id: string } }) {
  const pet = getPetById(params.id);

  if (!pet) return notFound();

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
            {/* 🔹 Ведём в новый кабинет на вкладку «Питомцы» */}
            <Link href="/account?tab=pets" className="hover:text-onlyvet-coral">
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
              {/* 🔹 Тоже ведём в /account?tab=pets */}
              <Link
                href="/account?tab=pets"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
              >
                К списку питомцев
              </Link>
            </div>
          </section>

          {/* Две колонки */}
          <section className="grid gap-5 md:grid-cols-[1.4fr,1fr] items-start">
            {/* Левая колонка: краткая инфа + медкарта */}
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

              {/* Медкарта (демо) */}
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
                    {visits.map((v) => {
                      const status: ConsultationStatus =
                        v.status === "done" ? "done" : "in_progress";

                      return (
                        <ConsultationCard
                          key={v.id}
                          id={v.id}
                          createdAt={v.date}
                          petName={pet.name}
                          serviceName="Онлайн-консультация (демо)"
                          doctorName={v.doctor}
                          dateTime={v.date}
                          status={status}
                          showPetLink={false}
                        />
                      );
                    })}
                  </div>
                )}

                <p className="mt-1 text-[11px] text-slate-500">
                  В будущем данные будут синхронизироваться с Vetmanager и
                  реальными заключениями врача.
                </p>
              </div>
            </div>

            {/* Правая колонка: документы (демо) */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
                <h3 className="text-[15px] font-semibold mb-3">
                  Документы питомца (демо)
                </h3>
                <p className="text-[12px] text-slate-600 mb-3 leading-relaxed">
                  Здесь будут храниться анализы, исследования, выписки и другие
                  материалы. Сейчас показаны демонстрационные данные.
                </p>

                <div className="space-y-3">
                  <DocCategory title="Анализы" docs={analyzes} />
                  <DocCategory title="Исследования" docs={imaging} />
                  <DocCategory title="Выписки" docs={discharge} />
                  <DocCategory title="Прочее" docs={other} />
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  Позже можно будет загружать документы прямо здесь или через
                  интеграцию с Vetmanager.
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
// 🔹 Категория документов (демо)
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
                {new Date(d.readableDate ?? d.date).toLocaleDateString("ru-RU", {
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
