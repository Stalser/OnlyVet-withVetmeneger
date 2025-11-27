// components/DoctorCard.tsx

import Link from "next/link";
import type { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  // showProfileButton оставим на будущее, но сейчас не используем
  showProfileButton?: boolean;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article
      className="
        group
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
        hover:-translate-y-[3px] 
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]
        cursor-pointer
      "
    >
      {/* Верх: аватар + имя + краткая роль */}
      <div className="flex gap-3 mb-2">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white font-semibold text-sm md:text-lg">
          {doctor.initials}
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">{doctor.name}</div>
          <div className="text-[12px] text-slate-500">{doctor.role}</div>
        </div>
      </div>

      {/* Фокус врача */}
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

      {/* Доп. информация — только опыт */}
      <div className="mt-auto text-[11px] text-slate-600 mb-2">
        {doctor.experienceLabel}
      </div>

      {/* Кнопки внизу */}
      <div className="pt-1 flex justify-center gap-2">
        {/* Записаться → /booking?doctorId=... */}
        <Link
          href={`/booking?doctorId=${doctor.id}`}
          className="
            px-4 
            py-1.5 
            rounded-full 
            bg-onlyvet-coral 
            text-white 
            text-[11px] 
            font-medium 
            shadow-[0_10px_24px_rgba(247,118,92,0.45)]
            transition
            group-hover:shadow-[0_14px_32px_rgba(247,118,92,0.65)]
            hover:brightness-110
            inline-flex items-center justify-center
          "
        >
          Записаться
        </Link>

        {/* Подробнее → /doctors/[id] */}
        <Link
          href={`/doctors/${doctor.id}`}
          className="
            px-4 
            py-1.5 
            rounded-full 
            border border-slate-300
            text-[11px] 
            font-medium 
            text-onlyvet-navy
            bg-white
            hover:bg-slate-50
            transition
            inline-flex items-center justify-center
          "
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
