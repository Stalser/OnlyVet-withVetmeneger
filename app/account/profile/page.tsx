// app/account/profile/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

// Временный демо-пользователь.
// Потом эти данные нужно будет подставлять из реальной БД / auth-сессии.
const demoUser = {
  lastName: "Иванов",
  firstName: "Иван",
  middleName: "Иванович",
  phone: "+7 900 000-00-00",
  email: "ivanov@example.com",
  telegram: "@ivanov",
  preferTelegram: true,
};

export default function ProfilePage() {
  const [lastName, setLastName] = useState(demoUser.lastName);
  const [firstName, setFirstName] = useState(demoUser.firstName);
  const [middleName, setMiddleName] = useState(demoUser.middleName);
  const [phone, setPhone] = useState(demoUser.phone);
  const [email, setEmail] = useState(demoUser.email);
  const [telegram, setTelegram] = useState(demoUser.telegram);
  const [preferTelegram, setPreferTelegram] = useState(
    demoUser.preferTelegram
  );
  const [notifyConsultations, setNotifyConsultations] = useState(true);
  const [notifyInfo, setNotifyInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В демо-режиме просто логируем.
    console.log("Profile save (demo):", {
      lastName,
      firstName,
      middleName,
      phone,
      email,
      telegram,
      preferTelegram,
      notifyConsultations,
      notifyInfo,
    });
    alert("Изменения профиля сохранены (демо-режим, без записи в БД).");
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Настройки профиля</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Настройки профиля
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl">
                  Здесь будут редактироваться ваши контактные данные и
                  предпочтительный способ связи. Сейчас форма работает в
                  демонстрационном режиме, без записи в реальную БД.
                </p>
              </div>
              <AccountNav />
            </div>
          </div>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
              {/* ФИО */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Иванов"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Иван"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Отчество
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Иванович"
                  />
                </div>
              </div>

              {/* Контакты */}
              <div className="grid md:grid-cols-2 gap-4">
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="example@mail.ru"
                  />
                </div>
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1">
                  Логин Telegram
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  placeholder="@username"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  При наличии нам проще и быстрее связываться через Telegram
                  (например, для оперативных вопросов по консультации).
                </p>
              </div>

              {/* Предпочтительный способ связи */}
              <div className="space-y-2 text-[12px] text-slate-600">
                <div className="font-semibold text-[13px] text-onlyvet-navy">
                  Предпочтительный способ связи
                </div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="preferredContact"
                    checked={preferTelegram}
                    onChange={() => setPreferTelegram(true)}
                    className="rounded-full border-slate-300"
                  />
                  <span>Telegram</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="preferredContact"
                    checked={!preferTelegram}
                    onChange={() => setPreferTelegram(false)}
                    className="rounded-full border-slate-300"
                  />
                  <span>Телефон / звонок</span>
                </label>
              </div>

              {/* Согласия и уведомления */}
              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="font-semibold text-[12px] text-onlyvet-navy">
                  Уведомления
                </div>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={notifyConsultations}
                    onChange={(e) => setNotifyConsultations(e.target.checked)}
                    className="mt-[2px]"
                  />
                  <span>
                    Получать уведомления о консультациях, изменении времени и
                    комментариях врача.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={notifyInfo}
                    onChange={(e) => setNotifyInfo(e.target.checked)}
                    className="mt-[2px]"
                  />
                  <span>
                    Получать редкие (не чаще раза в месяц) информационные
                    письма OnlyVet: статьи, новости сервиса, важные изменения.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    // сброс к демо-значениям
                    setLastName(demoUser.lastName);
                    setFirstName(demoUser.firstName);
                    setMiddleName(demoUser.middleName);
                    setPhone(demoUser.phone);
                    setEmail(demoUser.email);
                    setTelegram(demoUser.telegram);
                    setPreferTelegram(demoUser.preferTelegram);
                    setNotifyConsultations(true);
                    setNotifyInfo(false);
                  }}
                  className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  Сбросить изменения
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
