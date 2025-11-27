"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";

type SpecializationFilter = "all" | "терапия" | "диагностика" | "эксперт" | "онкология";

export default function DoctorsPage() {
  const [filter, setFilter] = useState<SpecializationFilter>("all");

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doc) =>
        filter === "all" ? true : doc.specialization === filter
      ),
    [filter]
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Все врачи OnlyVet
              </h1>
              <p className="text-[13px] text-slate-600 max-w-xl">
                Здесь вы можете подобрать врача по специализации и задачам
                пациента. В будущем данные будут подтягиваться напрямую из
                Vetmanager.
              </p>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 mb-5 text-[13px]">
            {[
              { key: "all", label: "Все" },
              { key: "терапия", label: "Терапия" },
              { key: "эксперт", label: "Эксперт / консилиум" },
              { key: "диагностика", label: "Диагностика" },
              { key: "онкология", label: "Онкология" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key as SpecializationFilter)}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  filter === item.key
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Сетка врачей */}
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            {filteredDoctors.length === 0 ? (
              <div className="text-[13px] text-slate-500 col-span-full">
                По выбранным фильтрам пока нет врачей. Попробуйте изменить
                параметры.
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <Link key={doc.id} href={`/doctors/${doc.id}`}>
                  <DoctorCard doctor={doc} showProfileButton />
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
