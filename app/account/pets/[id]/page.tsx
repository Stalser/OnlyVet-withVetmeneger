// app/account/pets/[id]/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ConsultationCard,
  type ConsultationStatus,
} from "@/components/ConsultationCard";
import { getSupabaseClient } from "@/lib/supabaseClient";

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

type SupabasePetRow = {
  id: string;
  name: string;
  species: string | null;
  age_text: string | null;
  weight_kg: number | null;
  notes: string | null;
};

type PetVisitDemo = {
  id: string;
  date: string;
  doctor: string;
  summary: string;
  status: "done" | "scheduled";
};

type SupabaseConsultationRow = {
  id: string;
  status: "new" | "in_progress" | "done" | "cancelled";
  planned_at: string | null;
  created_at: string;
  complaint: string | null;
  service_id: string | null;
};

type NormalizedConsult = {
  id: string;
  dateTime: string;
  doctor: string;
  summary: string;
  status: ConsultationStatus;
};

type PetDocument = {
  id: string;
  category: "analyzes" | "imaging" | "discharge" | "other";
  title: string;
  date: string;
  description?: string;
};

// =============================
// 🔹 Демоданные
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

const demoVisits: Record<string, PetVisitDemo[]> = {
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
// 🔹 Нормализация консультаций
// =============================

function normalizeConsultFromSupabase(
  row: SupabaseConsultationRow
): NormalizedConsult {
  const baseDate = row.planned_at || row.created_at;
  const d = new Date(baseDate);

  const dateTime = d.toISOString();

  let status: ConsultationStatus;
  switch (row.status) {
    case "done":
      status = "done";
      break;
    default:
      // new / in_progress / cancelled → показываем как "scheduled"
      status = "scheduled";
      break;
  }

  return {
    id: row.id,
    dateTime,
    doctor: "Врач онлайн-клиники", // пока нет связи с конкретным врачом
    summary: row.complaint || "Онлайн-консультация",
    status,
  };
}

function normalizeDemoVisit(v: PetVisitDemo): NormalizedConsult {
  const d = new Date(v.date);
  const dateTime = d.toISOString();
  const status: ConsultationStatus =
    v.status === "done" ? "done" : "scheduled";

  return {
    id: v.id,
    dateTime,
    doctor: v.doctor,
    summary: v.summary,
    status,
  };
}

// =============================
// 🔹 Основной компонент
// =============================

export default function PetPage({ params }: { params: { id: string } }) {
  const petId = params.id;

  const [pet, setPet] = useState<PetRecord | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);

  const [consults, setConsults] = useState<NormalizedConsult[]>([]);
  const [loadingConsults, setLoadingConsults] = useState(true);

  const docs = demoDocs[petId] || [];
  const analyzes = docs.filter((d) => d.category === "analyzes");
  const imaging = docs.filter((d) => d.category === "imaging");
  const discharge = docs.filter((d) => d.category === "discharge");
  const other = docs.filter((d) => d.category === "other");

  // Загружаем питомца: сначала Supabase, потом fallback на демо
  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseClient();

    const loadPet = async () => {
      try {
        setLoadingPet(true);

        const { data, error } = await supabase
          .from("pets")
          .select("id, name, species, age_text, weight_kg, notes")
          .eq("id", petId)
          .maybeSingle<SupabasePetRow>();

        if (cancelled) return;

        if (!error && data) {
          const normalized: PetRecord = {
            id: data.id,
            name: data.name,
            kind: data.species || "",
            age: data.age_text || "",
            notes: data.notes || undefined,
          };
          setPet(normalized);
          setLoadingPet(false);
          return;
        }

        // fallback на демо
        const demo = demoPets.find((p) => p.id === petId) || null;
        setPet(demo);
      } catch (err) {
        console.error("[PetPage] error loading pet:", err);
        const demo = demoPets.find((p) => p.id === petId) || null;
        setPet(demo);
      } finally {
        if (!cancelled) setLoadingPet(false);
      }
    };

    loadPet();
    return () => {
      cancelled = true;
    };
  }, [petId]);

  // Загружаем консультации по этому pet_id из Supabase
  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseClient();

    const loadConsults = async () => {
      try {
        setLoadingConsults(true);

        const { data, error } = await supabase
          .from("consultations")
          .select(
            "id, status, planned_at, created_at, complaint, service_id"
          )
          .eq("pet_id", petId)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (error) {
          console.error("[PetPage] error loading consultations:", error);
          setConsults([]);
          return;
        }

        const rows = (data || []) as SupabaseConsultationRow[];
        const mapped = rows.map(normalizeConsultFromSupabase);
        setConsults(mapped);
      } catch (err) {
        console.error("[PetPage] unexpected error loading consultations:", err);
        if (!cancelled) setConsults([]);
      } finally {
        if (!cancelled) setLoadingConsults(false);
      }
    };

    loadConsults();
    return () => {
      cancelled = true;
    };
  }, [petId]);

  // fallback: если нет реальных консультаций — используем демо для pet1/pet2
  const effectiveConsults: NormalizedConsult[] =
    consults.length > 0
      ? consults
      : (demoVisits[petId] || []).map(normalizeDemoVisit);

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
            /{" "}
            <span className="text-slate-700">
              {pet ? pet.name : loadingPet ? "Загрузка..." : "Не найден"}
            </span>
          </nav>

          {/* Состояние загрузки / не найден */}
          {loadingPet && (
            <p className="text-[13px] text-slate-600">
              Загружаем данные о питомце…
            </p>
          )}

          {!loadingPet && !pet && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
              <h1 className="text-lg md:text-xl font-semibold mb-2">
                Питомец не найден
              </h1>
              <p className="text-[13px] text-slate-600 mb-3">
                Возможно, этот питомец был удалён или вы перешли по некорректной
                ссылке.
              </p>
              <Link
                href="/account/pets"
                className="inline-flex px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
              >
                Вернуться к списку питомцев
              </Link>
            </section>
          )}

          {pet && (
            <>
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
                      {pet.kind}
                      {pet.age && ` • ${pet.age}`}
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
                    href="/account"
                    className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
                  >
                    В личный кабинет
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
                      {pet.kind && (
                        <p>
                          <span className="text-slate-500">Вид и порода: </span>
                          {pet.kind}
                        </p>
                      )}
                      {pet.age && (
                        <p>
                          <span className="text-slate-500">Возраст: </span>
                          {pet.age}
                        </p>
                      )}
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
                      Медицинская карта
                    </h2>

                    {loadingConsults ? (
                      <p className="text-[13px] text-slate-600">
                        Загружаем консультации…
                      </p>
                    ) : effectiveConsults.length === 0 ? (
                      <p className="text-[13px] text-slate-600">
                        Записей пока нет. После консультаций здесь появятся
                        краткие резюме приёмов.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {effectiveConsults.map((c) => (
                          <ConsultationCard
                            key={c.id}
                            id={c.id}
                            createdAt={c.dateTime}
                            petName={pet.name}
                            serviceName="Онлайн-консультация"
                            doctorName={c.doctor}
                            dateTime={c.dateTime}
                            status={c.status}
                            showPetLink={false}
                          />
                        ))}
                      </div>
                    )}

                    <p className="mt-1 text-[11px] text-slate-500">
                      Реальные данные берутся из Supabase (таблица
                      consultations). Для демо-питомцев показаны примерные визиты.
                    </p>
                  </div>
                </div>

                {/* Правая колонка: документы */}
                <div className="space-y-5">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
                    <h3 className="text-[15px] font-semibold mb-3">
                      Документы питомца (демо)
                    </h3>
                    <p className="text-[12px] text-slate-600 mb-3 leading-relaxed">
                      Документы распределены по категориям: анализы,
                      исследования, выписки и другие материалы. В дальнейшем сюда
                      будут попадать файлы из загрузок и Vetmanager.
                    </p>

                    <div className="space-y-3">
                      <DocCategory title="Анализы" docs={analyzes} />
                      <DocCategory title="Исследования" docs={imaging} />
                      <DocCategory title="Выписки" docs={discharge} />
                      <DocCategory title="Прочее" docs={other} />
                    </div>

                    <p className="mt-3 text-[11px] text-slate-500">
                      Позже можно будет загружать документы прямо здесь, а также
                      подтягивать их автоматически из Vetmanager.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
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
              className="flex justify_between items-start gap-3 text-[12px]"
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
