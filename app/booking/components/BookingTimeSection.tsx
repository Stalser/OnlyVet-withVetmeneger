"use client";

type TimeMode = "any" | "choose";

type BookingTimeSectionProps = {
  timeMode: TimeMode;
  setTimeMode: (m: TimeMode) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  timeSelectionLocked: boolean;
  selectedSlotLabel?: string | null;
};

export function BookingTimeSection({
  timeMode,
  setTimeMode,
  date,
  setDate,
  time,
  setTime,
  timeSelectionLocked,
  selectedSlotLabel,
}: BookingTimeSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Дата и время</h2>

      {!timeSelectionLocked && (
        <>
          <div className="flex flex-wrap gap-3 text-[12px]">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="timeMode"
                value="any"
                checked={timeMode === "any"}
                onChange={() => setTimeMode("any")}
                className="rounded-full border-slate-300"
              />
              <span>Любое ближайшее время</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="timeMode"
                value="choose"
                checked={timeMode === "choose"}
                onChange={() => setTimeMode("choose")}
                className="rounded-full border-slate-300"
              />
              <span>Выбрать дату и время</span>
            </label>
          </div>

          {timeMode === "choose" && (
            <div className="grid md:grid-cols-[1fr,1fr] gap-4">
              <div>
                <label className="block text-[12px] text-slate-600 mb-1">
                  Дата
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
                             focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
              <div>
                <label className="block text-[12px] text-slate-600 mb-1">
                  Время
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
                             focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
            </div>
          )}
        </>
      )}

      {timeSelectionLocked && selectedSlotLabel && (
        <div className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3 text-[12px] text-slate-600 space-y-1">
          <div className="font-medium text-slate-700">
            Время выбрано: {selectedSlotLabel}
          </div>
          <p className="text-[11px] text-slate-500">
            Если вы хотите изменить дату или время, сначала снимите бронь слота.
          </p>
        </div>
      )}

      <div className="bg-onlyvet-bg rounded-2xl border border-dashed border-slate-300 p-3 text-[11px] text-slate-600 mt-2">
        В реальной версии здесь будут отображаться слоты из Vetmanager.
      </div>
    </section>
  );
}
