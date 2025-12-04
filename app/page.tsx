// app/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";

import { doctors } from "@/data/doctors";
import { services, type ServiceCategory } from "@/data/services";
import { reviews } from "@/data/reviews";

type HomeSpecFilter =
  | "all"
  | "терапия"
  | "диагностика"
  | "эксперт"
  | "онкология";
type ServiceFilterCategory = "all" | ServiceCategory;
type ServiceFilterSpec = HomeSpecFilter;

export default function HomePage() {
  const [specFilter, setSpecFilter] = useState<HomeSpecFilter>("all");
  const [serviceCategory, setServiceCategory] =
    useState<ServiceFilterCategory>("all");
  const [serviceSpec, setServiceSpec] = useState<ServiceFilterSpec>("all");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
   <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#101827] text-white">
  <div
    className="
      pointer-events-none absolute inset-x-[-120px] top-[-180px] h-[360px]
      bg-gradient-to-br from-onlyvet-teal/30 via-onlyvet-coral/10 to-transparent
      opacity-70 blur-3xl
    "
  />

  <div className="relative container mx-auto max-w-5xl px-4 py-16">
    <div className="flex flex-col items-center text-center gap-8">

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          <span className="block">Мы рядом,</span>
          <span className="block text-slate-100/90">даже если вы далеко.</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/booking"
          className="
            inline-flex items-center justify-center
            px-5 py-2.5 rounded-full
            bg-onlyvet-coral text-[13px] font-medium
            shadow-[0_12px_32px_rgba(247,118,92,0.6)]
            hover:brightness-105 transition
          "
        >
          Записаться на консультацию
        </Link>

        <Link
          href="/auth/login"
          className="
            inline-flex items-center justify-center
            px-5 py-2.5 rounded-full
            border border-slate-500
            text-[13px] font-medium text-slate-100
            hover:bg-slate-800/60 transition
          "
        >
          Войти в личный кабинет
        </Link>
      </div>

    </div>
  </div>
</section>
              {/* Правая часть — просто воздух на десктопе, чтобы блок не был тяжёлым */}
              <div className="hidden md:block flex-1" />
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
                    Решения опираются на протоколы и анализ сложных случаев.
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
                    Онкология, хроника, непонятные диагнозы — наша зона.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Этика и прозрачность
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Без паники и давления. Только по делу.
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Врачи */}
        <DoctorsSection specFilter={specFilter} setSpecFilter={setSpecFilter} />

        {/* Услуги */}
        <ServicesSection
          serviceCategory={serviceCategory}
          setServiceCategory={setServiceCategory}
          serviceSpec={serviceSpec}
          setServiceSpec={setServiceSpec}
        />

        {/* ОТЗЫВЫ */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Отзывы</h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  Несколько свежих отзывов от владельцев. Полный список — на
                  странице «Все отзывы».
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="
                    inline-flex items-center gap-2 px-4 py-2 rounded-full 
                    border border-slate-300 bg-white text-[13px] text-onlyvet-navy
                    hover:bg-slate-50 transition
                  "
                >
                  Оставить отзыв
                </button>
                <Link
                  href="/reviews"
                  className="
                    inline-flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-onlyvet-coral text-white text-[13px] font-medium
                    shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition
                  "
                >
                  Все отзывы
                  <span className="text-[16px] leading-none">→</span>
                </Link>
              </div>
            </div>

            <ReviewsCarousel />

            <ReviewModal
              open={reviewModalOpen}
              onClose={() => setReviewModalOpen(false)}
            />
          </div>
        </section>

        {/* Соцсети */}
        <SocialBlock />

        {/* Обратная связь */}
        <FeedbackBlock />
      </main>
      <Footer />
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////
// ВРАЧИ + КАРУСЕЛЬ
////////////////////////////////////////////////////////////////////////////////

function DoctorsSection({
  specFilter,
  setSpecFilter,
}: {
  specFilter: HomeSpecFilter;
  setSpecFilter: (f: HomeSpecFilter) => void;
}) {
  return (
    <section className="py-7">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">Врачи OnlyVet</h2>
            <p className="text-[13px] text-slate-600 max-w-xl">
              Подберите специалиста под вашу задачу.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
          >
            Все врачи
            <span className="text-[16px] leading-none">→</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px] mb-4">
          <span className="text-slate-500 mr-1">Специализация:</span>
          {[
            { key: "all", label: "Все" },
            { key: "терапия", label: "Терапия" },
            { key: "эксперт", label: "Эксперт / онкология" },
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

        <DoctorsCarousel specFilter={specFilter} />
      </div>
    </section>
  );
}

function DoctorsCarousel({ specFilter }: { specFilter: HomeSpecFilter }) {
  const [page, setPage] = useState(0);
  const perPage = 4;

  const filtered = useMemo(
    () =>
      doctors.filter((doc) =>
        specFilter === "all" ? true : doc.specialization === specFilter
      ),
    [specFilter]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    setPage(0);
  }, [specFilter]);

  const current = filtered.slice(page * perPage, page * perPage + perPage);
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2 items-stretch">
        {current.map((doc) => (
          <div key={doc.id} className="h-full">
            <DoctorCard doctor={doc} />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <button
              type="button"
              onClick={() => canPrev && setPage((p) => p - 1)}
              disabled={!canPrev}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                canPrev
                  ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  : "border-slate-200 text-slate-300 bg-slate-50 cursor-default"
              }`}
            >
              ← Назад
            </button>
            <button
              type="button"
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                canNext
                  ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  : "border-slate-200 text-slate-300 bg-slate-50 cursor-default"
              }`}
            >
              Вперёд →
            </button>
            <span className="ml-2">
              Страница {page + 1} из {pageCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
// УСЛУГИ НА ГЛАВНОЙ
////////////////////////////////////////////////////////////////////////////////

function getFilteredServices(
  category: ServiceFilterCategory,
  spec: ServiceFilterSpec
) {
  return services.filter((s) => {
    const byCategory = category === "all" ? true : s.category === category;
    const bySpec =
      spec === "all" ? true : s.specializations.includes(spec as any);
    return byCategory && bySpec;
  });
}

function ServicesSection({
  serviceCategory,
  setServiceCategory,
  serviceSpec,
  setServiceSpec,
}: {
  serviceCategory: ServiceFilterCategory;
  setServiceCategory: (c: ServiceFilterCategory) => void;
  serviceSpec: ServiceFilterSpec;
  setServiceSpec: (s: ServiceFilterSpec) => void;
}) {
  const filteredServices = getFilteredServices(serviceCategory, serviceSpec);

  return (
    <section className="py-7">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">Услуги OnlyVet</h2>
            <p className="text-[13px] text-slate-600 max-w-xl">
              Основные форматы работы: консультации, второе мнение, диагностика
              и сопровождение хронических пациентов.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
          >
            Все услуги
            <span className="text-[16px] leading-none">→</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px] mb-2">
          <span className="text-slate-500 mr-1">Тип услуги:</span>
          {[
            { key: "all", label: "Все" },
            { key: "консультация", label: "Консультации" },
            { key: "второе мнение", label: "Второе мнение" },
            { key: "диагностика", label: "Диагностика" },
            { key: "сопровождение", label: "Сопровождение" },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() =>
                setServiceCategory(btn.key as ServiceFilterCategory)
              }
              className={`px-3 py-1.5 rounded-full border transition text-xs ${
                serviceCategory === btn.key
                  ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                  : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px] mb-4">
          <span className="text-slate-500 mr-1">Специализация врача:</span>
          {[
            { key: "all", label: "Любая" },
            { key: "терапия", label: "Терапия" },
            { key: "эксперт", label: "Эксперт / онкология" },
            { key: "диагностика", label: "Диагностика" },
            { key: "онкология", label: "Онкология" },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setServiceSpec(btn.key as ServiceFilterSpec)}
              className={`px-3 py-1.5 rounded-full border transition text-xs ${
                serviceSpec === btn.key
                  ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                  : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
          {filteredServices.slice(0, 3).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="h-full"
            >
              <ServiceCard service={service} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

////////////////////////////////////////////////////////////////////////////////
// КАРУСЕЛЬ ОТЗЫВОВ НА ГЛАВНОЙ
////////////////////////////////////////////////////////////////////////////////

function ReviewsCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 3;

  const sorted = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;
  const current = sorted.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        {current.map((rev) => (
          <ReviewCard key={rev.id} review={rev} truncate />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => canPrev && setPage((p) => p - 1)}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                canPrev
                  ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  : "border-slate-200 text-slate-300 bg-slate-50 cursor-default"
              }`}
            >
              ← Назад
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => canNext && setPage((p) => p + 1)}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                canNext
                  ? "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  : "border-slate-200 text-slate-300 bg-slate-50 cursor-default"
              }`}
            >
              Вперёд →
            </button>
            <span className="ml-2">
              Страница {page + 1} из {pageCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
// СОЦСЕТИ
////////////////////////////////////////////////////////////////////////////////

function SocialBlock() {
  return (
    <section className="py-10 bg-gradient-to-b from-transparent to-slate-50/70">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-lg md:text-xl font-semibold mb-1">
          Мы в социальных сетях
        </h2>
        <p className="text-[13px] text-slate-600 max-w-xl mb-6">
          Подписывайтесь на OnlyVet — делимся историями пациентов, рекомендациями
          и полезными подсказками.
        </p>

        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
          {/* VK */}
          <a
            href="#"
            className="bg-white rounded-3xl border border-slate-200 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/60 transition-all text-center"
          >
            <img
              src="/img/free-icon-vk-3670055.svg"
              alt="VK"
              className="w-14 h-14"
            />
            <div className="text-[14px] font-semibold">ВКонтакте</div>
            <p className="text-[12px] text-slate-600">
              Новости и разборы анализов.
            </p>
          </a>

          {/* Telegram */}
          <a
            href="#"
            className="bg-white rounded-3xl border border-slate-200 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/60 transition-all text-center"
          >
            <img
              src="/img/free-icon-telegram-2111646.svg"
              alt="Telegram"
              className="w-14 h-14"
            />
            <div className="text-[14px] font-semibold">Telegram</div>
            <p className="text-[12px] text-slate-600">
              Разборы сложных случаев и ответы на вопросы.
            </p>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="bg-white rounded-3xl border border-slate-200 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/60 transition-all text-center"
          >
            <img
              src="/img/free-icon-instagram-3955024.svg"
              alt="Instagram"
              className="w-14 h-14"
            />
            <div className="text-[14px] font-semibold">Instagram*</div>
            <p className="text-[12px] text-slate-600">
              Истории пациентов и визуальные схемы.
            </p>
          </a>

          {/* OK */}
          <a
            href="#"
            className="bg-white rounded-3xl border border-slate-200 px-5 py-6 flex flex-col items-center gap-3 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-onlyvet-teal/60 transition-all text-center"
          >
            <img
              src="/img/free-icon-odnoklassniki-3670250.svg"
              alt="Одноклассники"
              className="w-14 h-14"
            />
            <div className="text-[14px] font-semibold">Одноклассники</div>
            <p className="text-[12px] text-slate-600">
              Полезные советы и материалы.
            </p>
          </a>
        </div>

        <p className="mt-3 text-[10px] text-slate-400 max-w-xl">
          * Instagram принадлежит компании Meta Platforms Inc., деятельность
          которой запрещена на территории Российской Федерации как
          экстремистская организация.
        </p>
      </div>
    </section>
  );
}

////////////////////////////////////////////////////////////////////////////////
// ОБРАТНАЯ СВЯЗЬ
////////////////////////////////////////////////////////////////////////////////

function FeedbackBlock() {
  return (
    <section className="py-7" id="contact">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Есть вопрос по питомцу или сервису OnlyVet?
            </h2>
            <p className="text-[13px] text-slate-600 mb-3 max-w-md">
              Напишите нам коротко, что беспокоит, и мы ответим вам на почту или
              в выбранный мессенджер. Это не заменяет консультацию, но помогает
              сориентироваться.
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
              судороги, острая одышка и т.п.) необходимо немедленно обращаться
              в ближайшую круглосуточную ветеринарную клинику.
            </p>
          </div>

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
  );
}
