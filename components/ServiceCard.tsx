// components/ServiceCard.tsx

import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  showDetailsButton?: boolean;
}

export function ServiceCard({ service, showDetailsButton = true }: ServiceCardProps) {
  return (
    <article
      className="
        h-full
        bg-white 
        rounded-2xl 
        border border-slate-200/80 
        p-4 
        flex 
        flex-col 
        shadow-card
        transition-all 
        duration-150 
        ease-out
        hover:-translate-y-[2px] 
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]
      "
    >
      <div className="mb-1">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400 mb-1">
          {service.category === "консультация"
            ? "Консультация"
            : service.category === "второе мнение"
            ? "Второе мнение"
            : service.category === "диагностика"
            ? "Диагностика"
            : "Сопровождение"}
        </div>
        <h3 className="text-[15px] font-semibold">{service.name}</h3>
      </div>

      <p className="text-[13px] text-slate-600 mb-2 flex-1">
        {service.shortDescription}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-[2px] rounded-full text-[11px] bg-slate-100 text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between text-[12px]">
        <span className="font-medium text-onlyvet-navy">
          {service.priceLabel}
        </span>
        {showDetailsButton && (
          <span className="text-[12px] text-onlyvet-coral font-medium">
            Подробнее →
          </span>
        )}
      </div>
    </article>
  );
}
