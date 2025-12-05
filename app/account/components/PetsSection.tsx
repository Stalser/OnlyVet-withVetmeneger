// app/account/components/PetsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VetmPet = {
  id: number;
  alias: string;       // кличка
  owner_id: number;
  birthday?: string;
  sex?: string;
};

type PetsApiResponse =
  | {
      success: true;
      vetm_client_id: number;
      pets: VetmPet[];
    }
  | {
      success?: false;
      error: string;
    };

export default function PetsSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pets, setPets] = useState<VetmPet[]>([]);
  const [vetmClientId, setVetmClientId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/vetmanager/pets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = (await res.json()) as PetsApiResponse;

        if (!res.ok || "error" in data) {
          if (!cancelled) {
            setError(
              data && "error" in data && data.error
                ? data.error
                : "Не удалось загрузить список питомцев."
            );
          }
          return;
        }

        if (!cancelled) {
          setPets(data.pets || []);
          setVetmClientId(data.vetm_client_id);
        }
      } catch (err) {
        console.error("[PetsSection] load error", err);
        if (!cancelled) {
          setError("Произошла ошибка при загрузке питомцев.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasPets = pets.length > 0;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      {/* Заголовок секции */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Здесь отображаются питомцы, закреплённые за вашим аккаунтом в
            клинике. Список всегда соответствует данным в медицинской карте.
          </p>
          {vetmClientId && (
            <p className="mt-1 text-[11px] text-slate-400">
              Идентификатор владельца в системе клиники: {vetmClientId}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-[12px]">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
            onClick={() => {
              // пока просто лёгкий reload, позже можно сделать отдельную кнопку "Синхронизировать"
              window.location.reload();
            }}
          >
            Обновить список
          </button>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Состояние загрузки */}
      {loading && !error && (
        <div className="text-[12px] text-slate-500">
          Загружаем список питомцев...
        </div>
      )}

      {/* Контент */}
      {!loading && !error && (
        <>
          {hasPets ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <article
                  key={pet.id}
                  className="rounded-3xl border border-slate-200 bg-onlyvet-bg p-4 flex flex-col gap-2 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-semibold text-slate-900">
                        {pet.alias}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        ID в системе клиники: {pet.id}
                      </div>
                    </div>
                  </div>

                  {/* Дополнительная строка — можно расширить, когда поймём, какие поля реально приходят */}
                  <p className="text-[12px] text-slate-600">
                    Карточка питомца ведётся в клинике. Подробная медкарта,
                    анализы и исследования будут доступны после полной
                    интеграции.
                  </p>

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
                      Записаться с этим питомцем
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-onlyvet-bg p-5 text-[13px] text-slate-700 space-y-2">
              <div className="font-semibold text-slate-900">
                Питомцы ещё не заведены
              </div>
              <p className="text-[12px] text-slate-600">
                В вашей карте пока нет ни одного питомца. Как только в клинике
                заведут карточку, здесь появится список животных.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
