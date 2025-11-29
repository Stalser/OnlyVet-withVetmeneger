// app/prices/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services } from "@/data/services";

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

  // помогает привязать прайс к услугам:
  const getRelatedServices = (priceItem: PriceItem) => {
    const nameNorm = priceItem.name.toLowerCase().trim();
    return services.filter((s) => {
      const serviceName = s.name.toLowerCase().trim();
      // простая эвристика: совпадение имени или включение
      return (
        serviceName === nameNorm ||
        serviceName.includes(nameNorm) ||
        nameNorm.includes(serviceName)
      );
    });
  };

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
                {main.map((item) => {
                  const related = getRelatedServices(item);
                  return (
                    <div
                      key={item.id}
                      className="px-4 py-3 space-y-1"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
                      {related.length > 0 && (
                        <div className="text-[11px] text-slate-500">
                          Связанная услуга:{" "}
                          {related.map((s, idx) => (
                            <span key={s.id}>
                              {idx > 0 && ", "}
                              <Link
                                href={`/services/${s.id}`}
                                className="text-onlyvet-coral hover:underline"
                              >
                                {s.name}
                              </Link>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                    className="px-4 py-3 space-y-1"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
              согласуются с вами до назначения. Мы не практикуем навязанные
              услуги и придерживаемся принципов прозрачной, этичной
              коммуникации.
            </p>
          </section>

          {/* Небольшая памятка — связь с заявкой */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-2 text-[13px] text-slate-700">
            <div className="font-semibold text-[14px]">
              Как формируется итоговая стоимость
            </div>
            <p className="leading-relaxed">
              При оформлении заявки вы выбираете основной формат работы
              (консультация, второе мнение, разбор анализов и т.п.). Если в
              процессе разбора выяснится, что нужен другой формат или
              дополнительные действия, врач сначала объяснит, зачем это нужно,
              и только потом предложит изменить или расширить услугу.
            </p>
            <p className="text-[11px] text-slate-500">
              Вы всегда можете задать вопросы по стоимости до начала работы —
              в заявке или через форму обратной связи.
            </p>
          </section>

          {/* Частые вопросы про оплату и дополнительные услуги */}
          <section className="space-y-3">
            <h2 className="text-[15px] md:text-[16px] font-semibold">
              Частые вопросы о стоимости
            </h2>
            <div className="grid gap-3 md:grid-cols-2 text-[13px] text-slate-700">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Могут ли цена или формат измениться после начала консультации?
                </div>
                <p className="text-[13px] leading-relaxed">
                  Иногда в процессе становится понятно, что случай сложнее, чем
                  казалось по заявке, или требует другого формата работы.
                  Врач всегда проговаривает это отдельно: что именно он
                  предлагает, чем это отличается по стоимости и можно ли
                  обойтись без дополнительных шагов.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Можно ли отказаться от дополнительной услуги?
                </div>
                <p className="text-[13px] leading-relaxed">
                  Да. Дополнительные действия (письменное заключение, план
                  сопровождения, повторный приём) — это предложение врача, а не
                  обязательное условие. Вы сами принимаете решение, и врач
                  объяснит, какие риски будут, если ограничиться только
                  базовой консультацией.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Что делать, если после оплаты консультации планы изменились?
                </div>
                <p className="text-[13px] leading-relaxed">
                  Варианты переноса и возврата зависят от времени до консультации
                  и уже выполненного объёма работы (например, если врач
                  успел изучить большую часть анализов). Конкретные условия
                  будут прописаны в публичной оферте и могут обсуждаться
                  индивидуально с администратором.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Если случай очень сложный и затяжной, не выйдет ли «в копеечку»?
                </div>
                <p className="text-[13px] leading-relaxed">
                  Для сложных хронических пациентов мы стараемся выстраивать
                  прогнозируемую тактику: обозначать, какие шаги ожидаются,
                  с какой периодичностью может понадобиться повторный контакт.
                  Если вы заранее предупредите, что бюджет ограничен, врач
                  будет учитывать это при выборе вариантов.
                </p>
              </div>
            </div>
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
                приёму и точнее оценить объём работы.
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
