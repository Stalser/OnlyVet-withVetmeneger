// app/account/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

export default function AccountDashboardPage() {
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

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Хлебные крошки + заголовок + навигация */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Личный кабинет</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold">
                  Личный кабинет
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь собрана информация о ваших питомцах, консультациях,
                  документах и настройках профиля. Раздел работает в
                  демонстрационном режиме — данные не являются реальными.
                </p>
              </div>

              {/* Навигация ЛК */}
              <AccountNav />
            </div>
          </div>

          {/* Основной блок: профиль + краткая статистика */}
          <section className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
            {/* Профиль */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-wide text-slate-500 mb-1">
                  Профиль владельца
                </div>

                <div className="text-[16px] font-semibold text-slate-900">
                  {user.name}
                </div>

                <div className="text-[13px] text-slate-600 mt-1">
                  Телефон: {user.phone}
                </div>
                <div className="text-[13px] text-slate-600">
                  Telegram: {user.telegram}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[12px]">
                <Link
                  href="/account/profile"
                  className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  Редактировать профиль
                </Link>

                <Link
                  href="/booking"
                  className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            </div>

            {/* Сводка */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2">
              <div className="text-[12px] uppercase tracking-wide text-slate-500 mb-1">
                Сводка аккаунта (демо)
              </div>

              {[
                ["Питомцы", stats.pets],
                ["Всего консультаций", stats.requests],
                ["Активные заявки", stats.active],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[13px]">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-onlyvet-navy">
                    {value as number}
                  </span>
                </div>
              ))}

              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                В реальной версии здесь будет отображаться статистика по вашим
                питомцам и консультациям.
              </p>
            </div>
          </section>

          {/* Быстрые разделы */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* Питомцы */}
            <Link
              href="/account/pets"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="text-[14px] font-semibold">Питомцы</div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Список питомцев, карточки, документы и история обращений.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Открыть раздел →
              </span>
            </Link>

            {/* Консультации */}
            <Link
              href="/account/requests"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="text-[14px] font-semibold">
                Консультации и заявки
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Все консультации, статусы заявок и рекомендации врачей.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Смотреть историю →
              </span>
            </Link>

            {/* Документы */}
            <Link
              href="/account/documents"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="text-[14px] font-semibold">Документы</div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Договоры, акты, счета, чеки и все меддокументы по питомцам.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Перейти к документам →
              </span>
            </Link>
          </section>

          {/* Второй ряд */}
          <section className="grid gap-4 md:grid-cols-2">
            {/* Доверенные лица */}
            <Link
              href="/account/trusted"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="text-[14px] font-semibold">
                Доверенные лица
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Люди, которым вы доверяете доступ к информации и заявкам.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Управлять →
              </span>
            </Link>

            {/* Настройки профиля */}
            <Link
              href="/account/profile"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-2 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="text-[14px] font-semibold">
                Настройки профиля
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Контактные данные, телеграм, почта, уведомления и согласия.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Перейти →
              </span>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
