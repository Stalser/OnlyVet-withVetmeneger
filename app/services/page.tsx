// app/services/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { services, type ServiceCategory } from "@/data/services";

type FilterCategory = "all" | ServiceCategory;

export default function ServicesPage() {
  const [category, setCategory] = useState<FilterCategory>("all");

  const filtered = useMemo(
    () =>
      services.filter((s) =>
        category === "all" ? true : s.category === category
      ),
    [category]
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
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

          {/* Фильтры по типу */}
          <div className="flex flex-wrap gap-2 text-[12px] mb-3">
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
                onClick={() =>
                  setCategory(btn.key as FilterCategory)
                }
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

          {/* Сетка услуг */}
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            {filtered.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="h-full">
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
