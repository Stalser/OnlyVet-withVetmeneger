// components/DoctorCard.tsx

import type { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  showProfileButton?: boolean;
}

export function DoctorCard({ doctor, showProfileButton = false }: DoctorCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 flex flex-col gap-3 min-h-[190px]">
      <div className="flex gap-3">
        {/* Аватар с инициалами */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white font-semibold text-sm md:text-lg">
          {doctor.initials}
        </div>

        {/* Основная инфа */}
        <div className="flex-1">
          <div className="text-[14px] font-semibold">{doctor.name}</div>
          <div className="text-[12px] text-slate-500 mb-1">{doctor.role}</div>
          <div className="text-[12px] text-onlyvet-navy mb-1">
            {doctor.servicesShort}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {doctor.tags.map((tag) => (
              <span
                key={tag}
                className={
                  tag.toLowerCase().includes("консилиум") ||
                  tag.toLowerCase().includes("онкология")
                    ? "px-2 py-[2px] rounded-full text-[11px] bg-teal-50 text-onlyvet-navy"
                    : "px-2 py-[2px] rounded-full text-[11px] bg-slate-100 text-slate-700"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Низ карточки */}
      <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500">
        <div className="space-y-0.5">
          <div>{doctor.experienceLabel}</div>
          <div className="text-[11px] text-slate-400">
            Формат: {doctor.format.join(", ")} · Пациенты: {doctor.species.join(", ")}
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[11px] font-medium shadow-[0_10px_24px_rgba(247,118,92,0.45)]">
          {showProfileButton ? "Профиль и запись" : "Записаться"}
        </button>
      </div>
    </article>
  );
}
