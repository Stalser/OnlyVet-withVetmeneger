// app/account/pets/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Pet = {
  id: string;
  name: string;
  kind: string;
  age: string;
  notes?: string;
};

const mockPets: Pet[] = [
  {
    id: "pet1",
    name: "Локи",
    kind: "Кошка, шотландская",
    age: "2 года",
    notes: "Хронический гастрит, периодические обострения.",
  },
  {
    id: "pet2",
    name: "Рекс",
    kind: "Собака, метис",
    age: "6 лет",
    notes: "После перенесённого панкреатита, на диете.",
  },
];

export default function PetsPage() {
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
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              / <span className="text-slate-700">Питомцы</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Питомцы
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Здесь будут отображаться ваши питомцы и их карточки. Пока раздел
              работает в демонстрационном режиме.
            </p>
          </div>

          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[13px] text-slate-600">
                Всего питомцев:{" "}
                <span className="font-medium text-onlyvet-navy">
                  {mockPets.length}
                </span>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-[12px] hover:bg-slate-50 transition"
              >
                Добавить питомца
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mockPets.map((pet) => (
                <article
                  key={pet.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-onlyvet-teal/10 flex items-center justify-center text-onlyvet-navy text-[13px] font-semibold">
                      {pet.name[0]}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">
                        {pet.name}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        {pet.kind} · {pet.age}
                      </div>
                    </div>
                  </div>
                  {pet.notes && (
                    <p className="text-[12px] text-slate-600">{pet.notes}</p>
                  )}
                  <div className="flex justify-between items-center text-[12px] mt-1">
                    <Link
                      href="#"
                      className="text-onlyvet-coral hover:underline"
                    >
                      Открыть карточку (скоро)
                    </Link>
                    <Link
                      href="/booking"
                      className="px-3 py-1 rounded-full bg-onlyvet-coral text-white hover:brightness-105 shadow-[0_8px_20px_rgba(247,118,92,0.45)]"
                    >
                      Записаться
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
