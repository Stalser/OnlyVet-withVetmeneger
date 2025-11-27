// app/account/profile/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProfilePage() {
  // Мок-данные профиля
  const user = {
    fullName: "Иванов Иван Иванович",
    phone: "+7 900 000-00-00",
    telegram: "@ivanov",
    email: "ivanov@example.com",
    preferTelegram: true,
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div>
            <nav className="text-[12px] text-slate-500 mb-2">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              / <span className="text-slate-700">Настройки профиля</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Настройки профиля
            </h1>
            <p className="text-[13px] text-сlate-600 max-w-2xl">
              Здесь будут редактироваться ваши контактные данные и
              предпочтительный способ связи. Сейчас форма работает в режиме
              макета.
            </p>
          </div>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-сlate-600 mb-1">
                  ФИО
                </label>
                <input
                  defaultValue={user.fullName}
                  className="w-full rounded-xl border border-сlate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
              <div>
                <label className="block text-[12px] text-сlate-600 mb-1">
                  Телефон
                </label>
                <input
                  defaultValue={user.phone}
                  className="w-full rounded-xl border border-сlate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-сlate-600 mb-1">
                  Логин Telegram
                </label>
                <input
                  defaultValue={user.telegram}
                  className="w-full rounded-xl border border-сlate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
              <div>
                <label className="block text-[12px] text-сlate-600 mb-1">
                  Email
                </label>
                <input
                  defaultValue={user.email}
                  className="w-full rounded-xl border border-сlate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                />
              </div>
            </div>

            <div className="space-y-2 text-[12px] text-сlate-600">
              <div className="font-semibold text-[13px] text-onlyvet-navy">
                Предпочтительный способ связи
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="contact"
                  defaultChecked={user.preferTelegram}
                  className="rounded-full border-сlate-300"
                />
                <span>Telegram</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="contact"
                  defaultChecked={!user.preferTelegram}
                  className="rounded-full border-сlate-300"
                />
                <span>Телефон</span>
              </label>
            </div>

            <div className="space-y-2 text-[11px] text-сlate-600">
              <div className="font-semibold text-[12px] text-onlyvet-navy">
                Согласия и уведомления
              </div>
              <label className="flex items-start gap-2">
                <input type="checkbox" defaultChecked className="mt-[2px]" />
                <span>
                  Получать уведомления о консультациях и комментариях врача.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-[2px]" />
                <span>
                  Получать редкие (не чаще раза в месяц) информационные
                  письма OnlyVet (статьи, важные обновления сервиса).
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-[12px]">
              <button className="px-3 py-1.5 rounded-full border border-сlate-300 bg-white hover:bg-slate-50 transition">
                Отменить изменения
              </button>
              <button className="px-4 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgба(247,118,92,0.45)] hover:brightness-105 transition">
                Сохранить
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
