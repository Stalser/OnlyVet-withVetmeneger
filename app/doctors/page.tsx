// app/doctors/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";

type SpecFilter = "all" | "терапия" | "диагностика" | "эксперт" | "онкология";
type TagFilter = "all" | string;

export default function DoctorsPage() {
  const [specFilter, setSpecFilter] = useState<SpecFilter>("all");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [search, setSearch] = useState("");

  // собрать список тегов для фильтра
  const allTags = useMemo(
    () =>
      Array.from(
        new Set(
          doctors
            .flatMap((d) => d.tags)
            .map((t) => t.trim())
            .filter(Boolean)
        )
      ),
    []
  );

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();

    return doctors.filter((d) => {
      if (specFilter !== "all" && d.specialization !== specFilter) return false;
      if (tagFilter !== "all" && !d.tags.includes(tagFilter)) return false;

      if (q) {
        const haystack = `${d.name} ${d.role} ${
          d.servicesShort
        } ${d.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [specFilter, tagFilter, search]);

  const hasDoctors = filteredDoctors.length > 0;

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              / <span className="text-slate-700">Врачи</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold">
                  Врачи OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600 max-w-xl leading-relaxed">
                  Подберите специалиста под вашу задачу: терапия, диагностика,
                  онкология, сложные случаи и второе мнение.
                </p>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <section className="space-y-3">
            {/* Специализация */}
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-slate-500 mr-1">Специализация:</span>
              {[
                { key: "all", label: "Все" },
                { key: "терапия", label: "Терапия" },
                { key: "эксперт", label: "Эксперт / консилиум" },
                { key: "диагностика", label: "Диагностика" },
                { key: "онкология", label: "Онкология" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setSpecFilter(btn.key as SpecFilter)}
                  className={`px-3 py-1.5 rounded-full border transition text-xs ${
                    specFilter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Тематика запросов (теги) */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="text-slate-500 mr-1">
                  Тематика запросов:
                </span>
                <button
                  type="button"
                  onClick={() => setTagFilter("all")}
                  className={`px-3 py-1.5 rounded-full border transition text-xs ${
                    tagFilter === "all"
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  }`}
                >
                  Все
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1.5 rounded-full border transition text-xs ${
                      tagFilter === tag
                        ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                        : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Поиск */}
            <div className="mt-1">
              <input
                type="text"
                placeholder="Поиск по имени, роли, фокусу, тегам…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full md:max-w-md
                  rounded-full border border-slate-300 
                  px-3 py-2 text-[13px]
                  focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
                "
              />
            </div>
          </section>

          {/* Сетка врачей */}
          <section>
            <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 items-stretch mt-2">
              {!hasDoctors ? (
                <div className="text-[13px] text-slate-500 col-span-full bg-white rounded-3xl border border-slate-200 shadow-soft px-4 py-3">
                  По заданным параметрам пока нет подходящих врачей. Попробуйте
                  ослабить фильтры или сбросить один из параметров.
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/doctors/${doc.id}`}
                    className="h-full"
                  >
                    <DoctorCard doctor={doc} />
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
