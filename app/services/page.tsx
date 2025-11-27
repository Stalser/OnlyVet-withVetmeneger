// app/services/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  services,
  type ServiceCategory,
  type Service,
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
              { key: "all", label: "Все" },
              { key: "консультация", label: "Консультации" },
              { key: "второе мнение", label: "Второе мнение" },
              { key: "диагностика", label: "Диагностика" },
              { key: "сопровождение", label: "Сопровождение" },
            ].map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setCategory(btn.key as FilterCategory)}
                className={`px-3 py-1.5 rounded-full border transition ${
                  category === btn.key
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Фильтры: специализация врача */}
          <div className="flex flex-wrap gap-2 text-[12px] mb-2">
            <span className="text-slate-500 mr-1">Специализация врача:</span>
            {[
              { key: "all", label: "Любая" },
              { key: "терапия", label: "Терапия" },
              { key: "эксперт", label: "Эксперт / онкология" },
              { key: "диагностика", label: "Диагностика" },
              { key: "онкология", label: "Онкология" },
            ].map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setSpec(btn.key as FilterSpec)}
                className={`px-3 py-1.5 rounded-full border transition ${
                  spec === btn.key
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Фильтры: конкретный врач */}
          <div className="flex flex-wrap gap-2 text-[12px] mb-4">
            <span className="text-slate-500 mr-1">Врач:</span>
            <button
              type="button"
              onClick={() => setDoctorId("all")}
              className={`px-3 py-1.5 rounded-full border transition ${
                doctorId === "all"
                  ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                  : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
              }`}
            >
              Все врачи
            </button>
            {doctors.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setDoctorId(doc.id)}
                className={`px-3 py-1.5 rounded-full border transition ${
                  doctorId === doc.id
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                }`}
              >
                {doc.name}
              </button>
            ))}
          </div>

          {/* Сетка услуг */}
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            {filtered.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="h-full">
                <ServiceCard service={service} />
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-[13px] text-slate-500 col-span-full">
                По выбранным фильтрам пока нет услуг. Попробуйте изменить параметры.
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
// Фильтрация услуг
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
  // если выбран врач, берём его специализацию
  let doctorSpec: FilterSpec | null = null;
  if (doctorId !== "all") {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      doctorSpec = doctor.specialization as FilterSpec;
    }
  }

  return services.filter((s) => {
    const byCategory = category === "all" ? true : s.category === category;

    // фильтр по специализации врачей, которые ведут услугу
    const specToCheck = doctorSpec ?? spec;
    const bySpec =
      specToCheck === "all"
        ? true
        : s.specializations.includes(specToCheck as any);

    return byCategory && bySpec;
  });
}
