"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";
import { useState } from "react";

const specializations = [
  { key: "all", label: "Все" },
  { key: "терапия", label: "Терапия" },
  { key: "эксперт", label: "Эксперт / консилиум" },
  { key: "диагностика", label: "Диагностика" },
];

export default function DoctorsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = doctors.filter((doc) =>
    filter === "all" ? true : doc.specialization === filter
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
                Позже данные будут подтягиваться из Vetmanager, а у каждого
                врача появится страница с подробной информацией и расписанием.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5 text-[13px]">
            {specializations.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setFilter(s.key)}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  filter === s.key
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                    : "border-slate-300 text-onlyvet-navy bg-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                showProfileButton={true}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
