// components/ReviewCard.tsx

import Link from "next/link";
import type { Review } from "@/data/reviews";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

interface ReviewCardProps {
  review: Review;
  truncate?: boolean;   // для главной — обрезать текст, для полной страницы можно false
}

function getSourceMeta(source: Review["source"]) {
  switch (source) {
    case "yandex":
      return { label: "Яндекс", short: "Я", bg: "#FFCC00" };
    case "2gis":
      return { label: "2ГИС", short: "2Г", bg: "#00B956" };
    case "google":
      return { label: "Google", short: "G", bg: "#4285F4" };
    case "site":
    default:
      return { label: "Сайт OnlyVet", short: "OV", bg: "#0F172A" };
  }
}

function getDoctorName(doctorId?: string) {
  if (!doctorId) return undefined;
  const doc = doctors.find((d) => d.id === doctorId);
  return doc?.name;
}

function getServiceName(serviceId?: string) {
  if (!serviceId) return undefined;
  const svc = services.find((s) => s.id === serviceId);
  return svc?.name;
}

export function ReviewCard({ review, truncate = true }: ReviewCardProps) {
  const { id, clientName, petName, rating, text, date, source, doctorId, serviceId } =
    review;

  const sourceMeta = getSourceMeta(source);
  const doctorName = getDoctorName(doctorId);
  const serviceName = getServiceName(serviceId);

  const maxLength = 260;
  const shouldTruncate = truncate && text.length > maxLength;
  const previewText = shouldTruncate ? text.slice(0, maxLength) + "…" : text;

  const dt = new Date(date);
  const formattedDate = dt.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className="
        bg-white 
        rounded-2xl 
        border border-slate-200/80 
        p-4 
        flex 
        flex-col 
        shadow-card
      "
    >
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
          {/* Рейтинг */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="text-yellow-400 text-[13px]">★</span>
            <span>{rating.toFixed(1)}</span>
          </div>
          {/* Источник */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
              style={{ backgroundColor: sourceMeta.bg }}
            >
              {sourceMeta.short}
            </div>
            <span>{sourceMeta.label}</span>
          </div>
        </div>
      </div>

      {/* Текст */}
      <div className="text-[13px] text-slate-700 leading-relaxed mb-2">
        {previewText}
      </div>

      {/* Доп. инфа: врач / услуга / дата */}
      <div className="mt-auto text-[11px] text-slate-500 space-y-1">
        <div className="flex flex-wrap gap-2">
          {doctorName && (
            <span>
              Врач:{" "}
              <Link
                href={`/doctors/${doctorId}`}
                className="text-onlyvet-coral hover:underline"
              >
                {doctorName}
              </Link>
            </span>
          )}
          {serviceName && (
            <span>
              Услуга:{" "}
              <Link
                href={`/services/${serviceId}`}
                className="text-onlyvet-coral hover:underline"
              >
                {serviceName}
              </Link>
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>{formattedDate}</span>
          {shouldTruncate && (
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
