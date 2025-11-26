import type { Service } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-2 min-h-[190px]">
      <div className="text-sm font-semibold">{service.name}</div>
      <div className="text-[13px] text-slate-500">{service.description}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-[2px] rounded-full bg-slate-100 text-[11px] text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-[12px]">
        <span className="font-medium text-onlyvet-navy">
          {service.priceLabel}
        </span>
        <button className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[11px] font-medium">
          Подробнее
        </button>
      </div>
    </article>
  );
}
