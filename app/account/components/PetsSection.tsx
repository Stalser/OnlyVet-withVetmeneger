// app/account/components/PetsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type VetmPet = {
  id: number;
  alias: string;
  owner_id: number;
  birthday?: string;
  sex?: string;
};

type PetsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; pets: VetmPet[]; vetmClientId: number };

const supabase = getSupabaseClient();

export default function PetsSection() {
  const [state, setState] = useState<PetsState>({ status: "idle" });

  const loadPets = async () => {
    try {
      setState({ status: "loading" });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("[PetsSection] getUser error:", userError);
        setState({
          status: "error",
          message:
            "Не удалось определить пользователя. Попробуйте выйти и войти снова.",
        });
        return;
      }

      if (!user) {
        setState({
          status: "error",
          message: "Требуется войти в личный кабинет.",
        });
        return;
      }

      const res = await fetch("/api/vetmanager/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseUserId: user.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setState({
          status: "error",
          message:
            data?.error ||
            "Не удалось загрузить список питомцев. Попробуйте позже.",
        });
        return;
      }

      setState({
        status: "ready",
        pets: data.pets || [],
        vetmClientId: data.vetmClientId,
      });
    } catch (err: any) {
      console.error("[PetsSection] unexpected error:", err);
      setState({
        status: "error",
        message:
          "Произошла техническая ошибка при загрузке питомцев. Попробуйте позже.",
      });
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const isLoading = state.status === "loading";
  const hasError = state.status === "error";
  const isReady = state.status === "ready";

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Список питомцев берётся напрямую из карты клиента в клинике и
            всегда соответствует данным в медицинской карте.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPets}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-[12px] hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Обновляем..." : "Обновить список"}
        </button>
      </div>

      {hasError && state.status === "error" && (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
          {state.message}
        </div>
      )}

      {isReady && state.status === "ready" && state.pets.length === 0 && (
        <div className="text-[12px] text-slate-600 bg-onlyvet-bg border border-slate-200 rounded-2xl px-3 py-3">
          Для этого аккаунта ещё не заведены питомцы в клинике. Вы можете
          добавить питомца через Vetmanager — после этого он появится здесь.
        </div>
      )}

      {isReady && state.status === "ready" && state.pets.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {state.pets.map((pet) => (
            <article
              key={pet.id}
              className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3 space-y-1 text-[13px]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-900">
                    {pet.alias}
                  </div>
                  <div className="text-[12px] text-slate-500">
                    ID в клинике: {pet.id}
                  </div>
                </div>
                <Link
                  href={`/account/pets/${pet.id}`}
                  className="px-3 py-1 rounded-full bg-white border border-slate-300 text-[12px] text-onlyvet-navy hover:bg-slate-50 transition"
                >
                  Открыть карточку
                </Link>
              </div>

              {pet.birthday && (
                <div className="text-[12px] text-slate-600">
                  Дата рождения: {pet.birthday}
                </div>
              )}
              {pet.sex && (
                <div className="text-[12px] text-slate-600">
                  Пол: {pet.sex}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {state.status === "idle" && (
        <div className="text-[12px] text-slate-500">
          Загрузка списка питомцев...
        </div>
      )}
    </section>
  );
}
