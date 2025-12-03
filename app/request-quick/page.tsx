// app/request-quick/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const REG_PHONE_DISPLAY = "+7 900 000-00-00";
const REG_PHONE_LINK = "tel:+79000000000";
const TELEGRAM_LINK = "https://t.me/onlyvet_clinic";

type ContactMethod = "phone" | "telegram" | "any";

export default function QuickRequestPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("any");
  const [complaint, setComplaint] = useState("");
  const [consent, setConsent] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const phoneError = hasSubmitted && !phone.trim();
  const consentError = hasSubmitted && !consent;

  const isValid = phone.trim().length > 0 && consent;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      // Пока демо-режим: просто логируем данные.
      console.log("[QUICK REQUEST]", {
        fullName: fullName || undefined,
        phone,
        telegram: telegram || undefined,
        contactMethod,
        complaint: complaint || undefined,
      });

      // TODO: позже отправлять на реальный API,
      // например /api/booking/quick или в общую очередь заявок.
      setServerSuccess(
        "Краткая заявка отправлена. Мы свяжемся с вами по указанным контактам."
      );
      setHasSubmitted(false);
      setFullName("");
      setPhone("");
      setTelegram("");
      setContactMethod("any");
      setComplaint("");
      setConsent(false);
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
        <div className="container mx-auto max-w-5xl px-4 flex justify-center">
          <div className="w-full max-w-lg space-y-5">
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
                Краткая заявка на онлайн-консультацию
              </h1>
              <p className="text-[13px] text-slate-600">
                Если сейчас нет времени заполнять подробную форму, оставьте
                краткую заявку — администратор свяжется с вами, уточнит детали и
                поможет оформить полную запись.
              </p>
            </section>

            {/* Способы связи и телефон */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 text-[13px] text-slate-700 space-y-2">
              <div className="font-semibold text-[14px]">
                Предпочитаете общаться по телефону или в мессенджере?
              </div>
              <p>
                Телефон регистратуры:{" "}
                <a
                  href={REG_PHONE_LINK}
                  className="text-onlyvet-coral hover:underline font-medium"
                >
                  {REG_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                Telegram:{" "}
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="text-onlyvet-coral hover:underline font-medium"
                >
                  @onlyvet_clinic
                </a>
              </p>
            </section>

            {/* Форма */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
                {/* Сообщения */}
                {serverSuccess && (
                  <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2 mb-1">
                    {serverSuccess}
                  </div>
                )}
                {serverError && (
                  <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2 mb-1">
                    {serverError}
                  </div>
                )}

                {/* Имя + телефон */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Как к вам обращаться
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="Например: Екатерина, владелец кота Локи"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Номер телефона<span className="text-red-500">*</span>
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
                        Укажите телефон, чтобы мы могли связаться с вами.
                      </p>
                    )}
                  </div>
                </div>

                {/* Telegram + предпочтительный способ связи */}
                <div className="space-y-2">
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Telegram (если есть)
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="@username (необязательно)"
                  />
                  <div className="flex flex-wrap gap-3 text-[12px] mt-1">
                    <span className="text-slate-500 mr-1">
                      Удобный способ связи:
                    </span>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="any"
                        checked={contactMethod === "any"}
                        onChange={() => setContactMethod("any")}
                        className="rounded-full border-slate-300"
                      />
                      <span>Любой</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={contactMethod === "phone"}
                        onChange={() => setContactMethod("phone")}
                        className="rounded-full border-slate-300"
                      />
                      <span>Телефон</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="telegram"
                        checked={contactMethod === "telegram"}
                        onChange={() => setContactMethod("telegram")}
                        className="rounded-full border-slate-300"
                      />
                      <span>Telegram</span>
                    </label>
                  </div>
                </div>

                {/* Кратко о проблеме */}
                <div className="space-y-1">
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Кратко о ситуации
                  </label>
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Например: кот 2 года, последние 3 дня рвота и снижение аппетита, есть свежие анализы крови…"
                  />
                  <p className="text-[11px] text-slate-500">
                    Не обязательно подробно — администратор всё уточнит при
                    звонке.
                  </p>
                </div>

                {/* Согласие */}
                <div className="space-y-2 text-[12px] text-slate-600">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
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
                      и понимаю, что краткая заявка не заменяет полноценную
                      онлайн-консультацию.
                    </span>
                  </label>
                  {consentError && (
                    <p className="text-[11px] text-rose-600">
                      Для отправки заявки необходимо отметить согласие.
                    </p>
                  )}
                </div>

                {/* Кнопка */}
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
                    {isSubmitting ? "Отправляем заявку..." : "Отправить заявку"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
