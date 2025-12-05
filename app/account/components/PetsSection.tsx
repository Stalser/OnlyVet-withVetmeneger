// app/account/components/PetsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type UiPet = {
  id: number;
  alias: string;
  kind?: string;
  age?: string;
  notes?: string;
};

const supabase = getSupabaseClient();

function PetsSection() {
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<UiPet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [hasProfilePhone, setHasProfilePhone] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: authError } = await supabase.auth.getUser();
        if (authError || !data.user) {
          setError(
            "Не удалось получить данные пользователя. Авторизуйтесь ещё раз."
          );
          setLoading(false);
          return;
        }

        const user = data.user;
        const meta = (user.user_metadata || {}) as any;

        const phoneFromMeta: string | undefined =
          meta.phone || meta.cell_phone || meta.phone_number;

        const firstName: string | undefined = meta.first_name || meta.firstName;
        const lastName: string | undefined = meta.last_name || meta.lastName;
        const email: string | undefined = user.email || meta.email;

        if (!phoneFromMeta) {
          setHasProfilePhone(false);
          setLoading(false);
          return;
        }

        setHasProfilePhone(true);
        setPhone(phoneFromMeta);

        // Запрос к нашему API → Vetmanager
        const resp = await fetch("/api/vetm/pets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phoneFromMeta,
            firstName,
            lastName,
            email,
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(
            data.error || `Ошибка загрузки питомцев (HTTP ${resp.status})`
          );
        }

        const json = (await resp.json()) as {
          client: any;
          pets: any[];
        };

        if (cancelled) return;

        const uiPets: UiPet[] = (json.pets || []).map((p) => ({
          id: Number(p.id),
          alias: p.alias,
          kind: p.species_name || p.type || "",
          age: p.birthday ? formatAgeFromBirthday(p.birthday) : "",
          notes: p.note || "",
        }));

        setPets(uiPets);
      } catch (e: any) {
        console.error("[PetsSection] error:", e);
        if (!cancelled) {
          setError(e?.message || "Ошибка загрузки данных из Vetmanager.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasProfilePhone) {
    return (
      <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-2">
          Питомцы
        </h2>
        <p className="text-[13px] text-slate-600 mb-3">
          Чтобы загрузить список питомцев из Vetmanager, укажите номер телефона
          в разделе{" "}
          <Link
            href="/account?tab=profile"
            className="text-onlyvet-coral underline"
          >
            Профиль
          </Link>
          . Телефон используется для поиска или создания карточки владельца в
          вашей CRM.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Список питомцев берётся напрямую из Vetmanager по вашему номеру
            телефона.
          </p>
          {phone && (
            <p className="text-[11px] text-slate-500 mt-1">
              Телефон для поиска в CRM:{" "}
              <span className="font-mono">{phone}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 transition"
        >
          Добавить питомца (через Vetmanager)
        </button>
      </div>

      {loading && (
        <p className="text-[13px] text-slate-600">
          Загружаем питомцев из Vetmanager…
        </p>
      )}

      {error && (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && pets && pets.length === 0 && (
        <div className="text-[13px] text-slate-600">
          Питомцы в Vetmanager для этого владельца ещё не заведены. Вы можете
          добавить питомца в Vetmanager — после этого он появится здесь.
        </div>
      )}

      {!loading && !error && pets && pets.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 space-y-1 text-[13px]"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">
                  {pet.alias || "Питомец без имени"}
                </div>
                <span className="text-[11px] text-slate-500">
                  ID: {pet.id}
                </span>
              </div>
              {pet.kind && (
                <div className="text-slate-700">
                  {pet.kind} {pet.age ? `· ${pet.age}` : ""}
                </div>
              )}
              {pet.notes && (
                <div className="text-[12px] text-slate-600">{pet.notes}</div>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                <Link
                  href={`/account/pets/${pet.id}`}
                  className="inline-flex text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
                >
                  Открыть карточку питомца
                </Link>
                <Link
                  href={`/booking?petId=${pet.id}`}
                  className="inline-flex px-3 py-1.5 rounded-full bg-onlyvet-coral text-white hover:brightness-105 shadow-[0_8px_20px_rgba(247,118,92,0.45)] transition"
                >
                  Записаться
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatAgeFromBirthday(birthday: string): string {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const years = now.getFullYear() - d.getFullYear();
  if (years <= 0) return "";
  return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`;
}

export default PetsSection;
