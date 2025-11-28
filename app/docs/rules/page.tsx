// app/docs/rules/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RulesPage() {
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
              /{" "}
              <Link href="/docs" className="hover:text-onlyvet-coral">
                Документы
              </Link>{" "}
              / <span className="text-slate-700">Правила онлайн-клиники</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Правила онлайн-клиники OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Этот документ описывает основные принципы работы онлайн-клиники,
              обязанности сторон и ограничения дистанционного формата.
            </p>
          </div>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4 text-[13px] text-slate-700">
            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                1. Общие положения
              </h2>
              <p>
                1.1. Онлайн-клиника OnlyVet оказывает консультационные услуги по
                вопросам здоровья животных в дистанционном формате.
              </p>
              <p>
                1.2. Онлайн-консультация не заменяет очный осмотр и не является
                экстренной медицинской помощью. При угрожающих жизни состояниях
                необходимо немедленно обратиться в ближайшую
                круглосуточную клинику.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                2. Права и обязанности владельца
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Предоставлять врачу максимально полную и достоверную
                  информацию о состоянии животного, ранее проведённых
                  исследованиях и лечении.
                </li>
                <li>
                  Загружать актуальные результаты анализов, УЗИ, рентгеновских
                  снимков и других данных, имеющих значение для консультации.
                </li>
                <li>
                  Самостоятельно принимать решения о выполнении рекомендаций и
                  несёт ответственность за их соблюдение.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                3. Права и обязанности врача
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Оценивать предоставленные данные и формировать рекомендации в
                  рамках доступной информации и дистанционного формата.
                </li>
                <li>
                  При необходимости рекомендовать очный осмотр, дополнительные
                  исследования или обращение в стационар.
                </li>
                <li>
                  Отказываться от консультации, если дистанционный формат
                  заведомо не позволяет безопасно оценить ситуацию.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                4. Ограничения онлайн-формата
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Невозможно провести полноценный физикальный осмотр, инъекции,
                  процедуры и оперативные вмешательства.
                </li>
                <li>
                  Отдельные диагнозы могут быть поставлены только при наличии
                  очного осмотра и расширенной диагностики.
                </li>
                <li>
                  Врач опирается на данные, предоставленные владельцем, и не
                  несёт ответственности за искажение информации или скрытые
                  факторы.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                5. Заключительные положения
              </h2>
              <p>
                Использование сервиса OnlyVet означает согласие владельца с
                настоящими правилами, а также с{" "}
                <Link
                  href="/docs/offer"
                  className="text-onlyvet-coral hover:underline"
                >
                  публичной офертой
                </Link>{" "}
                и{" "}
                <Link
                  href="/docs/privacy"
                  className="text-onlyvet-coral hover:underline"
                >
                  политикой конфиденциальности
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
