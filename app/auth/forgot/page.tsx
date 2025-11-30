// app/auth/forgot/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const identifierError = hasSubmitted && !identifier.trim();
  const isValid = identifier.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);

    if (!isValid || loading) return;

    try {
      setLoading(true);

      // Пока это демо: просто имитируем отправку запроса.
      // В будущем здесь будет реальный вызов /api/auth/forgot,
      // который отправит письмо или ссылку в Telegram.
      // Например:
      //
      // const res = await fetch("/api/auth/forgot", { ... })
      // ...

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setServerError("Произошла техническая ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 flex justify-center">
          <div className="w-full max-w-md space-y-4">
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/auth/login" className="hover:text-onlyvet-coral">
                Вход
              </Link>{" "}
              / <span className="text-slate-700">Восстановление доступа</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Восстановление доступа
                </h1>
                <p className="text-[13px] text-slate-600">
                  Если вы забыли пароль, укажите номер телефона или email,
                  которые использовали при регистрации. В дальнейшем здесь
                  появится полноценный сценарий восстановления через почту или
                  код в мессенджере.
                </p>
              </div>

              {submitted ? (
                <div className="space-y-2 text-[13px] text-slate-700">
                  <div className="text-[14px] font-semibold">
                    Запрос на восстановление принят
                  </div>
                  <p>
                    Если указанные данные есть в системе, мы отправим
                    инструкцию по восстановлению доступа на соответствующий
                    канал (email или телефон).
                  </p>
                  <p className="text-[11px] text-slate-500">
                    В демо-версии фактическая отправка письма или кода ещё не
                    реализована. После подключении Supabase/почтового сервиса
                    здесь появится реальный сценарий.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/auth/login"
                      className="text-onlyvet-coral hover:underline text-[12px]"
                    >
                      Вернуться ко входу →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Телефон или email
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                        identifierError
                          ? "border-rose-400 focus:ring-rose-300"
                          : "border-slate-300 focus:ring-onlyvet-teal/40"
                      }`}
                      placeholder="+7 ... или example@mail.ru"
                    />
                    {identifierError && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Укажите телефон или email.
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className="
                      w-full mt-1 px-4 py-2.5 rounded-full 
                      bg-onlyvet-coral text-white text-[13px] font-medium 
                      shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                      hover:brightness-105 transition
                      disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed
                    "
                  >
                    {loading ? "Отправляем..." : "Отправить запрос"}
                  </button>

                  <div className="text-[12px] text-slate-600 mt-2">
                    Вспомнили пароль?{" "}
                    <Link
                      href="/auth/login"
                      className="text-onlyvet-coral hover:underline"
                    >
                      Войти
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
