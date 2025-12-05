// app/account/pets/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPetById, type VetmPet } from "@/lib/vetmanagerClient";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function PetPage({ params }: PageProps) {
  const rawId = params.id;
  const petId = Number(rawId);

  if (!Number.isFinite(petId) || petId <= 0) {
    return notFound();
  }

  let pet: VetmPet | null = null;

  try {
    pet = await getPetById(petId);
  } catch (err) {
    console.error("[PetPage] getPetById error:", err);
    pet = null;
  }

  if (!pet) {
    return notFound();
  }

  const initialLetter = pet.alias?.trim()?.charAt(0).toUpperCase() || "П";

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
            <Link href="/account/pets" className="hover:text-onlyvet-coral">
              Питомцы
            </Link>{" "}
            / <span className="text-slate-700">{pet.alias}</span>
          </nav>

          {/* Шапка питомца */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center text-onlyvet-navy text-xl font-semibold">
                {initialLetter}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  {pet.alias}
                </h1>
                <div className="text-[13px] text-slate-600 space-x-1">
                  <span className="text-slate-500">ID в клинике:</span>
                  <span className="font-medium">{pet.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">ID владельца:</span>
                  <span className="font-medium">{pet.owner_id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 text-[12px]">
              <Link
                href={`/booking?petId=${pet.id}`}
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition text-center"
              >
                Записаться с этим питомцем
              </Link>
              <Link
                href="/account/pets"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
              >
                К списку питомцев
              </Link>
            </div>
          </section>

          {/* Основная информация */}
          <section className="grid gap-5 md:grid-cols-[1.4fr,1fr] items-start">
            {/* Левая колонка: основные данные */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h2 className="text-[15px] font-semibold mb-3">
                  Основная информация
                </h2>
                <div className="space-y-1.5 text-[13px] text-slate-700">
                  <p>
                    <span className="text-slate-500">Кличка: </span>
                    <span className="font-medium">{pet.alias}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">ID в системе клиники: </span>
                    <span className="font-medium">{pet.id}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">ID владельца: </span>
                    <span className="font-medium">{pet.owner_id}</span>
                  </p>
                  {pet.birthday && (
                    <p>
                      <span className="text-slate-500">Дата рождения: </span>
                      {pet.birthday}
                    </p>
                  )}
                  {pet.sex && (
                    <p>
                      <span className="text-slate-500">Пол: </span>
                      {pet.sex}
                    </p>
                  )}
                </div>
              </div>

              {/* Заглушка под будущую медкарту */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h2 className="text-[15px] font-semibold mb-2">
                  Медицинская карта
                </h2>
                <p className="text-[13px] text-slate-600">
                  Подробная история приёмов, анализов и заключений по этому
                  питомцу будет отображаться здесь, когда интеграция с
                  медицинской картой будет полностью настроена. Сейчас данные
                  по приёмам доступны в разделе{" "}
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

            {/* Правая колонка: документы (пока пустое состояние) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6">
                <h3 className="text-[15px] font-semibold mb-2">
                  Документы питомца
                </h3>
                <p className="text-[13px] text-slate-600">
                  В дальнейшем здесь будут отображаться загруженные анализы,
                  выписки и другие материалы, связанные с этим питомцем. Сейчас
                  документы можно отправить при создании заявки или в чат с
                  администратором.
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
