// app/docs/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DocsPage() {
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
              / <span className="text-slate-700">Документы</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Документы сервиса OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь собраны основные документы, регулирующие работу онлайн-клиники
              OnlyVet: условия оказания услуг, правила приёма и политика
              обработки персональных данных.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <Link
              href="/docs/rules"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold">
                Правила онлайн-клиники
              </div>
              <p className="text-[12px] text-slate-600">
                Как проходит консультация, обязанности сторон, ограничения
                онлайн-формата.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Открыть →
              </span>
            </Link>

            <Link
              href="/docs/offer"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold">
                Публичная оферта
              </div>
              <p className="text-[12px] text-slate-600">
                Условия договора на оказание услуг онлайн-консультаций.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Открыть →
              </span>
            </Link>

            <Link
              href="/docs/privacy"
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgба(15,23,42,0.08)] transition"
            >
              <div className="text-[13px] font-semibold">
                Политика конфиденциальности
              </div>
              <p className="text-[12px] text-slate-600">
                Как мы обрабатываем и храним персональные данные владельцев и
                их пациентов.
              </p>
              <span className="text-[12px] text-onlyvet-coral font-medium mt-auto">
                Открыть →
              </span>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
