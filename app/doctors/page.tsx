// app/doctors/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";

type SpecializationFilter = "all" | "терапия" | "диагностика" | "эксперт" | "онкология";
type SpeciesFilter = "all" | "кошки" | "собаки";
type FormatFilter = "all" | "онлайн" | "консилиум" | "диагностика";

export default function DoctorsPage() {
  const [specialization, setSpecialization] = useState<SpecializationFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doc) => {
        const specOk = specialization === "all" || doc.specialization === specialization;
        const speciesOk =
          species === "all" || doc.species.includes(species as "кошки" | "собаки");
        const formatOk =
          format === "all" || doc.format.includes(format as "онлайн" | "консилиум" | "диагностика");
        return specOk && speciesOk && formatOk;
      }),
    [specialization, species, format]
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Заголовок */}
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Все врачи OnlyVet</h1>
              <p className="text-[13px] text-slate-600 max-w-xl">
                Здесь вы можете подобрать врача по специализации, формату работы и виду
                пациента. В будущем данные будут подтягиваться напрямую из Vetmanager.
              </p>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 mb-5 text-[13px]">
            {/* Специализация */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-slate-500">Специализация:</span>
              {[
                { key: "all", label: "Все" },
                { key: "терапия", label: "Терапия" },
                { key: "эксперт", label: "Эксперт/консилиум" },
                { key: "диагностика", label: "Диагностика" },
                { key: "онкология", label: "Онкология" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSpecialization(item.key as SpecializationFilter)}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    specialization === item.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                      : "border-slate-300 text-onlyvet-navy bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Вид животного */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-slate-500">Пациенты:</span>
              {[
                { key: "all", label: "Все" },
                { key: "кошки", label: "Кошки" },
                { key: "собаки", label: "Собаки" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSpecies(item.key as SpeciesFilter)}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    species === item.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                      : "border-slate-300 text-onlyvet-navy bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Формат */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-slate-500">Формат:</span>
              {[
                { key: "all", label: "Любой" },
                { key: "онлайн", label: "Онлайн" },
                { key: "консилиум", label: "Консилиум" },
                { key: "диагностика", label: "Диагностика" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFormat(item.key as FormatFilter)}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    format === item.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                      : "border-slate-300 text-onlyvet-navy bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Сетка врачей */}
          <div className="grid gap-4 md:grid-cols-3">
            {filteredDoctors.length === 0 ? (
              <div className="text-[13px] text-slate-500 col-span-full">
                По выбранным фильтрам пока нет врачей. Попробуйте изменить параметры.
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} showProfileButton />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
