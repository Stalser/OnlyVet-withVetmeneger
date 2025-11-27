// app/page.tsx

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCard } from "@/components/ReviewCard";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { reviews } from "@/data/reviews";

export default function HomePage() {
  const mainDoctors = doctors.slice(0, 3);
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
                      "url('https://images.pexels.com/photos/6235249/pexels-photo-6235249.jpeg?auto=compress&cs=tinysrgb&w=1200')",
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
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Врачи OnlyVet
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — несколько специалистов. Полный список с фильтрами
                  будет на странице «Все врачи».
                </p>
              </div>
              <a
                href="/doctors"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все врачи →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
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
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Мы в социальных сетях
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  Спокойные, полезные и понятные материалы для владельцев
                  животных: разбор анализов, разбор случаев, рекомендации по
                  уходу.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {/* ВКонтакте */}
              <a
                href="#"
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0077FF] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10.2c0 .8-.9 1.3-1.6.9l-3.1-1.8c-.3-.2-.7-.1-.9.2l-1 1.5a1 1 0 0 1-1.4.3C9.4 16.9 7 13.6 5.7 10.4a1 1 0 0 1 .3-1.2l1.1-.8A1 1 0 0 0 7.4 7H5c-1.1 0-2 .9-2 2V7Z"
                      />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold">ВКонтакте</div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Новости OnlyVet, объяснения анализов и разборы клинических
                  случаев.
                </div>
              </a>

              {/* Telegram */}
              <a
                href="#"
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#27A7E7] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M9.6 15.6 9.4 19c.4 0 .6-.2.8-.4l1.9-1.8 3.9 2.9c.7.4 1.2.2 1.4-.7L20.9 5c.2-.8-.3-1.2-1.1-.9L3.8 11c-.8.3-.8.8-.1 1l4 1.2 9.3-5.7-6.4 8.1Z"
                      />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold">Telegram</div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Канал с разбором сложных пациентов и ответами на частые
                  вопросы.
                </div>
              </a>

              {/* Instagram* */}
              <a
                href="#"
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[12px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="5"
                        ry="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="16.3" cy="7.7" r="0.9" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold">Instagram*</div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Истории пациентов, визуальные подсказки и наглядные схемы.
                </div>
              </a>

              {/* Одноклассники */}
              <a
                href="#"
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F4731C] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 5.2a2 2 0 1 1 0 4.1 2 2 0 0 1 0-4.1Zm0-1.7a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm2.9 8.4a1 1 0 0 0-1.4-.3 5 5 0 0 1-5 0 1 1 0 0 0-1.1 1.7 7 7 0 0 0 2.4.8l-2.1 2.1a1 1 0 1 0 1.5 1.5L12 16l2.8 2.7a1 1 0 0 0 1.5-1.5L14.2 14a7 7 0 0 0 2.4-.8 1 1 0 0 0 .3-1.3Z"
                      />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold">Одноклассники</div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Полезные советы и ответы в привычном формате.
                </div>
              </a>
            </div>

            {/* Сноска про Instagram/Meta */}
            <p className="mt-2 text-[10px] text-slate-400 max-w-xl">
              * Instagram принадлежит компании Meta Platforms Inc., деятельность
              которой запрещена на территории Российской Федерации как
              экстремистская организация.
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
