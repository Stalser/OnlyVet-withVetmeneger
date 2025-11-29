// app/prices/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services, type ServiceCategory } from "@/data/services";

type ServiceSpecFilter = "all" | "терапия" | "эксперт" | "диагностика" | "онкология";

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  консультация: "Консультации",
  "второе мнение": "Второе мнение",
  диагностика: "Диагностика",
  сопровождение: "Сопровождение",
};

const SPEC_FILTER_LABELS: { key: ServiceSpecFilter; label: string }[] = [
  { key: "all", label: "Все специализации" },
  { key: "терапия", label: "Терапия" },
  { key: "эксперт", label: "Эксперт / консилиум" },
  { key: "диагностика", label: "Диагностика" },
  { key: "онкология", label: "Онкология" },
];

export default function PricesPage() {
  const [specFilter, setSpecFilter] = useState<ServiceSpecFilter>("all");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (specFilter === "all") return true;
      // фильтруем по специализациям, если они указаны у услуги
      return s.specializations.includes(specFilter as any);
    });
  }, [specFilter]);

  const groupedByCategory = useMemo(() => {
    const grouped: Record<ServiceCategory, typeof services> = {
      консультация: [],
      "второе мнение": [],
      диагностика: [],
      сопровождение: [],
    };
    for (const s of filteredServices) {
      const cat = s.category as ServiceCategory;
      if (grouped[cat]) grouped[cat].push(s);
    }
    return grouped;
  }, [filteredServices]);

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
              Ниже представлены основные онлайн-услуги с ориентировочной
              стоимостью. Это тот же список, что и в разделе «Услуги», только в
              виде компактного прайса. Точная цена и формат работы зависят от
              сложности случая и объёма анализов.
            </p>
          </section>

          {/* Фильтр по специализации врача */}
          <section className="space-y-2">
            <div className="text-[12px] text-slate-500 mb-1">
              Фильтр по специализации врача:
            </div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              {SPEC_FILTER_LABELS.map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setSpecFilter(btn.key)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    specFilter === btn.key
                      ? "bg-onlyvet-navy text-white border-onlyvet-navy shadow-sm"
                      : "border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* Основной прайс по категориям услуг */}
          {(
            ["консультация", "второе мнение", "диагностика", "сопровождение"] as ServiceCategory[]
          ).map((cat) => {
            const list = groupedByCategory[cat];
            if (!list || list.length === 0) return null;
            return (
              <section key={cat} className="space-y-3">
                <h2 className="text-[15px] md:text-[16px] font-semibold">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100">
                  {list.map((item) => (
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
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <Link
                          href={`/services/${item.id}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          Подробнее об услуге →
                        </Link>
                        <span className="text-slate-400">·</span>
                        <Link
                          href={`/booking?serviceId=${item.id}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          Записаться на консультацию
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Пояснение про дополнительные рекомендации */}
          <section className="space-y-3">
            <h2 className="text-[15px] md:text-[16px] font-semibold">
              Дополнительные услуги и рекомендации
            </h2>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Иногда по итогу консультации врач может рекомендовать дополнительные
              действия: письменное заключение, контрольную консультацию или
              долгосрочное сопровождение. Эти варианты не выбираются заранее в
              заявке и не являются обязательными — они обсуждаются с вами
              отдельно, если действительно нужны для безопасности и контроля
              состояния питомца.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-2 text-[13px] text-slate-700">
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Письменное заключение по итогам консультации —{" "}
                  <span className="font-medium">от 1 000 ₽</span> (в зависимости
                  от объёма).
                </li>
                <li>
                  Повторная онлайн-консультация для контроля динамики —{" "}
                  <span className="font-medium">от 1 500 ₽</span>.
                </li>
                <li>
                  Долгосрочное сопровождение хронического пациента —{" "}
                  <span className="font-medium">по индивидуальному плану</span>.
                </li>
              </ul>
              <p className="text-[11px] text-slate-500">
                Конкретная необходимость и стоимость дополнительных действий
                всегда согласуются с вами до назначения. Мы не практикуем
                навязанные услуги и придерживаемся принципов прозрачной,
                честной коммуникации.
              </p>
            </div>
          </section>

          {/* Небольшая памятка — связь с заявкой */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-2 text-[13px] text-slate-700">
            <div className="font-semibold text-[14px]">
              Как прайс связан с заявкой на консультацию
            </div>
            <p className="leading-relaxed">
              При оформлении заявки вы выбираете основную услугу — одну из тех,
              что перечислены выше. Если в процессе работы выяснится, что нужен
              другой формат или дополнительные действия, врач сначала объяснит,
              зачем это нужно и как это повлияет на стоимость, и только после
              вашего согласия изменит или расширит услугу.
            </p>
            <p className="text-[11px] text-slate-500">
              Вы всегда можете задать вопросы по стоимости до начала работы —
              в заявке или через форму обратной связи.
            </p>
          </section>

          {/* Частые вопросы о стоимости */}
          <section className="space-y-3">
            <h2 className="text-[15px] md:text-[16px] font-semibold">
              Частые вопросы о стоимости
            </h2>
            <div className="grid gap-3 md:grid-cols-2 text-[13px] text-slate-700">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Могут ли цена или формат измениться после начала консультации?
                </div>
                <p className="leading-relaxed">
                  Если по ходу работы выясняется, что случай сложнее, чем
                  выглядел по заявке, или требует другого формата, врач
                  проговаривает это отдельно: что именно он предлагает, чем это
                  полезно и как меняется стоимость. Решение всегда остаётся за
                  вами.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Можно ли отказаться от дополнительной услуги?
                </div>
                <p className="leading-relaxed">
                  Да. Дополнительные действия (письменное заключение, план
                  сопровождения, повторный приём) — это предложение врача, а не
                  обязательное условие. Вы сами принимаете решение, и врач
                  объясняет, какие риски будут, если ограничиться только
                  базовой консультацией.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Что делать, если после оплаты консультации планы изменились?
                </div>
                <p className="leading-relaxed">
                  Варианты переноса и возврата зависят от времени до консультации
                  и уже выполненного объёма работы (например, если врач успел
                  изучить большую часть анализов). Конкретные условия будут
                  прописаны в публичной оферте и могут обсуждаться индивидуально
                  с администратором.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-1">
                <div className="font-semibold">
                  Если случай очень сложный и затяжной, не выйдет ли «в копеечку»?
                </div>
                <p className="leading-relaxed">
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
