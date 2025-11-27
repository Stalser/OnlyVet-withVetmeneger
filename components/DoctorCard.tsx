// components/DoctorCard.tsx

import type { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  showProfileButton?: boolean;
}

export function DoctorCard({ doctor, showProfileButton = false }: DoctorCardProps) {
  return (
    <article
      className="
        group
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
        hover:-translate-y-1 
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]
        cursor-pointer
      "
    >
      {/* Верх: аватар + имя/роль */}
      <div className="flex gap-3 mb-2">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white font-semibold text-sm md:text-lg">
          {doctor.initials}
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">{doctor.name}</div>
          <div className="text-[12px] text-slate-500">{doctor.role}</div>
        </div>
      </div>

      {/* Основные компетенции */}
      <div className="text-[12px] text-slate-600 mb-2">
        {doctor.servicesShort}
      </div>

      {/* Теги */}
      <div className="flex flex-wrap gap-1 mb-3">
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

      {/* Доп. информация */}
      <div className="mt-auto text-[11px] text-slate-500 space-y-0.5">
        <div className="font-medium text-slate-600">{doctor.experienceLabel}</div>
        <div>
          <span className="text-slate-400">Формат: </span>
          {doctor.format.join(", ")}
        </div>
        <div>
          <span className="text-slate-400">Пациенты: </span>
          {doctor.species.join(", ")}
        </div>
      </div>

      {/* Кнопка по центру внизу */}
      <div className="pt-3 flex justify-center">
        <button
          type="button"
          className="
            px-4 
            py-1.5 
            rounded-full 
            bg-onlyvet-coral 
            text-white 
            text-[11px] 
            font-medium 
            shadow-[0_10px_24px_rgba(247,118,92,0.45)]
            group-hover:shadow-[0_14px_32px_rgba(247,118,92,0.6)]
            transition-shadow
          "
        >
          {showProfileButton ? "Профиль и запись" : "Записаться"}
        </button>
      </div>
    </article>
  );
}
