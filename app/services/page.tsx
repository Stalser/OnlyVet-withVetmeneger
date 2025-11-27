// app/services/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import {
  services,
  type Service,
  type ServiceCategory,
} from "@/data/services";
import { doctors } from "@/data/doctors";

type FilterCategory = "all" | ServiceCategory;
type FilterSpec = "all" | "терапия" | "эксперт" | "диагностика" | "онкология";
type FilterDoctorId = "all" | string;

export default function ServicesPage() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [spec, setSpec] = useState<FilterSpec>("all");
  const [doctorId, setDoctorId] = useState<FilterDoctorId>("all");

  const filtered = useMemo(
    () => filterServices({ category, spec, doctorId }),
    [category, spec, doctorId]
  );

  // "умные" доступные варианты
  const availableCategories = useMemo(
    () => getAvailableCategories(spec, doctorId),
    [spec, doctorId]
  );
  const availableSpecs = useMemo(
    () => getAvailableSpecs(category, doctorId),
    [category, doctorId]
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Заголовок */}
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Услуги OnlyVet
              </h1>
              <p className="text-[13px] text-slate-600 max-w-2xl">
                Основные форматы работы: от разовой консультации до
                долгосрочного сопровождения сложных пациентов.
              </p>
            </div>
          </div>

          {/* Фильтры: тип услуги */}
          <div className="flex flex-wrap gap-2 text-[12px] mb-2">
            <span className="text-slate-500 mr-1">Тип услуги:</span>
            {[
              { key: "all" as FilterCategory, label: "Все" },
              { key: "консультация", label: "Консультации" },
              { key: "второе мнение", label: "Второе мнение" },
              { key: "диагностика", label: "Диагностика" },
              { key: "сопровождение", label: "Сопровождение" },
            ].map((btn) => {
              const enabled = availableCategories.has(btn.key);
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => enabled && setCategory(btn.key)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    category === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : enabled
                      ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                      : "border-slate-200 text-slate-300 bg-slate-50 cursor-default text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Фильтры: специализация врача */}
          <div className="flex flex-wrap gap-2 text-[12px] mb-2">
            <span className="text-slate-500 mr-1">Специализация врача:</span>
            {[
              { key: "all" as FilterSpec, label: "Любая" },
              { key: "терапия", label: "Терапия" },
              { key: "эксперт", label: "Эксперт / онкология" },
              { key: "диагностика", label: "Диагностика" },
              { key: "онкология", label: "Онкология" },
            ].map((btn) => {
              const enabled = availableSpecs.has(btn.key);
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => enabled && setSpec(btn.key)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    spec === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : enabled
                      ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                      : "border-slate-200 text-slate-300 bg-slate-50 cursor-default text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Фильтр: конкретный врач — компактный select */}
          <div className="flex items-center gap-2 text-[12px] mb-4">
            <span className="text-slate-500">Врач:</span>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value as FilterDoctorId)}
              className="
                rounded-full border border-slate-300 bg-white px-3 py-1.5 
                text-[12px] text-onlyvet-navy
                focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
              "
            >
              <option value="all">Все врачи</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Сетка услуг */}
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            {filtered.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="h-full"
              >
                <ServiceCard service={service} />
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-[13px] text-slate-500 col-span-full">
                По выбранным фильтрам пока нет услуг. Попробуйте изменить
                параметры.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////
// ЛОГИКА ФИЛЬТРАЦИИ И "УМНЫХ" ФИЛЬТРОВ
////////////////////////////////////////////////////////////////////////////////

function filterServices({
  category,
  spec,
  doctorId,
}: {
  category: FilterCategory;
  spec: FilterSpec;
  doctorId: FilterDoctorId;
}): Service[] {
  // если выбран врач — используем его специализацию как приоритетную
  let doctorSpec: FilterSpec | null = null;
  if (doctorId !== "all") {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      doctorSpec = doctor.specialization as FilterSpec;
    }
  }

  return services.filter((s) => {
    const byCategory = category === "all" ? true : s.category === category;

    const specToCheck: FilterSpec = doctorSpec ?? spec;
    const bySpec =
      specToCheck === "all"
        ? true
        : s.specializations.includes(specToCheck as any);

    return byCategory && bySpec;
  });
}

// какие категории вообще дают результат при текущих spec + doctor
function getAvailableCategories(spec: FilterSpec, doctorId: FilterDoctorId) {
  const set = new Set<FilterCategory>();
  // 'all' всегда допустимо
  set.add("all");

  (["консультация", "второе мнение", "диагностика", "сопровождение"] as ServiceCategory[]).forEach(
    (cat) => {
      const result = filterServices({ category: cat, spec, doctorId });
      if (result.length > 0) {
        set.add(cat);
      }
    }
  );

  return set;
}

// какие специализации вообще дают результат при текущей категории + doctor
function getAvailableSpecs(category: FilterCategory, doctorId: FilterDoctorId) {
  const set = new Set<FilterSpec>();
  set.add("all");

  (["терапия", "эксперт", "диагностика", "онкология"] as FilterSpec[]).forEach(
    (spec) => {
      const result = filterServices({ category, spec, doctorId });
      if (result.length > 0) {
        set.add(spec);
      }
    }
  );

  return set;
}
