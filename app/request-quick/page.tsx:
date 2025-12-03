// app/request-quick/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const REG_PHONE_DISPLAY = "+7 900 000-00-00";
const REG_PHONE_LINK = "tel:+79000000000";
const TELEGRAM_LINK = "https://t.me/onlyvet_clinic";

export default function QuickRequestPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [preferredChannel, setPreferredChannel] = useState<"phone" | "telegram" | "any">("any");
  const [complaint, setComplaint] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const nameError = hasSubmitted && !name.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const complaintError = hasSubmitted && !complaint.trim();

  const isValid =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    complaint.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      // Используем тот же API /api/booking, но отправляем минимальный набор полей.
      const payload = {
        fullName: name,
        phone,
        email: email || undefined,
        telegram: telegram || undefined,
        petMode: "new" as const,
        petId: undefined,
        petName: undefined,
        petSpecies: undefined,
        petNotes: `Краткая заявка. Предпочитаемый канал: ${
          preferredChannel === "phone"
            ? "телефон"
            : preferredChannel === "telegram"
            ? "Telegram"
            : "любой"
        }`,
        serviceId: undefined,
        doctorId: undefined,
        timeMode: "any" as const,
        preferredDate: undefined,
        preferredTime: undefined,
        vmSlotId: undefined,
        complaint,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(
          data?.error || "Не удалось отправить заявку. Попробуйте позже."
        );
        return;
      }

      setServerSuccess(
        "Краткая заявка отправлена. Администратор свяжется с вами, чтобы уточнить детали и оформить полную консультацию."
      );

      // Полностью очищать поля не будем — полезно оставить текст,
      // но можем немного сбросить форму.
      // setName("");
      // setPhone("");
      // setEmail("");
      // setTelegram("");
      // setComplaint("");
    } catch (err) {
      console.error(err);
      setServerError("Произошла техническая ошибка. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/booking" className="hover:text-onlyvet-coral">
              Записаться на консультацию
            </Link>{" "}
            / <span className="text-slate-700">Краткая заявка</span>
          </nav>

          {/* Заголовок */}
          <section className="space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold">
              Краткая заявка на консультацию
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Если сейчас нет времени заполнять подробную форму — оставьте краткий
              запрос: как связаться и что примерно происходит с питомцем. 
              Администратор перезвонит или напишет и поможет оформить полную заявку.
            </p>
          </section>

          {/* Блок выбора способа связи */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 text-[13px] space-y-2">
            <div className="font-semibold text-[14px]">
              Предпочитаемый способ связи
            </div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <button
                type="button"
                onClick={() => setPreferredChannel("any")}
                className={`px-3 py-1.5 rounded-full border transition ${
                  preferredChannel === "any"
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                }`}
              >
                Любой
              </button>
              <button
                type="button"
                onClick={() => setPreferredChannel("phone")}
                className={`px-3 py-1.5 rounded-full border transition ${
                  preferredChannel === "phone"
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                }`}
              >
                Позвонить
              </button>
              <button
                type="button"
                onClick={() => setPreferredChannel("telegram")}
                className={`px-3 py-1.5 rounded-full border transition ${
                  preferredChannel === "telegram"
                    ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                    : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                }`}
              >
                Написать в Telegram
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px] mt-1">
              <a
                href={REG_PHONE_LINK}
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
              >
                Позвонить прямо сейчас: {REG_PHONE_DISPLAY}
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
              >
                Написать в Telegram
              </a>
            </div>
          </section>

          {/* Краткая форма */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-5 text-[13px]"
          >
            {serverSuccess && (
              <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2">
                {serverSuccess}
              </div>
            )}
            {serverError && (
              <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
                {serverError}
              </div>
            )}

            {/* Контакты */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Контактные данные</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Как к вам обращаться<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                      nameError
                        ? "border-rose-400 focus:ring-rose-300"
                        : "border-slate-300 focus:ring-onlyvet-teal/40"
                    }`}
                    placeholder="Имя и, при желании, фамилия"
                  />
                  {nameError && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      Укажите, как к вам обращаться.
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Телефон<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                        phoneError
                          ? "border-rose-400 focus:ring-rose-300"
                          : "border-slate-300 focus:ring-onlyvet-teal/40"
                      }`}
                      placeholder="+7 ..."
                    />
                    {phoneError && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Телефон нужен, чтобы мы могли связаться с вами.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="example@mail.ru (необязательно)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="@username (если есть)"
                  />
                </div>
              </div>
            </section>

            {/* Кратко о ситуации */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Кратко о ситуации<span className="text-red-500">*</span>
              </h2>
              <p className="text-[12px] text-slate-600">
                Опишите в свободной форме: что происходит с питомцем, сколько
                времени, что уже делали. Можно писать коротко — администратор
                уточнит детали при звонке.
              </p>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: кот последние 3 дня отказывается от еды, эпизодическая рвота, есть анализы за прошлую неделю…"
              />
              {complaintError && (
                <p className="text-[11px] text-rose-600">
                  Напишите хотя бы пару предложений о проблеме.
                </p>
              )}
            </section>

            {/* Согласие */}
            <section className="space-y-2 text-[12px] text-slate-600">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={consentPersonalData}
                  onChange={(e) => setConsentPersonalData(e.target.checked)}
                  className="mt-[2px]"
                />
                <span>
                  Я даю{" "}
                  <Link
                    href="/docs/privacy"
                    className="text-onlyvet-coral underline-offset-2 hover:underline"
                  >
                    согласие на обработку персональных данных
                  </Link>{" "}
                  и понимаю, что это предварительный запрос, а не
                  полноценная консультация.
                </span>
              </label>
              {consentsError && (
                <p className="text-[11px] text-rose-600">
                  Для отправки заявки необходимо отметить согласие.
                </p>
              )}
            </section>

            <div className="pt-1">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`
                  w-full px-4 py-2.5 rounded-full text-[13px] font-medium
                  ${
                    !isValid || isSubmitting
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-onlyvet-coral text-white shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
                  }
                `}
              >
                {isSubmitting
                  ? "Отправляем заявку…"
                  : "Отправить краткую заявку"}
              </button>
              <p className="mt-2 text-[11px] text-slate-500">
                Если вам удобнее, вы всегда можете{" "}
                <Link
                  href="/booking"
                  className="text-onlyvet-coral hover:underline"
                >
                  заполнить подробную онлайн-заявку
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
