"use client";

type RequestKind = "short" | "full";

type BookingComplaintSectionProps = {
  complaint: string;
  setComplaint: (v: string) => void;
  kind: RequestKind;
};

export function BookingComplaintSection({
  complaint,
  setComplaint,
  kind,
}: BookingComplaintSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Кратко о проблеме</h2>
      <p className="text-[12px] text-slate-600">
        Опишите симптомы, длительность, предыдущее лечение и анализы. Это
        поможет врачу подготовиться к консультации.
      </p>
      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        rows={kind === "short" ? 4 : 5}
        className="
          w-full rounded-2xl border border-slate-300 px-3 py-2
          text-[13px] resize-none
          focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
        "
        placeholder="Например: 2 недели периодическая рвота, снижение аппетита, был гастрит, есть анализы крови..."
      />
      <p className="text-[11px] text-slate-500">
        В короткой заявке этот блок особенно важен: по нему врач и администратор
        поймут срочность и подходящий формат.
      </p>
    </section>
  );
}
