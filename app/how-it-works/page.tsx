// app/how-it-works/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <span className="text-slate-700">
              Как проходит онлайн-консультация
            </span>
          </nav>

          {/* Заголовок */}
          <section className="space-y-3">
            <h1 className="text-xl md:text-2xl font-semibold">
              Как проходит онлайн-консультация в OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
              Онлайн-приём устроен так, чтобы врачу было достаточно данных для
              принятия решения, а вам — максимально спокойно и понятно на всех
              этапах. Ниже — пошагово, что будет происходить.
            </p>
          </section>

          {/* Шаги */}
          <section className="grid gap-4 md:grid-cols-3">
            <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                Шаг 1
              </div>
              <h2 className="text-[15px] font-semibold">
                Перед консультацией
              </h2>
              <ul className="text-[13px] text-slate-700 space-y-1 list-disc pl-4">
                <li>Вы заполняете форму записи на консультацию.</li>
                <li>
                  Прикрепляете анализы, УЗИ, выписки, фото — всё, что поможет
                  врачу.
                </li>
                <li>
                  Администратор подтверждает время и, при необходимости,
                  уточняет детали.
                </li>
              </ul>
            </article>

            <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                Шаг 2
              </div>
              <h2 className="text-[15px] font-semibold">
                Во время консультации
              </h2>
              <ul className="text-[13px] text-slate-700 space-y-1 list-disc pl-4">
                <li>
                  Врач последовательно собирает анамнез, расспрашивает о
                  симптомах и истории болезни.
                </li>
                <li>
                  Разбирает предоставленные исследования и уже назначенное
                  лечение.
                </li>
                <li>Формирует план: что делать сейчас и что делать дальше.</li>
              </ul>
            </article>

            <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                Шаг 3
              </div>
              <h2 className="text-[15px] font-semibold">
                После консультации
              </h2>
              <ul className="text-[13px] text-slate-700 space-y-1 list-disc pl-4">
                <li>
                  Вы получаете письменное резюме с основными выводами и
                  рекомендациями.
                </li>
                <li>Прописывается план дообследования (если он нужен).</li>
                <li>
                  При длительном сопровождении — план контрольных точек и
                  повторных консультаций.
                </li>
              </ul>
            </article>
          </section>

          {/* Что онлайн-консультация МОЖЕТ / НЕ МОЖЕТ */}
          <section className="grid gap-4 md:grid-cols-2">
            <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
              <h2 className="text-[15px] font-semibold mb-2">
                Что онлайн-консультация может
              </h2>
              <ul className="text-[13px] text-slate-700 list-disc pl-4 space-y-1">
                <li>Разобрать уже поставленный диагноз и схему лечения.</li>
                <li>Объяснить анализы, УЗИ и другие исследования.</li>
                <li>
                  Помочь выбрать тактику в сложной или неоднозначной ситуации.
                </li>
                <li>
                  Составить план дообследований и дальнейших шагов в
                  офлайн-клинике.
                </li>
                <li>
                  Дать второе мнение перед серьёзными решениями (операция,
                  смена терапии и т.д.).
                </li>
              </ul>
            </article>

            <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
              <h2 className="text-[15px] font-semibold mb-2">
                Что онлайн-консультация не заменяет
              </h2>
              <ul className="text-[13px] text-slate-700 list-disc pl-4 space-y-1">
                <li>
                  Не заменяет очный осмотр и экстренную помощь при угрозе жизни.
                </li>
                <li>
                  Не позволяет провести процедуры, манипуляции, диагностику на
                  месте.
                </li>
                <li>
                  Не ставит диагноз «вслепую» без минимально необходимых данных.
                </li>
                <li>
                  Не подменяет лечащего врача в вашей офлайн-клинике, а
                  дополняет его.
                </li>
              </ul>
              <p className="text-[11px] text-slate-500 mt-2">
                В экстренных состояниях (угроза жизни, тяжёлое состояние,
                судороги, острая одышка и т.п.) необходимо немедленно
                обращаться в ближайшую круглосуточную ветеринарную клинику.
              </p>
            </article>
          </section>

          {/* Как подготовиться */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-3">
            <h2 className="text-[15px] font-semibold mb-1">
              Как подготовиться к онлайн-консультации
            </h2>
            <ul className="text-[13px] text-slate-700 list-disc pl-4 space-y-1">
              <li>
                Запишите основные жалобы и в какой последовательности они
                появлялись.
              </li>
              <li>
                Соберите результаты анализов, УЗИ, выписок по текущему диагнозу
                — загрузите их при записи или заранее отправьте администратору.
              </li>
              <li>
                Подготовьте список препаратов, которые сейчас получает питомец
                (название, дозировка, схема).
              </li>
              <li>
                Если есть фото/видео симптомов (походка, приступ, кожа, стул) —
                их тоже можно прикрепить.
              </li>
            </ul>
          </section>

          {/* Ссылки на документы и CTA */}
          <section className="grid gap-4 md:grid-cols-[1.4fr,1fr] items-start">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-2">
              <h2 className="text-[15px] font-semibold mb-1">
                Важные документы сервиса
              </h2>
              <ul className="text-[13px] text-slate-700 list-disc pl-4 space-y-1">
                <li>
                  <Link
                    href="/docs/rules"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Правила онлайн-клиники
                  </Link>
                  {" — "}как мы принимаем решения, ограничения и форматы работы.
                </li>
                <li>
                  <Link
                    href="/docs/offer"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Публичная оферта
                  </Link>
                  {" — "}договор на оказание услуг онлайн-консультации.
                </li>
                <li>
                  <Link
                    href="/docs/privacy"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Политика обработки персональных данных
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3 text-[13px]">
              <div className="font-semibold text-[14px]">
                Готовы к приёму?
              </div>
              <p className="text-slate-600 leading-relaxed">
                Если формат консультации вам подходит, можно перейти к записи и
                выбрать удобное время и врача.
              </p>
              <Link
                href="/booking"
                className="w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition text-center"
              >
                Записаться на консультацию
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
