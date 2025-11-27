// app/docs/page.tsx

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-2">
              Документы и правила сервиса OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь собраны основные документы, описывающие условия работы
              онлайн-клиники OnlyVet, правила оказания услуг и порядок обработки
              персональных данных.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/docs/rules"
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-soft transition-shadow"
            >
              <div className="text-sm font-semibold mb-1">
                Правила онлайн-клиники
              </div>
              <p className="text-[13px] text-slate-600">
                Порядок оказания дистанционных ветеринарных консультаций,
                ограничения и ответственность сторон, особые случаи и экстренные
                ситуации.
              </p>
            </a>

            <a
              href="/docs/offer"
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-soft transition-shadow"
            >
              <div className="text-sm font-semibold mb-1">
                Публичная оферта
              </div>
              <p className="text-[13px] text-slate-600">
                Договор-оферта на оказание услуг онлайн-консультаций, включая
                права и обязанности клиента и исполнителя.
              </p>
            </a>

            <a
              href="/docs/privacy"
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-soft transition-shadow"
            >
              <div className="text-sm font-semibold mb-1">
                Политика обработки персональных данных
              </div>
              <p className="text-[13px] text-slate-600">
                Как мы собираем, храним и используем персональные данные
                владельцев животных и контактных лиц.
              </p>
            </a>

            <a
              href="/docs/cookies"
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-soft transition-shadow"
            >
              <div className="text-sm font-semibold mb-1">
                Политика использования cookies
              </div>
              <p className="text-[13px] text-slate-600">
                Какие файлы cookies используются на сайте, для чего они нужны и
                как вы можете управлять ими.
              </p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
