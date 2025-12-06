// app/account/pets/[id]/page.tsx
"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type PageProps = {
  params: {
    id: string;
  };
};

/**
 * ВРЕМЕННАЯ версия страницы карточки питомца.
 * НИКАКИХ запросов в Vetmanager здесь сейчас нет.
 * Потом вернём реальную карточку, когда интеграция будет стабильно работать.
 */
export default function PetPage({ params }: PageProps) {
  const petId = params.id;
  const initialLetter =
    petId?.trim().charAt(0).toUpperCase() || "П";

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
            /{" "}
            <Link href="/account" className="hover:text-onlyvet-coral">
              Личный кабинет
            </Link>{" "}
            /{" "}
            <Link href="/account?tab=pets" className="hover:text-onlyvet-coral">
              Питомцы
            </Link>{" "}
            / <span className="text-slate-700">Карточка питомца</span>
          </nav>

          {/* Шапка (демо) */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center text-onlyvet-navy text-xl font-semibold">
                {initialLetter}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Питомец #{petId}
                </h1>
                <div className="text-[13px] text-slate-600">
                  В дальнейшем здесь будет отображаться подробная карточка
                  питомца из Vetmanager. Сейчас показан служебный идентификатор:
                  <span className="font-mono text-slate-900 ml-1">
                    {petId}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 text-[12px]">
              <Link
                href="/booking"
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition text-center"
              >
                Записаться на консультацию
              </Link>
              <Link
                href="/account?tab=pets"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
              >
                К списку питомцев
              </Link>
            </div>
          </section>

          {/* Контент-заглушка */}
          <section className="grid gap-5 md:grid-cols-[1.4fr,1fr] items-start">
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h2 className="text-[15px] font-semibold mb-3">
                  Основная информация
                </h2>
                <p className="text-[13px] text-slate-600">
                  Здесь будет отображаться вид питомца, возраст, вес,
                  особенности здоровья и другие данные из карты пациента.
                  Сейчас эта секция работает в демонстрационном режиме.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h2 className="text-[15px] font-semibold mb-2">
                  Медицинская карта
                </h2>
                <p className="text-[13px] text-slate-600">
                  История приёмов, анализов и заключений по этому питомцу
                  появится здесь после подключения полной интеграции с
                  Vetmanager. Пока все приёмы видны в разделе{" "}
                  <Link
                    href="/account"
                    className="text-onlyvet-coral hover:underline"
                  >
                    «Консультации»
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h3 className="text-[15px] font-semibold mb-2">
                  Документы питомца
                </h3>
                <p className="text-[13px] text-slate-600">
                  Позже здесь можно будет просматривать анализы, выписки и
                  другие загруженные документы. Сейчас вы можете отправить
                  файлы администратору при создании заявки или в чате.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
