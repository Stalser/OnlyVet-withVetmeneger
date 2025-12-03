"use client";

type DoctorMode = "auto" | "manual";

type Doctor = {
  id: string;
  name: string;
  role: string;
};

type BookingDoctorSectionProps = {
  doctorMode: DoctorMode;
  setDoctorMode: (mode: DoctorMode) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  availableDoctors: Doctor[];
  selectedDoctor?: Doctor;
};

export function BookingDoctorSection({
  doctorMode,
  setDoctorMode,
  selectedDoctorId,
  setSelectedDoctorId,
  availableDoctors,
  selectedDoctor,
}: BookingDoctorSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Врач</h2>
      <div className="space-y-2">
        <div className="flex flex-col gap-1 text-[12px] mb-1">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="doctorMode"
              value="auto"
              checked={doctorMode === "auto"}
              onChange={() => setDoctorMode("auto")}
              className="rounded-full border-slate-300"
            />
            <span>
              <span className="font-medium">Автоматический подбор врача</span>{" "}
              <span className="text-slate-500">(рекомендуется)</span>
            </span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="doctorMode"
              value="manual"
              checked={doctorMode === "manual"}
              onChange={() => setDoctorMode("manual")}
              className="rounded-full border-slate-300"
            />
            <span className="font-medium">Выбрать врача вручную</span>
          </label>
        </div>

        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          disabled={doctorMode !== "manual"}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
                     disabled:bg-slate-50 disabled:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
        >
          <option value="">Не выбран</option>
          {availableDoctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {doctorMode === "manual" && selectedDoctor && (
          <p className="mt-1 text-[11px] text-slate-500">
            Специализация врача: {selectedDoctor.role}
          </p>
        )}
        {doctorMode === "auto" && (
          <p className="mt-1 text-[11px] text-slate-500">
            Мы подберём врача с нужной специализацией под ваш запрос.
          </p>
        )}
      </div>
    </section>
  );
}
