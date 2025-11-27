// app/reviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";
import { reviews } from "@/data/reviews";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type SourceFilter = "all" | "yandex" | "2gis" | "google" | "site";
type DoctorFilter = "all" | string;
type ServiceFilter = "all" | string;
type SortOrder = "newest" | "oldest";

export default function ReviewsPage() {
  const [source, setSource] = useState<SourceFilter>("all");
  const [doctorId, setDoctorId] = useState<DoctorFilter>("all");
  const [serviceId, setServiceId] = useState<ServiceFilter>("all");
  const [order, setOrder] = useState<SortOrder>("newest");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...reviews];

    if (source !== "all") {
      list = list.filter((r) => r.source === source);
    }
    if (doctorId !== "all") {
      list = list.filter((r) => r.doctorId === doctorId);
    }
    if (serviceId !== "all") {
      list = list.filter((r) => r.serviceId === serviceId);
    }

    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return order === "newest" ? db - da : da - db;
    });

    return list;
  }, [source, doctorId, serviceId, order]);

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Отзывы владельцев
              </h1>
              <p className="text-[13px] text-slate-600 max-w-2xl">
                Реальные истории владельцев, которые воспользовались онлайн-
                консультациями OnlyVet.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full 
                  border border-slate-300 bg-white text-[13px] text-onlyvet-navy
                  hover:bg-slate-50 transition
                "
              >
                Написать отзыв
              </button>
              <Link
                href="/booking"
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-onlyvet-coral text-white text-[13px] font-medium
                  shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition
                "
              >
                Записаться на консультацию
              </Link>
            </div>
          </div>

          {/* Фильтры */}
          <div className="space-y-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Источник:</span>
              {[
                { key: "all", label: "Все" },
                { key: "yandex", label: "Яндекс" },
                { key: "2gis", label: "2ГИС" },
                { key: "google", label: "Google" },
                { key: "site", label: "Сайт OnlyVet" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setSource(btn.key as SourceFilter)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    source === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm text-xs"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 text-xs"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Врач:</span>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value as DoctorFilter)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[12px] text-onlyvet-navy focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="all">Все врачи</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Услуга:</span>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value as ServiceFilter)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[12px] text-onlyvet-navy focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="all">Все услуги</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 mr-1">Сортировка:</span>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as SortOrder)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[12px] text-onlyvet-navy focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
              </select>
            </div>
          </div>

          {/* Список отзывов */}
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 items-stretch mt-4">
            {filtered.map((rev) => (
              <Link key={rev.id} href={`/reviews/${rev.id}`} className="h-full">
                <ReviewCard review={rev} truncate />
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-[13px] text-slate-500 col-span-full">
                По заданным параметрам пока нет отзывов.
              </div>
            )}
          </div>
        </div>

        {/* Модалка */}
        <ReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
      <Footer />
    </>
  );
}
