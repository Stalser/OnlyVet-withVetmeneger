// app/auth/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getSupabaseClient } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = hasSubmitted && !email.trim();
  const passwordError = hasSubmitted && password.trim().length === 0;

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError(null);

    if (!isValid || loading) return;

    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

      if (authError) {
        setError(authError.message || "Ошибка входа. Проверьте данные.");
        return;
      }

      if (!data.session) {
        setError("Не удалось войти. Попробуйте ещё раз.");
        return;
      }

      router.push("/account");
    } catch (err) {
      console.error(err);
      setError("Произошла ошибка. Попробуйте позже.");
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

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">Вход</h1>
                <p className="text-[13px] text-slate-600">
                  Используйте email и пароль, указанные при регистрации.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                      emailError
                        ? "border-rose-400 focus:ring-rose-300"
                        : "border-slate-300 focus:ring-onlyvet-teal/40"
                    }`}
                    placeholder="example@mail.ru"
                  />
                  {emailError && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      Укажите email.
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
                    <p className="text-[11px] text-rose-600 mt-1">
                      Укажите пароль.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="
                    w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white 
                    text-[13px] font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                    hover:brightness-105 transition
                    disabled:bg-slate-300 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Входим..." : "Войти"}
                </button>

                <div className="flex flex-col gap-1 text-[12px] text-slate-600">
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
