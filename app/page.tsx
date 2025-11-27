"use client";

import { useMemo, useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCard } from "@/components/ReviewCard";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { reviews } from "@/data/reviews";

type HomeSpecFilter = "all" | "терапия" | "диагностика" | "эксперт" | "онкология";

export default function HomePage() {
  const [specFilter, setSpecFilter] = useState<HomeSpecFilter>("all");

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doc) =>
        specFilter === "all" ? true : doc.specialization === specFilter
      ),
    [specFilter]
  );

  const mainDoctors = filteredDoctors.slice(0, 4);
  const mainServices = services.slice(0, 3);
  const mainReviews = reviews.slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-onlyvet-navy text-white py-10 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl px-4 grid md:grid-cols-[1.4fr,1.1fr] gap-10 items-center">
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-onlyvet-teal mb-3">
                Цифровая ветеринария OnlyVet
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-3">
                Экспертная помощь питомцу, когда ваша клиника — онлайн.
              </h1>
              <p className="text-sm md:text-base text-slate-200 mb-4 max-w-xl">
                Онлайн-консультации, второе мнение, разбор анализов и
                сопровождение сложных случаев — без поездок и суеты.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <button className="px-4 py-2 rounded-full bg-onlyvet-coral text-xs font-medium shadow-[0_14px_36px_rgba(247,118,92,0.45)]">
                  Записаться на консультацию
                </button>
                <button className="px-4 py-2 rounded-full border border-slate-500 text-xs">
                  Войти в личный кабинет
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] text-slate-200">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Врачи с клиническим опытом
                </span>
                <span>Фокус на доказательной медицине</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[26px] bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy p-1.5 shadow-hero">
                <div
                  className="rounded-[22px] min-h-[220px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/img/hero.jpg')",
                  }}
                />
              </div>
              <div className="absolute -bottom-3 left-4 bg-slate-900/90 border border-slate-500 rounded-full px-3 py-1 text-[11px] text-slate-100">
                Спокойный онлайн-приём, где врач действительно читает ваши
                анализы.
              </div>
            </div>
          </div>
        </section>

        {/* Почему OnlyVet */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Почему OnlyVet
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  Клиника, где на первом месте — доказательная медицина,
                  спокойная коммуникация с владельцем и чёткий план лечения.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-4">
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Доказательная медицина
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Решения опираются на исследования, протоколы и опыт разбора
                    сложных случаев.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Онлайн без хаоса
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Чёткая структура приёма, документы и план в личном
                    кабинете.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Сложные пациенты
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Онкология, хронические заболевания, неясные диагнозы —
                    наша зона ответственности.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Этика и прозрачность
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Объясняем варианты, риски и прогноз без паники и лишнего
                    давления.
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Врачи */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            {/* Заголовок + большая кнопка */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Врачи OnlyVet
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — несколько специалистов. Полный список с фильтрами
                  доступен на странице «Все врачи».
                </p>
              </div>
              <a
                href="/doctors"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
              >
                Все врачи
                <span className="text-[16px] leading-none">→</span>
              </a>
            </div>

            {/* Фильтр по специализации */}
            <div className="flex flex-wrap items-center gap-2 text-[12px] mb-4">
              <span className="text-slate-500 mr-1">
                Фильтр по специализации:
              </span>
              {[
                { key: "all", label: "Все" },
                { key: "терапия", label: "Терапия" },
                { key: "эксперт", label: "Эксперт / консилиум" },
                { key: "диагностика", label: "Диагностика" },
                { key: "онкология", label: "Онкология" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setSpecFilter(btn.key as HomeSpecFilter)}
                  className={`px-3 py-1.5 rounded-full border transition text-xs ${
                    specFilter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Сетка карточек */}
            <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
              {mainDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>

            {/* Кнопка "Все врачи" для мобильной версии */}
            <div className="mt-4 sm:hidden">
              <a
                href="/doctors"
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
              >
                Все врачи
                <span className="ml-2 text-[16px] leading-none">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Услуги */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Услуги</h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — основные направления. Отдельная страница «Все
                  услуги» будет с фильтрами и подробным описанием.
                </p>
              </div>
              <a
                href="/services"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все услуги →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Отзывы</h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — несколько свежих отзывов. Все истории будут на
                  отдельной странице.
                </p>
              </div>
              <a
                href="/reviews"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все отзывы →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>

        {/* Соцсети */}
        <section className="py-10 bg-gradient-to-b from-transparent to-slate-50/70">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Мы в социальных сетях
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  Подписывайтесь на OnlyVet — делимся историями пациентов,
                  разбираем анализы и публикуем полезные рекомендации.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
              {/* ВКонтакте */}
              <a
                href="#"
                className="bg-white rounded-3xl border border-slate-200/80 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/70 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                  <img
                    src="/img/free-icon-vk-3670055.svg"
                    alt="ВКонтакте"
                    className="w-9 h-9"
                  />
                </div>
                <div className="text-[14px] font-semibold">ВКонтакте</div>
                <p className="text-[12px] text-slate-600">
                  Новости, подсказки и разборы анализов.
                </p>
              </a>

              {/* Telegram */}
              <a
                href="#"
                className="bg-white rounded-3xl border border-slate-200/80 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/70 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                  <img
                    src="/img/free-icon-telegram-2111646.svg"
                    alt="Telegram"
                    className="w-9 h-9"
                  />
                </div>
                <div className="text-[14px] font-semibold">Telegram</div>
                <p className="text-[12px] text-slate-600">
                  Разборы клинических случаев и ответы на вопросы.
                </p>
              </a>

              {/* Instagram* */}
              <a
                href="#"
                className="bg-white rounded-3xl border border-slate-200/80 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/70 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                  <img
                    src="/img/free-icon-instagram-3955024.svg"
                    alt="Instagram"
                    className="w-9 h-9"
                  />
                </div>
                <div className="text-[14px] font-semibold">Instagram*</div>
                <p className="text-[12px] text-slate-600">
                  Истории пациентов и визуальные советы.
                </p>
              </a>

              {/* Одноклассники */}
              <a
                href="#"
                className="bg-white rounded-3xl border border-slate-200/80 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/70 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                  <img
                    src="/img/free-icon-odnoklassniki-3670250.svg"
                    alt="Одноклассники"
                    className="w-9 h-9"
                  />
                </div>
                <div className="text-[14px] font-semibold">Одноклассники</div>
                <p className="text-[12px] text-slate-600">
                  Полезные советы и материалы.
                </p>
              </a>
            </div>

            <p className="mt-3 text-[10px] text-slate-400 max-w-xl">
              * Instagram принадлежит компании Meta Platforms Inc., деятельность
              которой запрещена на территории Российской Федерации как экстремистская
              организация.
            </p>
          </div>
        </section>

        {/* Обратная связь */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start">
              {/* Левая часть — текст и контакты */}
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold mb-2">
                  Есть вопрос по питомцу или сервису OnlyVet?
                </h2>
                <p className="text-[13px] text-slate-600 mb-3 max-w-md">
                  Напишите нам коротко, что беспокоит, и мы ответим вам на почту
                  или в выбранный мессенджер. Это не заменяет консультацию, но
                  помогает сориентироваться.
                </p>
                <div className="text-[13px] text-slate-600 space-y-1 mb-2">
                  <div>
                    Telegram:{" "}
                    <a href="#" className="text-onlyvet-coral">
                      @onlyvet_clinic
                    </a>
                  </div>
                  <div>
                    Почта:{" "}
                    <a
                      href="mailto:support@onlyvet.ru"
                      className="text-onlyvet-coral"
                    >
                      support@onlyvet.ru
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 max-w-md">
                  В экстренных состояниях (угроза жизни, тяжёлое состояние,
                  судороги, острая одышка и т.п.) необходимо немедленно
                  обращаться в ближайшую круглосуточную ветеринарную клинику.
                </p>
              </div>

              {/* Правая часть — форма */}
              <form className="w-full md:max-w-sm space-y-3">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Как к вам обращаться
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Имя"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Контакт для ответа
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Email или Telegram"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Кратко суть вопроса
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Например: анализы, диагноз, схема лечения..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)]"
                >
                  Отправить запрос
                </button>
                <p className="text-[11px] text-slate-500">
                  Нажимая «Отправить», вы соглашаетесь с обработкой персональных
                  данных и условиями сервиса OnlyVet.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
