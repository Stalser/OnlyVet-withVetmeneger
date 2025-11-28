// app/account/trusted/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

type TrustedPerson = {
  id: string;
  fullName: string;
  relation: string; // кто это: супруг/а, родственник, курьер и т.д.
  phone?: string;
  email?: string;
  canViewDocs: boolean;
  canBook: boolean;
  canDecide: boolean; // может принимать решения в неотложных ситуациях
  isDefault: boolean;
};

// Демоданные
const demoTrusted: TrustedPerson[] = [
  {
    id: "t1",
    fullName: "Петрова Анна Сергеевна",
    relation: "Супруга",
    phone: "+7 900 111-22-33",
    email: "anna@example.com",
    canViewDocs: true,
    canBook: true,
    canDecide: true,
    isDefault: true,
  },
  {
    id: "t2",
    fullName: "Сидоров Максим",
    relation: "Друг, помогает с поездками",
    phone: "+7 900 555-66-77",
    email: "",
    canViewDocs: false,
    canBook: true,
    canDecide: false,
    isDefault: false,
  },
];

export default function TrustedPage() {
  const [trusted] = useState<TrustedPerson[]>(demoTrusted);

  const hasTrusted = trusted.length > 0;

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              / <span className="text-slate-700">Доверенные лица</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold">
                  Доверенные лица
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь вы можете указать людей, которым доверяете доступ к
                  информации о питомцах, записи на консультации и принятию
                  решений в определённых ситуациях.
                </p>
              </div>
              <AccountNav />
            </div>
          </div>

          {/* Заголовок + кнопка */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[13px] text-slate-600">
                Всего доверенных лиц:{" "}
                <span className="font-medium text-onlyvet-navy">
                  {trusted.length}
                </span>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-[12px] hover:bg-slate-50 transition"
              >
                Добавить доверенное лицо
              </button>
            </div>

            {/* Список доверенных лиц */}
            <div className="space-y-3">
              {hasTrusted ? (
                trusted.map((person) => (
                  <article
                    key={person.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-3"
                  >
                    {/* Шапка карточки */}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-[14px] font-semibold">
                          {person.fullName}
                        </div>
                        <div className="text-[12px] text-slate-500">
                          {person.relation}
                        </div>
                        <div className="text-[12px] text-slate-600 mt-1 space-y-0.5">
                          {person.phone && (
                            <div>Телефон: {person.phone}</div>
                          )}
                          {person.email && (
                            <div>Email: {person.email}</div>
                          )}
                        </div>
                      </div>

                      {person.isDefault && (
                        <span className="px-2 py-[2px] rounded-full bg-teal-50 text-teal-700 text-[11px]">
                          По умолчанию
                        </span>
                      )}
                    </div>

                    {/* Права доступа */}
                    <div className="mt-1 grid md:grid-cols-3 gap-2 text-[11px] text-slate-700">
                      <TrustedFlag
                        active={person.canViewDocs}
                        text={
                          <>
                            Может видеть документы{" "}
                            <span className="text-slate-500">
                              (выписки, анализы)
                            </span>
                          </>
                        }
                      />
                      <TrustedFlag
                        active={person.canBook}
                        text={
                          <>
                            Может записывать на консультации{" "}
                            <span className="text-slate-500">
                              (от вашего имени)
                            </span>
                          </>
                        }
                      />
                      <TrustedFlag
                        active={person.canDecide}
                        text={
                          <>Может принимать решения в сложных случаях</>
                        }
                      />
                    </div>

                    {/* Управление */}
                    <div className="flex justify-end gap-2 text-[12px] mt-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-center space-y-3">
                  <div className="text-[14px] font-semibold text-slate-700">
                    Доверенных лиц пока нет
                  </div>
                  <p className="text-[12px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Добавьте доверенное лицо, если, например, за питомцем
                    ухаживают несколько членов семьи или вы хотите, чтобы
                    кто-то мог записывать питомца на приёмы за вас.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 text-[13px] bg-onlyvet-coral rounded-full text-white shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                  >
                    Добавить доверенное лицо
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function TrustedFlag({
  active,
  text,
}: {
  active: boolean;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={
          active
            ? "w-2 h-2 rounded-full bg-teal-500"
            : "w-2 h-2 rounded-full bg-slate-300"
        }
      />
      <span>{text}</span>
    </div>
  );
}
