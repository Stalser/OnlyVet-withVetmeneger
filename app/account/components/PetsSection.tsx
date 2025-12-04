"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type PetRecord = {
  id: string;
  name: string;
  species: string | null;
  age_text: string | null;
  weight_kg: number | null;
};

type NormalizedPet = {
  id: string;
  name: string;
  species: string;
  age: string;
  weight?: string;
};

type Props = {
  user: SupabaseUser;
};

export default function PetsSection({ user }: Props) {
  const [pets, setPets] = useState<NormalizedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseClient();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // предполагаем, что в таблице pets есть колонка owner_id, связанная с auth.users.id
        const { data, error } = await supabase
          .from("pets")
          .select("id, name, species, age_text, weight_kg")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("[PetsSection] Supabase error:", error);
          setError("Не удалось загрузить список питомцев.");
          setPets([]);
          return;
        }

        const rows = (data || []) as PetRecord[];

        const normalized: NormalizedPet[] = rows.map((row) => ({
          id: row.id,
          name: row.name,
          species: row.species || "",
          age: row.age_text || "",
          weight:
            row.weight_kg !== null && row.weight_kg !== undefined
              ? String(row.weight_kg).replace(/\.0+$/, "")
              : undefined,
        }));

        setPets(normalized);
      } catch (err) {
        console.error("[PetsSection] unexpected error:", err);
        if (!cancelled) {
          setError("Техническая ошибка при загрузке питомцев.");
          setPets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const hasPets = pets.length > 0;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Здесь отображаются питомцы, закреплённые за вашим аккаунтом. В
            будущем данные будут синхронизироваться с Vetmanager.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 transition"
        >
          Добавить питомца
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-onlyvet-bg px-4 py-3 text-[12px] text-slate-600">
          Загружаем список питомцев…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
          {error}
        </div>
      ) : !hasPets ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-onlyvet-bg px-4 py-3 text-[12px] text-slate-600">
          Пока у вас не добавлено ни одного питомца. В дальнейшем здесь появятся
          карточки животных с привязкой к консультациям и документам.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 space-y-1 text-[13px]"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{pet.name}</div>
                <span className="text-[11px] text-slate-500">
                  ID: {pet.id.toString().slice(0, 8).toUpperCase()}
                </span>
              </div>
              {pet.species && (
                <div className="text-slate-700">{pet.species}</div>
              )}
              {(pet.age || pet.weight) && (
                <div className="text-[12px] text-slate-600">
                  {pet.age && <>Возраст: {pet.age}</>}
                  {pet.weight && (
                    <>
                      {pet.age && " · "}
                      Вес: {pet.weight} кг
                    </>
                  )}
                </div>
              )}
              <Link
                href={`/account/pets/${pet.id}`}
                className="mt-1 inline-flex text-[12px] text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
              >
                Открыть карточку питомца
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
