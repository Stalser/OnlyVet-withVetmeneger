// app/account/pets/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPetById } from "@/lib/vetmanagerClient";

type PageProps = {
  params: { id: string };
};

export default async function PetPage({ params }: PageProps) {
  const numericId = Number(params.id);
  if (!numericId || Number.isNaN(numericId)) {
    return notFound();
  }

  let pet = null;
  try {
    pet = await getPetById(numericId);
  } catch (e) {
    console.error("[PetPage] error getPetById:", e);
  }

  if (!pet) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-3xl px-4">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-center space-y-3">
              <h1 className="text-lg md:text-xl font-semibold">
                Питомец не найден
              </h1>
              <p className="text-[13px] text-slate-600 max-w-xl mx-auto">
                Карточка питомца с таким идентификатором пока не найдена в Vetmanager.
                Возможно, питомец был удалён или ещё не синхронизирован.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                <Link
                  href="/account?tab=pets"
                  className="px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                >
                  К списку питомцев
                </Link>
                <Link
                  href="/booking"
                  className="px-4 py-2.5 rounded-full border border-slate-300 text-[13px] text-slate-700 hover:bg-slate-50 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            / <span className="text-slate-700">{pet.alias}</span>
          </nav>

          {/* Шапка */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center text-onlyvet-navy text-xl font-semibold">
                {pet.alias?.[0] || "П"}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  {pet.alias}
                </h1>
                <div className="text-[13px] text-slate-600">
                  ID: {pet.id}
                  {pet.birthday && (
                    <> · Д.р.: {new Date(pet.birthday).toLocaleDateString("ru-RU")}</>
                  )}
                  {pet.sex && <> · Пол: {pet.sex}</>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <Link
                href={`/booking?petId=${pet.id}`}
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Записаться на консультацию
              </Link>
              <Link
                href="/account?tab=pets"
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                К списку питомцев
              </Link>
            </div>
          </section>

          {/* Дальше можно развивать: медкарта, документы и т.д. */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-3 text-[13px]">
            <h2 className="text-[15px] font-semibold mb-2">
              Основные данные питомца из Vetmanager
            </h2>
            <p>
              <span className="text-slate-500">Кличка:</span> {pet.alias}
            </p>
            <p>
              <span className="text-slate-500">ID в Vetmanager:</span> {pet.id}
            </p>
            {pet.birthday && (
              <p>
                <span className="text-slate-500">Дата рождения:</span>{" "}
                {new Date(pet.birthday).toLocaleDateString("ru-RU")}
              </p>
            )}
            {pet.sex && (
              <p>
                <span className="text-slate-500">Пол:</span> {pet.sex}
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
