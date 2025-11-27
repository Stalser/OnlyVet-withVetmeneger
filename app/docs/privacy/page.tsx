// app/docs/privacy/page.tsx

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-4">
          <a
            href="/docs"
            className="text-[12px] text-slate-500 hover:text-onlyvet-coral"
          >
            ← Ко всем документам
          </a>

          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-2">
              Политика обработки персональных данных
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              В этом документе описывается, какие данные мы собираем, на каком
              основании, как храним и как обеспечиваем их защиту. Текст служит
              основой, которую можно доработать юридически.
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed bg-white rounded-2xl border border-slate-200 p-4">
            <section>
              <h2 className="font-semibold mb-1 text-[14px]">1. Какие данные мы собираем</h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>ФИО и контактные данные владельца животного;</li>
                <li>данные о питомце (кличка, вид, порода, возраст и др.);</li>
                <li>
                  медицинские сведения, которые клиент добровольно передаёт:
                  результаты анализов, истории болезней, исследования;
                </li>
                <li>
                  технические данные: IP-адрес, информация о браузере, cookies и
                  др. в рамках аналитики.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[14px]">
                2. Цели обработки данных
              </h2>
              <p>
                Персональные данные обрабатываются исключительно для оказания
                услуг онлайн-консультаций, ведения учётных записей, улучшения
                качества сервиса и соблюдения требований законодательства.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[14px]">3. Хранение и защита</h2>
              <p>
                Данные хранятся в защищённых системах с ограниченным доступом.
                Мы не передаём персональные данные третьим лицам, за исключением
                случаев, предусмотренных законом или явно согласованных с
                клиентом.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
