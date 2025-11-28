// app/account/pets/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

type Pet = {
  id: string;
  name: string;
  kind: string;
  age: string;
  notes?: string;
  avatar?: string;
};

const mockPets: Pet[] = [
  {
    id: "pet1",
    name: "Локи",
    kind: "Кошка, шотландская",
    age: "2 года",
    notes: "Хронический гастрит, периодические эпизоды рвоты. Наблюдается.",
    avatar: "/img/pet-cat-default.png",
  },
  {
    id: "pet2",
    name: "Рекс",
    kind: "Собака, метис",
    age: "6 лет",
    notes: "Перенесён панкреатит. Требуется контроль диеты и анализов.",
    avatar: "/img/pet-dog-default.png",
  },
];

export default function PetsPage() {
  const hasPets = mockPets.length > 0;

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
              / <span className="text-slate-700">Питомцы</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold">Питомцы</h1>
                <p className="text-[13px] text-slate-600 max-w-xl leading-relaxed">
                  Здесь отображаются ваши питомцы, их карточки, документы и
                  медицинская история. Сейчас показаны демонстрационные данные.
                </p>
              </div>

              <AccountNav />
            </div>
          </div>

          {/* Блок: “Всего питомцев” + кнопка */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
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

            {/* Если питомцы есть → список карточек */}
            {hasPets ? (
              <div className="grid gap-4 md:grid-cols-2">
                {mockPets.map((pet) => (
                  <article
                    key={pet.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition"
                  >
                    {/* Аватар + ФИО питомца */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {pet.avatar ? (
                          <img
                            src={pet.avatar}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-onlyvet-navy font-semibold text-[14px]">
                            {pet.name[0]}
                          </span>
                        )}
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

                    {/* Примечания */}
                    {pet.notes && (
                      <p className="text-[12px] text-slate-600 leading-relaxed">
                        {pet.notes}
                      </p>
                    )}

                    {/* Кнопки */}
                    <div className="flex justify-between items-center text-[12px] pt-1">
                      <Link
                        href={`/account/pets/${pet.id}`}
                        className="text-onlyvet-coral hover:underline transition"
                      >
                        Открыть карточку
                      </Link>

                      <Link
                        href={`/booking?petId=${pet.id}`}
                        className="px-3 py-1 rounded-full bg-onlyvet-coral text-white hover:brightness-105 shadow-[0_8px_20px_rgba(247,118,92,0.45)] transition"
                      >
                        Записаться
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Если питомцев нет → пустое состояние */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-center space-y-3">
                <div className="text-[14px] font-semibold text-slate-700">
                  У вас пока нет питомцев
                </div>
                <p className="text-[12px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Добавьте питомца, чтобы вести медицинскую историю, хранить
                  документы, загружать анализы и записываться на консультации.
                </p>

                <button
                  type="button"
                  className="px-4 py-2 text-[13px] bg-onlyvet-coral rounded-full text-white shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
                >
                  Добавить питомца
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
