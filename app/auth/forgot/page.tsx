"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); // телефон или email
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Укажите телефон или email, который вы использовали при регистрации.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка запроса восстановления.");
        return;
      }

      setSent(true);
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
              / <span className="text-slate-700">Восстановление доступа</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Восстановление доступа
                </h1>
                <p className="text-[13px] text-slate-600">
                  Укажите номер телефона или email, которые вы использовали при
                  регистрации. Мы отправим инструкцию по восстановлению, как
                  только подключим почтовый сервис.
                </p>
              </div>

              {sent ? (
                <div className="space-y-3 text-[13px]">
                  <div className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                    Если в нашей системе есть аккаунт с указанным телефоном или
                    email, мы отправим на него инструкции по восстановлению
                    пароля.
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                  >
                    Вернуться ко входу
                  </button>
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
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="+7 ... или example@mail.ru"
                    />
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
                      w-full px-4 py-2.5 rounded-full 
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

              <p className="text-[11px] text-slate-500">
                Сейчас эта форма работает в демонстрационном режиме и не шлёт
                реальные письма. На следующем этапе мы подключим SMTP или другой
                почтовый сервис и будем отправлять уникальную ссылку для
                восстановления пароля.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
