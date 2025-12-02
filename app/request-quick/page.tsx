// app/request-quick/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// те же контакты, что и на /booking
const REG_PHONE_DISPLAY = "+7 900 000-00-00";
const REG_PHONE_LINK = "tel:+79000000000";
const TELEGRAM_LINK = "https://t.me/onlyvet_clinic";

export default function QuickRequestPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");

  const [consentPersonal, setConsentPersonal] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const phoneError = hasSubmitted && !phone.trim();
  const consentsError =
    hasSubmitted && (!consentPersonal || !consentRules);

  const isValid =
    phone.trim().length > 0 && consentPersonal && consentRules;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: name || undefined,
        phone,
        telegram: telegram || undefined,
        message: message || undefined,
      };

      const res = await fetch("/api/request-quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(
          data?.error ||
            "Не удалось отправить короткую заявку. Попробуйте позже."
        );
        return;
      }

      setServerSuccess(
        "Короткая заявка отправлена. Администратор свяжется с вами для уточнения деталей."
      );
      setName("");
      setPhone("");
      setTelegram("");
      setMessage("");
      setConsentPersonal(false);
      setConsentRules(false);
      setHasSubmitted(false);
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
          <div className="w-full max-w-xl space-y-5">
            {/* Хлебные крошки */}
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              / <span className="text-slate-700">Краткая заявка</span>
            </nav>

            {/* Заголовок */}
            <section className="space-y-2">
              <h1 className="text-xl md:text-2xl font-semibold">
                Краткая заявка на консультацию
              </h1>
              <p className="text-[13px] text-slate-600">
                Если нет времени заполнять подробную форму, оставьте короткую
                заявку: контакт и пару строк о проблеме. Администратор
                перезвонит, задаст нужные вопросы и оформит полную заявку за
                вас.
              </p>
            </section>

            {/* Альтернативные способы — телефон / Telegram */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-2 text-[13px]">
              <div className="font-semibold text-[14px]">
                Другие способы записи
              </div>
              <p className="text-slate-600">
                Можно записаться любым удобным способом:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a
                  href={REG_PHONE_LINK}
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] hover:bg-slate-50 transition"
                >
                  Позвонить регистратору: {REG_PHONE_DISPLAY}
                </a>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] hover:bg-slate-50 transition"
                >
                  Написать в Telegram
                </a>
              </div>
            </section>

            {/* Форма */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-4">
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

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Как к вам обращаться
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="Например: Екатерина"
                    />
                  </div>
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
                        Укажите номер телефона, чтобы мы могли связаться с вами.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Telegram (если удобнее)
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="@username (необязательно)"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Коротко о проблеме
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Например: кот, 2 года, рвота и снижение аппетита последние 3 дня..."
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Это поле не обязательно, но помогает быстрее сориентироваться.
                  </p>
                </div>

                {/* Согласия */}
                <div className="space-y-2 text-[12px] text-slate-600">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consentPersonal}
                      onChange={(e) => setConsentPersonal(e.target.checked)}
                      className="mt-[2px]"
                    />
                    <span>
                      Я даю{" "}
                      <Link
                        href="/docs/privacy"
                        className="text-onlyvet-coral underline-offset-2 hover:underline"
                      >
                        согласие на обработку персональных данных
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consentRules}
                      onChange={(e) => setConsentRules(e.target.checked)}
                      className="mt-[2px]"
                    />
                    <span>
                      Я ознакомлен(а) и согласен(на) с{" "}
                      <Link
                        href="/docs/rules"
                        className="text-onlyvet-coral underline-offset-2 hover:underline"
                      >
                        правилами онлайн-клиники
                      </Link>
                      .
                    </span>
                  </label>
                  {consentsError && (
                    <p className="text-[11px] text-rose-600">
                      Для отправки заявки необходимо отметить согласия.
                    </p>
                  )}
                </div>

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
                    ? "Отправляем заявку..."
                    : "Отправить короткую заявку"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
