"use client";

import Link from "next/link";

type BookingSummarySectionProps = {
  selectedService?: {
    id: string;
    name: string;
    priceLabel?: string;
  } | null;

  selectedDoctor?: {
    id: string;
    name: string;
    role: string;
  } | null;

  selectedSlotLabel?: string | null;

  resetSelection: () => void;
  resetSlot: () => void;
};

export function BookingSummarySection({
  selectedService,
  selectedDoctor,
  selectedSlotLabel,
  resetSelection,
  resetSlot,
}: BookingSummarySectionProps) {
  if (!selectedService && !selectedDoctor && !selectedSlotLabel) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-[15px] font-semibold">Вы выбрали</h2>

      <div className="bg-onlyvet-bg rounded-3xl border border-slate-200 p-4
                      flex flex-col md:flex-row md:items-center md:justify-between
                      gap-3 text-[13px] text-slate-700">

        <div className="space-y-1">

          {selectedService && (
            <div>
              Услуга:{" "}
              <Link
                href={`/services/${selectedService.id}`}
                className="font-medium text-onlyvet-navy hover:text-onlyvet-coral"
              >
                {selectedService.name}
              </Link>
              {selectedService.priceLabel && (
                <span className="text-[12px] text-slate-500">
                  {" "}· {selectedService.priceLabel}
                </span>
              )}
            </div>
          )}

          {selectedDoctor && (
            <div>
              Врач:{" "}
              <Link
                href={`/doctors/${selectedDoctor.id}`}
                className="font-medium text-onlyvet-navy hover:text-onlyvet-coral"
              >
                {selectedDoctor.name}
              </Link>
              <span className="text-[12px] text-slate-500">
                {" "}· {selectedDoctor.role}
              </span>
            </div>
          )}

          {selectedSlotLabel && (
            <div>
              Время:{" "}
              <span className="font-medium text-onlyvet-navy">
                {selectedSlotLabel}
              </span>
            </div>
          )}

        </div>

        <div className="flex flex-wrap gap-2 text-[12px]">
          {selectedSlotLabel && (
            <button
              type="button"
              onClick={resetSlot}
              className="px-3 py-1.5 rounded-full border border-slate-300 bg-white
                         text-slate-700 hover:bg-slate-50 transition"
            >
              Изменить время
            </button>
          )}

          <button
            type="button"
            onClick={resetSelection}
            className="px-3 py-1.5 rounded-full border border-slate-300 bg-white
                       text-slate-700 hover:bg-slate-50 transition"
          >
            Сбросить выбор
          </button>
        </div>

      </div>
    </section>
  );
}
