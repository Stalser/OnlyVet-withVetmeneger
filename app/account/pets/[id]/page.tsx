// app/account/pets/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  ConsultationCard,
  type ConsultationStatus,
} from "@/components/ConsultationCard";

// =============================
// 🔹 Типы данных
// =============================
type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type PetRow = {
  id: string;
  owner_id: string;
  name: string;
  species: string | null;
  age_text: string | null;
  weight_kg: number | null;
  notes: string | null;
};

type PetViewModel = {
  id: string;
  name: string;
  kind: string;
  age: string;
  sex?: string;
  color?: string;
  weightLabel?: string;
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
// 🔹 Демоданные (визиты + документы)
// =============================
const demoVisits: Record<string, PetVisit[]> = {
  // Для реальных id это будет просто демо, не зависящее от базы
  demo: [
    {
      id: "v1",
      date: "2025-01-10 18:30",
      doctor: "Эльвин Мазагирович",
      summary: "Демо-визит: обострение гастрита, коррекция диеты, назначена терапия.",
      status: "done",
    },
  ],
};

const demoDocs: Record<string, PetDocument[]> = {
  demo: [
    {
      id: "d1",
      category: "analyzes",
      title: "Биохимия крови (демо)",
      date: "2025-01-09",
      description: "ALT/AST слегка повышены. Лёгкая гипопротеинемия.",
    },
  ],
};

// =============================
// 🔹 Компонент страницы
// =============================

export default function PetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [pet, setPet] = useState<PetViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // 1. Проверяем авторизацию
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          if (!cancelled) router.replace("/auth/login");
          return;
        }

        if (cancelled) return;

        setUser({
          id: user.id,
          email: user.email || undefined,
          user_metadata: user.user_metadata || {},
        });

        // 2. Грузим питомца из таблицы pets
        const { data, error } = await supabase
          .from("pets")
          .select("id, owner_id, name, species, age_text, weight_kg, notes")
          .eq("id", params.id)
          .single<PetRow>();

        if (cancelled) return;

        if (error) {
          console.error("[PetPage] pet load error:", error);
          setLoadError("Не удалось загрузить данные питомца.");
          return;
        }

        // Если питомец не принадлежит текущему пользователю — 404
        if (data.owner_id !== user.id) {
          notFound();
          return;
        }

        const weightLabel =
          data.weight_kg !== null && data.weight_kg !== undefined
            ? `${String(data.weight_kg).replace(/\.0+$/, "")} кг`
            : undefined;

        const vm: PetViewModel = {
          id: data.id,
          name: data.name,
          kind: data.species || "Вид не указан",
          age: data.age_text || "Возраст не указан",
          // sex / color пока оставляем пустыми (если понадобятся — можно добавить в таблицу)
          sex: undefined,
          color: undefined,
          weightLabel,
          notes: data.notes || undefined,
        };

        setPet(vm);
      } catch (err) {
        console.error("[PetPage] unexpected error:", err);
        if (!cancelled) {
          setLoadError("Техническая ошибка при загрузке данных.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id, router, supabase]);

  // Простейший спиннер
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <p className="text-[13px] text-slate-600">Загружаем карточку питомца…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError || !pet || !user) {
    // Если ошибка или питомец не найден — можно показать понятный экран
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4 space-y-3">
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
              / <span className="text-slate-700">Питомец</span>
            </nav>
            <div className="bg-white rounded-3xl border border-rose-200 shadow-soft p-5 md:p-6">
              <h1 className="text-lg md:text-xl font-semibold mb-2">
                Карточка питомца недоступна
              </h1>
              <p className="text-[13px] text-slate-600">
                {loadError ||
                  "Питомец не найден или вы не имеете доступа к его карточке."}
              </p>
              <div className="mt-3 flex gap-2 text-[12px]">
                <Link
                  href="/account/pets"
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  К списку питомцев
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // демо-визиты и документы — пока общие для всех
  const visits = demoVisits.demo || [];
  const docs = demoDocs.demo || [];

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
                  {pet.weightLabel && ` • вес: ${pet.weightLabel}`}
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
                  {pet.weightLabel && (
                    <p>
                      <span className="text-slate-500">Вес: </span>
                      {pet.weightLabel}
                    </p>
                  )}
                  {pet.notes && (
                    <p className="pt-1">
                      <span className="text-slate-500">
                        Особенности здоровья:
                      </span>{" "}
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
                        v.status === "done" ? "done" : "scheduled";

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
                  реальными заключениями врачей.
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
// 🔹 Компонент категории документов (демо)
// =============================
function DocCategory({
  title,
  docs,
}: {
  title: string;
  docs: PetDocument[];
}) {
  if (docs.length === 0) {
    return (
      <div className="border border-slate-200 rounded-2xl bg-onlyvet-bg px-4 py-3 text-[12px] text-slate-500">
        {title}: документов пока нет.
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-2xl bg-onlyvet-bg px-4 py-3">
      <div className="text-[13px] font-semibold text-slate-800 mb-2">
        {title}
      </div>
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
    </div>
  );
}
