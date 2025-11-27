// components/ReviewModal.tsx

"use client";

import { useState } from "react";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

export function ReviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [petName, setPetName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);

  if (!open) return null;

  const isValid = text.trim().length > 0 && consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Здесь будет отправка на backend / модерацию
    console.log("Новый отзыв (на модерации):", {
      clientName,
      petName,
      doctorId,
      serviceId,
      rating,
      text,
    });

    alert(
      "Спасибо! Ваш отзыв отправлен на модерацию и появится на сайте после проверки."
    );

    setClientName("");
    setPetName("");
    setDoctorId("");
    setServiceId("");
    setRating(5);
    setText("");
    setConsent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-3">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.7)]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-semibold">Оставить отзыв</h2>
            <p className="text-[12px] text-slate-500">
              Отзыв не публикуется автоматически — сначала мы проверяем его на
              корректность (по форме, а не по сути).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 text-[18px] hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Ваше имя
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Можно указать только имя или инициалы"
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Питомец
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Кличка, вид"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Врач (если хотите)
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                <option value="">Не указывать</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Услуга
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">Не указывать</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Оценка
            </label>
            <select
              className="rounded-xl border border-slate-300 px-3 py-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} / 5
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Отзыв *
            </label>
            <textarea
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите, что было полезно, как прошла консультация, что изменилось…"
            />
          </div>

          <label className="flex items-start gap-2 text-[11px] text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-[2px]"
            />
            <span>
              Я согласен на обработку персональных данных и понимаю, что отзыв
              будет опубликован только после проверки модератором.
            </span>
          </label>

          <div className="pt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[12px]"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 rounded-full text-[12px] ${
                isValid
                  ? "bg-onlyvet-coral text-white shadow-lg"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              Отправить отзыв
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
