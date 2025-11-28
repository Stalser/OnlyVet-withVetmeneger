// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Заглушка — здесь потом будет реальный submit на backend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Здесь будет реальный вход по телефону и паролю.");
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
                  Используйте номер телефона и пароль, которые вы указали при
                  регистрации. Позже здесь появится полноценная система входа.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="+7 ..."
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Ваш пароль"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-1 px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Войти
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
                В демонстрационной версии вход не привязан к реальной базе
                данных. Позже здесь появится полноценная авторизация с
                проверкой пароля, восстановлением и т.д.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
