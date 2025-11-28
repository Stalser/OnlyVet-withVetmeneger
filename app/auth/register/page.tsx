"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          fullName,
          password,
          password2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      // Здесь можно сразу логинить, но пока просто шлём на страницу входа
      router.push("/auth/login");
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
              / <span className="text-slate-700">Регистрация</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Регистрация в OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600">
                  Личный кабинет позволит вам видеть заявки, историю
                  консультаций и питомцев. Сейчас это каркас — позже он будет
                  связан с реальной базой данных и Vetmanager.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    ФИО
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Например: Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Телефон (логин)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="+7 ..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    В будущем по этому номеру будет выполняться вход в личный
                    кабинет.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="Не короче 8 символов"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Повтор пароля
                    </label>
                    <input
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="Повторите пароль"
                    />
                  </div>
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
                    shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                    hover:brightness-105 transition
                    disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>

                <div className="text-[12px] text-slate-600 mt-2">
                  Уже есть аккаунт?{" "}
                  <Link
                    href="/auth/login"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Войти
                  </Link>
                </div>
              </form>

              <p className="text-[11px] text-slate-500">
                В демонстрационном режиме эта форма отправляет данные на
                внутренний API `/api/auth/register`. Позже этот API будет
                создавать реального пользователя в базе данных и связывать его
                с клиентом в Vetmanager.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
