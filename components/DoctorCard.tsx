import type { Doctor } from "@/data/doctors";

interface Props {
  doctor: Doctor;
  showProfileButton?: boolean;
}

export function DoctorCard({ doctor, showProfileButton = false }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 flex flex-col gap-3 min-h-[220px]">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white font-semibold text-lg">
          {doctor.initials}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{doctor.name}</div>
          <div className="text-[12px] text-slate-500 mb-1">{doctor.role}</div>
          <div className="text-[12px] text-onlyvet-navy mb-1">
            {doctor.services}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {doctor.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-[2px] rounded-full text-[11px] ${
                  tag.toLowerCase().includes("консилиум")
                    ? "bg-teal-50 text-onlyvet-navy"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between text-[12px] text-slate-500">
        <span>{doctor.experienceLabel}</span>
        <button className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[11px] font-medium">
          {showProfileButton ? "Профиль и запись" : "Записаться"}
        </button>
      </div>
    </article>
  );
}
