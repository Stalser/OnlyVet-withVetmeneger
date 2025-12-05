// app/account/pets/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

type VetmPet = {
  id: number;
  alias: string;
  owner_id: number;
  birthday?: string;
  sex?: string;
};

type Props = {
  params: { id: string };
};

export default function PetPage({ params }: Props) {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [pet, setPet] = useState<VetmPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const petId = params.id;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError(
            "Не удалось получить данные пользователя. Перезайдите в аккаунт."
          );
          setLoading(false);
          return;
        }

        const user = userData.user;
        const meta = (user.user_metadata || {}) as any;

        const rawPhone: string | undefined =
          meta.phone || meta.cell_phone || meta.tel;

        if (!rawPhone) {
          setError(
            "В профиле не указан телефон. Добавьте его в разделе «Профиль», чтобы связать аккаунт с Vetmanager."
          );
          setLoading(false);
          return;
        }

        const phoneDigits = rawPhone.replace(/\D/g, "");

        const body = {
          phone: phoneDigits,
          firstName:
            meta.first_name || meta.firstName || meta.first || undefined,
          lastName:
            meta.last_name || meta.lastName || meta.last || undefined,
          email: user.email || undefined,
        };

        const res = await fetch("/api/vetmanager/pets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(
            json?.error ||
              "Не удалось получить данные питомцев из Vetmanager."
          );
          setLoading(false);
          return;
        }

        const vetmPets: VetmPet[] =
          json?.pets && Array.isArray(json.pets) ? json.pets : [];

        const found =
          vetmPets.find((p) => String(p.id) === String(petId)) || null;

        if (!cancelled) {
          setPet(found);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Произошла ошибка при загрузке карточки питомца.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [petId, supabase]);

  const handleBackToList = () => {
    router.push("/account"); // вкладка «Питомцы» уже внутри ЛК
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-7">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/account" className="hover:text-onlyvet-coral">
              Личный кабинет
            </Link>{" "}
            / <span className="text-slate-700">Питомец</span>
          </nav>

          {/* Состояния загрузки/ошибок */}
          {loading && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 text-[13px] text-slate-600">
              Загружаем данные питомца…
            </section>
          )}

          {!loading && error && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-3 text-center">
              <div className="text-[15px] font-semibold text-slate-800">
                Произошла ошибка
              </div>
              <p className="text-[13px] text-slate-600">{error}</p>
              <div className="flex justify-center gap-2 text-[12px]">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                >
                  К списку питомцев
                </button>
              </div>
            </section>
          )}

          {!loading && !error && !pet && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-3 text-center">
              <div className="text-[15px] font-semibold text-slate-800">
                Питомец не найден
              </div>
              <p className="text-[13px] text-slate-600 max-w-md mx-auto">
                Карточка питомца с таким идентификатором пока недоступна. Возможно,
                это новый питомец, для которого ещё не создана отдельная
                страница, или вашего доступа недостаточно.
              </p>
              <div className="flex justify-center gap-2 text-[12px]">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                >
                  К списку питомцев
                </button>
                <Link
                  href="/booking"
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  Записаться на консультацию
                </Link>
              </div>
            </section>
          )}

          {!loading && !error && pet && (
            <section className="space-y-5">
              {/* Шапка */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-onlyvet-teal/10 border border-slate-200 flex items-center justify-center text-[18px] font-semibold text-onlyvet-navy">
                    {pet.alias?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-semibold mb-1">
                      {pet.alias || "Питомец"}
                    </h1>
                    <div className="text-[13px] text-slate-600">
                      ID в Vetmanager: {pet.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[12px]">
                  <Link
                    href={`/booking?petId=${pet.id}`}
                    className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                  >
                    Записаться с этим питомцем
                  </Link>
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    К списку питомцев
                  </button>
                </div>
              </div>

              {/* Пока минимум информации, без мок-медкарты */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-2 text-[13px]">
                  <h2 className="text-[14px] font-semibold">
                    Краткая информация
                  </h2>
                  <p className="text-slate-600">
                    Имя/кличка: <span className="font-medium">{pet.alias}</span>
                  </p>
                  <p className="text-[12px] text-slate-500">
                    Дополнительные данные (вид, возраст, пол) будут подтягиваться
                    из Vetmanager, когда мы расширим интеграцию.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 text-[13px]">
                  <h2 className="text-[14px] font-semibold mb-1">
                    Документы и медкарта
                  </h2>
                  <p className="text-[12px] text-slate-600">
                    В следующих итерациях мы подключим сюда анализы, исследования,
                    выписки и заключения из Vetmanager. Пока эту информацию можно
                    посмотреть в личном кабинете Vetmanager или запросить у
                    администратора.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
