// app/prices/page.tsx
"use client";

import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services } from "@/data/services";

type ServiceCategory = "консультация" | "второе мнение" | "диагностика" | "сопровождение";

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  консультация: "Консультации",
  "второе мнение": "Второе мнение",
  диагностика: "Диагностика",
  сопровождение: "Сопровождение",
};

export default function PricesPage() {
  const groupedByCategory: Record<ServiceCategory, typeof services> = {
    консультация: [],
    "второе мнение": [],
    диагностика: [],
    сопровождение: [],
  };

  for (const s of services) {
    // только активные и видимые в прайсе — если есть такой флаг в будущем
    const cat = s.category as ServiceCategory;
    if (groupedByCategory[cat]) {
      groupedByCategory[cat].push(s);
    }
  }

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
              Все услуги, которые вы видите в прайсе, — это те же самые услуги
              из раздела «Услуги», просто в более компактном виде. Точная цена
              зависит от сложности случая и объёма анализов.
            </p>
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
                      <div className="text-[11px] text-slate-500">
                        <Link
                          href={`/services/${item.id}`}
                          className="text-onlyvet-coral hover:underline"
                        >
                          Подробнее об услуге →
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
              Иногда по итогам консультации врач может рекомендовать дополнительные
              действия: письменное заключение, контрольную консультацию или
              долгосрочное сопровождение. Эти варианты не выбираются заранее
              в заявке и не являются обязательными — они обсуждаются с вами
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
                всегда согласуются с вами до их назначения. Мы не практикуем
                навязанные услуги и придерживаемся принципов прозрачной, честной
                коммуникации.
              </p>
            </div>
          </section>

          {/* Небольшая памятка — связь с заявкой */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-2 text-[13px] text-slate-700">
            <div className="font-semibold text-[14px]">
              Как прайс связан с заявкой на консультацию
            </div>
            <p className="leading-relaxed">
              При оформлении заявки вы выбираете основной формат работы
              (консультация, второе мнение, разбор анализов и т.п.) — это одна
              из услуг из прайса. Если в процессе разбора выяснится, что нужен
              другой формат или дополнительные действия, врач сначала объяснит,
              зачем это нужно, и как это повлияет на стоимость, и только после
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
                  проговаривает это отдельно: что именно он предлагает,
                  чем это полезно и как меняется стоимость. Решение всегда остаётся
                  за вами.
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
