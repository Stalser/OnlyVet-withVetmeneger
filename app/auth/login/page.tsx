"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const identifierError = hasSubmitted && !identifier.trim();
  const passwordError = hasSubmitted && !password.trim();

  const isValid =
    identifier.trim().length > 0 &&
    password.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError(null);

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }

      // TODO: когда будут сессии, пользователь будет реально входить
      router.push("/account");
    } catch (err) {
      console.error(err);
      setError("Произошла техническая ошибка. Попробуйте позже.");
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
              / <span className="text-slate-700">Вход</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Вход в личный кабинет
                </h1>
                <p className="text-[13px] text-slate-600">
                  Используйте номер телефона или email и пароль, указанные при
                  регистрации. Позже здесь появится полноценная система входа
                  с сессиями и восстановлением доступа.
                </p>
              </div>

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
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                      passwordError
                        ? "border-rose-400 focus:ring-rose-300"
                        : "border-slate-300 focus:ring-onlyvet-teal/40"
                    }`}
                    placeholder="Ваш пароль"
                  />
                  {passwordError && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      Укажите пароль.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full mt-1 px-4 py-2.5 rounded-full 
                    bg-onlyvet-coral text-white text-[13px] font-medium 
                    shadow-[0_10px_26px_rgба(247,118,92,0.45)]
                    hover:brightness-105 transition
                    disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Вход..." : "Войти"}
                </button>

                <div className="flex flex-col gap-1 text-[12px] text-slate-600 mt-2">
                  <Link
                    href="/auth/forgot"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                  <div>
                    Нет аккаунта?{" "}
                    <Link
                      href="/auth/register"
                      className="text-onlyvet-coral hover:underline"
                    >
                      Зарегистрироваться
                    </Link>
                  </div>
                </div>
              </form>

              <p className="text-[11px] text-slate-500">
                Сейчас эта форма обращается к API <code>/api/auth/login</code>,
                который проверяет телефон/email и пароль. Как только мы
                подключим настоящую БД и сессии, вход будет полностью рабочим.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
