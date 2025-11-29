// app/docs/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DocsIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            / <span className="text-slate-700">Документы сервиса</span>
          </nav>

          {/* Заголовок */}
          <section className="space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold">
              Документы онлайн-клиники OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь собраны основные документы, регулирующие работу
              онлайн-клиники: правила сервиса, публичная оферта и политика
              обработки персональных данных. Эти документы будут актуализироваться
              по мере развития проекта.
            </p>
          </section>

          {/* Список документов */}
          <section className="grid gap-4 md:grid-cols-2 text-[13px]">
            <Link
              href="/docs/rules"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition"
            >
              <div className="text-[14px] font-semibold">
                Правила онлайн-клиники
              </div>
              <p className="text-[12px] text-slate-600">
                Основные принципы работы онлайн-консультаций, ограничения
                формата и рекомендации по использованию сервиса.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Открыть документ →
              </span>
            </Link>

            <Link
              href="/docs/offer"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition"
            >
              <div className="text-[14px] font-semibold">
                Публичная оферта
              </div>
              <p className="text-[12px] text-slate-600">
                Условия договора оказания услуг онлайн-консультаций. Именно с
                текстом оферты вы соглашаетесь при подаче заявки.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Открыть документ →
              </span>
            </Link>

            <Link
              href="/docs/privacy"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition"
            >
              <div className="text-[14px] font-semibold">
                Политика обработки персональных данных
              </div>
              <p className="text-[12px] text-slate-600">
                Как мы обращаемся с персональными данными, какие данные
                собираем, для чего и как обеспечиваем безопасность.
              </p>
              <span className="mt-auto text-[12px] text-onlyvet-coral font-medium">
                Открыть документ →
              </span>
            </Link>
          </section>

          {/* Небольшая памятка */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Юридическое уточнение
            </div>
            <p>
              Тексты документов на этом этапе являются рабочими шаблонами и
              могут быть уточнены совместно с юристом. Важная часть стратегии —
              прозрачность: владелец должен понимать, как работает сервис, в
              каких рамках врач может консультировать онлайн и где граница между
              онлайн-форматом и очной экстренной помощью.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
