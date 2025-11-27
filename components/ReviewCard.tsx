// components/ReviewCard.tsx

import Link from "next/link";
import type { Review } from "@/data/reviews";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

interface ReviewCardProps {
  review: Review;
  truncate?: boolean; // true (по умолчанию) — обрезать длинные
}

function sourceMeta(source: Review["source"]) {
  switch (source) {
    case "yandex":
      return { label: "Яндекс", short: "Я", bg: "#FFCC00" };
    case "2gis":
      return { label: "2ГИС", short: "2Г", bg: "#00B956" };
    case "google":
      return { label: "Google", short: "G", bg: "#4285F4" };
    default:
      return { label: "Сайт OnlyVet", short: "OV", bg: "#0F172A" };
  }
}

export function ReviewCard({ review, truncate = true }: ReviewCardProps) {
  const { id, clientName, petName, rating, text, date, source, doctorId, serviceId } =
    review;

  const meta = sourceMeta(source);
  const maxLength = 260;
  const isLong = truncate && text.length > maxLength;
  const preview = isLong ? text.slice(0, maxLength) + "…" : text;

  const doctor = doctors.find((d) => d.id === doctorId);
  const service = services.find((s) => s.id === serviceId);

  const dt = new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col shadow-card">
      {/* Верх: аватар + имя + источник */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-[12px] font-semibold text-slate-700">
            {clientName[0] ?? "?"}
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold">{clientName}</div>
            {petName && (
              <div className="text-[11px] text-slate-500">{petName}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="text-yellow-400 text-[14px]">★</span>
            {rating}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: meta.bg }}
            >
              {meta.short}
            </div>
            {meta.label}
          </div>
        </div>
      </div>

      {/* Текст */}
      <div className="text-[13px] text-slate-700 leading-relaxed mb-2">
        {preview}
      </div>

      {/* Доп. информация */}
      <div className="mt-auto text-[11px] text-slate-500 space-y-1">
        <div className="flex flex-wrap gap-2">
          {doctor && (
            <span>
              Врач:{" "}
              <Link
                href={`/doctors/${doctor.id}`}
                className="text-onlyvet-coral hover:underline"
              >
                {doctor.name}
              </Link>
            </span>
          )}
          {service && (
            <span>
              Услуга:{" "}
              <Link
                href={`/services/${service.id}`}
                className="text-onlyvet-coral hover:underline"
              >
                {service.name}
              </Link>
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>{dt}</span>
          {isLong && (
            <Link
              href={`/reviews/${id}`}
              className="text-onlyvet-coral font-medium"
            >
              Читать полностью →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
