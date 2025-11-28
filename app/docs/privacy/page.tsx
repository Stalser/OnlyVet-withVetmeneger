// app/docs/privacy/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
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
              /{" "}
              <span className="text-slate-700">
                Политика конфиденциальности
              </span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Политика обработки персональных данных OnlyVet
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              В этом разделе описано, какие данные мы собираем, как их
              используем и как обеспечиваем их безопасность. Текст будет
              дополнен юридическими формулировками.
            </p>
          </div>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4 text-[13px] text-slate-700">
            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                1. Какие данные мы собираем
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>Контактные данные владельца (ФИО, телефон, email, Telegram).</li>
                <li>
                  Информацию о питомцах (имя, вид, порода, возраст, анамнез —
                  по мере необходимости).
                </li>
                <li>
                  Технические данные при посещении сайта (cookies, IP-адрес,
                  информация о браузере и устройстве).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                2. Для чего мы используем данные
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>Для записи на онлайн-консультации и их проведения.</li>
                <li>
                  Для связи с владельцем по поводу консультаций и рекомендаций
                  врача.
                </li>
                <li>
                  Для улучшения работы сервиса, мониторинга ошибок и
                  производительности.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                3. Cookies и аналитика
              </h2>
              <p>
                Мы используем файлы cookies для корректной работы сайта,
                запоминания настроек и базовой аналитики посещений. Подробности
                использования cookies описаны в баннере согласия и технической
                документации.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                4. Передача данных третьим лицам
              </h2>
              <p>
                Данные могут передаваться только в объёме, необходимом для
                оказания услуг (например, платёжным сервисам) или в случаях,
                предусмотренных законодательством. Мы не продаём и не
                распространяем персональные данные третьим лицам в маркетинговых
                целях.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                5. Хранение и защита данных
              </h2>
              <p>
                Данные хранятся на защищённых серверах с ограниченным доступом.
                Срок хранения определяется требованиями законодательства и
                необходимостью ведения медицинской документации.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                6. Контакты по вопросам обработки данных
              </h2>
              <p>
                При возникновении вопросов, связанных с обработкой персональных
                данных, вы можете связаться с нами по адресу{" "}
                <a
                  href="mailto:support@onlyvet.ru"
                  className="text-onlyvet-coral hover:underline"
                >
                  support@onlyvet.ru
                </a>
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
