"use client";

type Service = {
  id: string;
  name: string;
  category: string;
  shortDescription?: string;
};

type BookingServiceSectionProps = {
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  availableServices: Service[];
  selectedService?: Service;
};

export function BookingServiceSection({
  selectedServiceId,
  setSelectedServiceId,
  availableServices,
  selectedService,
}: BookingServiceSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Услуга</h2>

      <div className="space-y-2">
        <label className="block text-[12px] text-slate-600 mb-1">
          Выберите услугу
        </label>

        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
                     focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
        >
          <option value="">Не знаю / нужна помощь с выбором</option>

          <optgroup label="Консультации">
            {availableServices
              .filter((s) => s.category === "консультация")
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </optgroup>

          <optgroup label="Второе мнение">
            {availableServices
              .filter((s) => s.category === "второе мнение")
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </optgroup>

          <optgroup label="Диагностика">
            {availableServices
              .filter((s) => s.category === "диагностика")
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </optgroup>

          <optgroup label="Сопровождение">
            {availableServices
              .filter((s) => s.category === "сопровождение")
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </optgroup>
        </select>

        {selectedService ? (
          <p className="mt-1 text-[11px] text-slate-500">
            Фокус услуги: {selectedService.shortDescription}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-500">
            Если вы не уверены — оставьте «Не знаю». Администратор подберёт
            подходящий формат.
          </p>
        )}
      </div>
    </section>
  );
}
