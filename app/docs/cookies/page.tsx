// app/docs/cookies/page.tsx

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CookiesPage() {
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
              Политика использования cookies
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              В этом разделе кратко описано, какие файлы cookies используются на
              сайте OnlyVet, для каких целей и как вы можете управлять ими.
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed bg-white rounded-2xl border border-slate-200 p-4">
            <section>
              <h2 className="font-semibold mb-1 text-[14px]">
                1. Что такое cookies
              </h2>
              <p>
                Cookies — это небольшие фрагменты данных, которые сайт
                сохраняет в браузере пользователя. Они помогают сайту
                корректно работать и запоминать ваши настройки.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[14px]">
                2. Какие cookies мы используем
              </h2>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  технические cookies — для работы основного функционала сайта;
                </li>
                <li>
                  аналитические cookies — для понимания того, как пользователи
                  взаимодействуют с сайтом и какие разделы наиболее полезны;
                </li>
                <li>
                  cookies настроек — чтобы не показывать повторно уведомления
                  (например, о cookies) после согласия.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[14px]">
                3. Как управлять cookies
              </h2>
              <p>
                Вы можете ограничить или полностью отключить использование
                cookies в настройках браузера. Однако это может повлиять на
                корректность работы сайта и часть функционала.
              </p>
              <p className="mt-1">
                Используя сайт OnlyVet, вы соглашаетесь на использование cookies
                в соответствии с настоящей политикой.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
