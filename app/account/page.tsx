// app/account/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AccountDashboardPage() {
  // Моки — потом заменятся реальными данными ЛК
  const user = {
    name: "Иванов Иван Иванович",
    phone: "+7 900 000-00-00",
    telegram: "@ivanov",
  };

  const stats = {
    pets: 2,
    requests: 3,
    active: 1,
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
              / <span className="text-slate-700">Личный кабинет</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Личный кабинет
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь будут собраны ваши питомцы, консультации и настройки
              профиля. Сейчас это демонстрационная версия интерфейса.
            </p>
          </div>

          {/* Карточка пользователя + быстрые действия */}
          <section className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3">
              <div>
                <div className="text-[12px] text-slate-500 mb-1">
                  Профиль владельца
                </div>
                <div className="text-[15px] font-semibold">{user.name}</div>
                <div className="text-[13px] text-slate-600">
                  Телефон: {user.phone}
                </div>
                <div className="text-[13px] text-slate-600">
                  Telegram: {user.telegram}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[12px] mt-1">
                <Link
                  href="/account/profile"
                  className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  Редактировать профиль
                </Link>
                <Link
                  href="/booking"
                  className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgба(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 text-[13px]">
              <div className="text-[12px] text-slate-500 mb-1">
                Сводка по аккаунту
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Питомцы</span>
                <span className="font-semibold text-onlyvet-navy">
                  {stats.pets}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Всего консультаций</span>
                <span className="font-semibold text-onlyvet-navy">
                  {stats.requests}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Активные заявки</span>
                <span className="font-semibold text-onlyvet-navy">
                  {stats.active}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Данные приведены как пример. В боевой версии здесь будут
                отображаться реальные консультации и питомцы.
              </p>
            </div>
          </section>

          {/* Быстрые разделы */}
          <section className="grid gap-4 md:grid-cols-3">
            <Link
              href="/account/pets"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold mb-1">
                Питомцы
              </div>
              <p className="text-[12px] text-slate-600">
                Список ваших питомцев, их карточки и история обращений.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Открыть раздел →
              </span>
            </Link>

            <Link
              href="/account/requests"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold mb-1">
                Консультации и заявки
              </div>
              <p className="text-[12px] text-slate-600">
                Журнал онлайн-консультаций и статусы заявок.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Смотреть историю →
              </span>
            </Link>

            <Link
              href="/account/profile"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold mb-1">
                Настройки профиля
              </div>
              <p className="text-[12px] text-slate-600">
                Контактные данные, предпочтительный способ связи и согласия.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Перейти к настройкам →
              </span>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
