"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/data/services";
import { useState } from "react";

const categories = [
  { key: "all", label: "Все услуги" },
  { key: "консультации", label: "Онлайн-консультации" },
  { key: "второе мнение", label: "Второе мнение" },
  { key: "диагностика", label: "Диагностика" },
];

export default function ServicesPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = services.filter((s) =>
    filter === "all" ? true : s.category === filter
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Все услуги OnlyVet
              </h1>
              <p className="text-[13px] text-slate-600 max-w-xl">
                В будущем каждая услуга получит детальную страницу, а данные
                будут синхронизироваться с Vetmanager.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5 text-[13px]">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  filter === c.key
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy"
                    : "border-slate-300 text-onlyvet-navy bg-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
