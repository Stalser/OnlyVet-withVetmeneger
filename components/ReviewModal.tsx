// components/ReviewModal.tsx

"use client";

import { useState } from "react";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReviewModal({ open, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);

  if (!open) return null;

  const isValid = text.trim().length > 0 && rating > 0 && consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Здесь будет отправка на backend / модерацию
    console.log("New review (pending moderation):", {
      name,
      petName,
      doctorId,
      serviceId,
      rating,
      text,
    });

    alert(
      "Спасибо! Ваш отзыв отправлен на модерацию и появится на сайте после проверки."
    );

    // сбросим форму и закроем
    setName("");
    setPetName("");
    setDoctorId("");
    setServiceId("");
    setRating(5);
    setText("");
    setConsent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-2">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.6)]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-[16px] font-semibold">
              Оставить отзыв о консультации
            </h2>
            <p className="text-[12px] text-slate-500">
              Мы публикуем только честные и конструктивные отзывы. Перед
              публикацией отзыв проходит модерацию.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-[18px]"
            aria-label="Закрыть"
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Можно указать только имя или инициалы"
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Питомец
              </label>
              <input
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Кличка, вид"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Врач (если хотите указать)
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
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
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
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
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-32 rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
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
              Текст отзыва<span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              placeholder="Расскажите, что было полезно, как прошла консультация, что изменилось после неё…"
            />
          </div>

          <div className="space-y-2 text-[11px] text-slate-600">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-[2px]"
              />
              <span>
                Я подтверждаю, что отзыв основан на личном опыте, и даю{" "}
                <span className="text-onlyvet-coral">
                  согласие на обработку персональных данных и публикацию отзыва
                  на сайте после модерации
                </span>
                .
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Отзыв не появляется на сайте сразу. Сначала команда OnlyVet
              проверит его на корректность (без цензуры по сути, только по
              форме и безопасности).
            </p>
          </div>

          <div className="pt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-slate-300 text-[12px] text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`
                px-4 py-1.5 rounded-full text-[12px] font-medium
                ${
                  isValid
                    ? "bg-onlyvet-coral text-white shadow-[0_10px_26px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }
              `}
            >
              Отправить отзыв
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
