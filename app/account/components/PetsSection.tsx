// app/account/components/PetsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type VetmPet = {
  id: number;
  alias: string;       // кличка
  owner_id: number;
  birthday?: string;
  sex?: string;
};

type LoadedPet = {
  id: string;
  name: string;
};

export function PetsSection() {
  const supabase = getSupabaseClient();

  const [pets, setPets] = useState<LoadedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setInfo(null);

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
          setInfo(
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
              "Не удалось получить список питомцев из Vetmanager."
          );
          setLoading(false);
          return;
        }

        const vetmPets: VetmPet[] =
          json?.pets && Array.isArray(json.pets) ? json.pets : [];

        const mapped: LoadedPet[] = vetmPets.map((p) => ({
          id: String(p.id),
          name: p.alias,
        }));

        if (!cancelled) {
          setPets(mapped);
          setLoading(false);

          if (mapped.length === 0) {
            setInfo(
              "Мы не нашли питомцев в Vetmanager для этого клиента. Добавьте питомца в Vetmanager или через администратора клиники."
            );
          }
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Произошла ошибка при загрузке питомцев.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const hasPets = pets.length > 0;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Здесь отображаются питомцы, закреплённые за вашим аккаунтом в
            Vetmanager. В дальнейшем данные будут синхронизироваться с
            медицинскими картами и документами.
          </p>
        </div>

        {/* Пока не реализуем создание напрямую — работаем через Vetmanager/админа */}
        <button
          type="button"
          className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-[12px] text-slate-700 hover:bg-slate-50 transition"
          disabled
        >
          Добавить питомца (через Vetmanager)
        </button>
      </div>

      {loading && (
        <p className="text-[13px] text-slate-600">Загружаем список питомцев…</p>
      )}

      {!loading && error && (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && info && (
        <div className="text-[12px] text-slate-600 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-2">
          {info}
        </div>
      )}

      {!loading && !error && hasPets && (
        <div className="grid gap-3 md:grid-cols-2">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 space-y-2 text-[13px]"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">
                  {pet.name || "Питомец без имени"}
                </div>
                <span className="text-[11px] text-slate-500">
                  ID: {pet.id}
                </span>
              </div>

              <div className="flex justify-between items-center text-[12px]">
                <Link
                  href={`/account/pets/${pet.id}`}
                  className="text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
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
      )}

      {!loading && !error && !hasPets && !info && (
        <p className="text-[13px] text-slate-600">
          У вас пока нет питомцев в Vetmanager. Добавьте питомца через
          регистратуру клиники или в интерфейсе Vetmanager.
        </p>
      )}
    </section>
  );
}
