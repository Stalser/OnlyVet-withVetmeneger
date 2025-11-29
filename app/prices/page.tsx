// app/prices/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type PriceKind = "main" | "extra";

type PriceItem = {
  id: string;
  kind: PriceKind;
  name: string;
  shortDescription?: string;
  priceLabel: string;
  isActive: boolean;
  sortOrder: number;
};

export default function PricesPage() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/prices", { cache: "no-store" });
        if (!res.ok) throw new Error("Не удалось загрузить прайс");
        const data = await res.json();
        setItems(data.prices || []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Ошибка загрузки прайса");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const main = useMemo(
    () => items.filter((i) => i.kind === "main" && i.isActive),
    [items]
  );
  const extra = useMemo(
    () => items.filter((i) => i.kind === "extra" && i.isActive),
    [items]
  );

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
            / <span className="text-slate-700">Цены</span>
          </nav>

          {/* Заголовок */}
          <section className="space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold">
              Цены на онлайн-консультации OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Ниже — основные форматы онлайн-работы и ориентировочная стоимость.
              Точная цена зависит от сложности случая и объёма анализов. Перед
              началом работы врач всегда проговаривает, что именно он предлагает
              и зачем.
            </p>
          </section>

          {/* Основные услуги */}
          <section className="space-y-3">
            <h2 className="text-[15px] md:text-[16px] font-semibold">
              Основные услуги
            </h2>

            {loading && (
              <div className="text-[13px] text-slate-500">
                Загрузка прайса…
              </div>
            )}

            {error && (
              <div className="text-[13px] text-rose-600">{error}</div>
            )}

            {!loading && !error && main.length === 0 && (
              <div className="text-[13px] text-slate-500">
                Основные услуги пока не заполнены.
              </div>
            )}

            {!loading && !error && main.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100">
                {main.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="text-[13px] font-semibold text-slate-800">
                        {item.name}
                      </div>
                      {item.shortDescription && (
                        <div className="text-[12px] text-slate-600">
                          {item.shortDescription}
                        </div>
                      )}
                    </div>
                    <div className="text-[13px] font-semibold text-onlyvet-navy whitespace-nowrap">
                      {item.priceLabel}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-500 max-w-xl">
              Стоимость включает анализ присланных материалов, онлайн-разбор
              ситуации и формирование рекомендаций. Если случай сложный или
              документов очень много, врач может предложить другой формат — это
              обсуждается с вами заранее.
            </p>
          </section>

          {/* Дополнительные услуги / рекомендации */}
          <section className="space-y-3">
            <h2 className="text-[15px] md:text-[16px] font-semibold">
              Дополнительные услуги и рекомендации
            </h2>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Иногда по итогам консультации врач может рекомендовать дополнительные
              действия: письменное заключение, контрольную консультацию или
              долгосрочное сопровождение. Эти варианты не обязательны и
              предлагаются только в том случае, если действительно будут полезны
              вашему питомцу.
            </p>

            {!loading && !error && extra.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100">
                {extra.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="text-[13px] font-semibold text-slate-800">
                        {item.name}
                      </div>
                      {item.shortDescription && (
                        <div className="text-[12px] text-slate-600">
                          {item.shortDescription}
                        </div>
                      )}
                    </div>
                    <div className="text-[13px] font-semibold text-onlyvet-navy whitespace-nowrap">
                      {item.priceLabel}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && extra.length === 0 && (
              <div className="text-[13px] text-slate-500">
                Дополнительные услуги пока не заполнены.
              </div>
            )}

            <p className="text-[11px] text-slate-500 max-w-xl">
              Конкретная необходимость и стоимость дополнительных услуг всегда
              согласуется с вами до назначения. Мы не практикуем навязанные
              услуги и придерживаемся принципов прозрачной, этичной
              коммуникации.
            </p>
          </section>

          {/* Небольшая памятка — как это связано с заявкой */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-2 text-[13px] text-slate-700">
            <div className="font-semibold text-[14px]">
              Как формируется итоговая стоимость
            </div>
            <p className="leading-relaxed">
              При оформлении заявки вы выбираете основной формат работы
              (консультация, второе мнение, разбор анализов и т.п.). Если в
              процессе разборы выяснится, что нужен другой формат или
              дополнительные действия, врач сначала объяснит, зачем это нужно,
              и только потом предложит изменить или расширить услугу.
            </p>
            <p className="text-[11px] text-slate-500">
              Вы всегда можете задать вопросы по стоимости до начала работы — в
              заявке или через форму обратной связи.
            </p>
          </section>

          {/* CTA */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-[13px]">
            <div>
              <div className="font-semibold mb-1">
                Готовы обсудить ваш случай?
              </div>
              <p className="text-slate-600 max-w-md">
                Можно сразу оформить заявку на онлайн-консультацию или сначала
                кратко описать ситуацию — это поможет врачу лучше подготовиться к
                приёму.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/booking"
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
              >
                Записаться на консультацию
              </Link>
              <Link
                href="/#contact"
                className="px-4 py-2 rounded-full border border-slate-300 text-[13px] text-onlyvet-navy hover:bg-slate-50 transition"
              >
                Задать вопрос
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
