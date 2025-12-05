"use client";

import { useEffect, useState, FormEvent } from "react";
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
  notes: string | null;
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
  const supabase = getSupabaseClient();

  const [pets, setPets] = useState<NormalizedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // форма добавления
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecies, setNewSpecies] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("pets")
          .select("id, name, species, age_text, weight_kg, notes")
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
  }, [supabase, user.id]);

  const hasPets = pets.length > 0;

  const resetForm = () => {
    setNewName("");
    setNewSpecies("");
    setNewAge("");
    setNewWeight("");
    setNewNotes("");
    setFormError(null);
  };

  const handleAddPetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameTrimmed = newName.trim();
    if (!nameTrimmed) {
      setFormError("Укажите кличку питомца.");
      return;
    }

    try {
      setSaving(true);

      const weightNumber =
        newWeight.trim().length > 0 ? Number(newWeight.replace(",", ".")) : null;

      const insertPayload = {
        owner_id: user.id,
        name: nameTrimmed,
        species: newSpecies.trim() || null,
        age_text: newAge.trim() || null,
        weight_kg:
          typeof weightNumber === "number" && !Number.isNaN(weightNumber)
            ? weightNumber
            : null,
        notes: newNotes.trim() || null,
      };

      const { data, error } = await supabase
        .from("pets")
        .insert(insertPayload)
        .select("id, name, species, age_text, weight_kg")
        .single<PetRecord>();

      if (error) {
        console.error("[PetsSection] insert pet error:", error);
        setFormError(
          error.message || "Не удалось сохранить питомца. Попробуйте позже."
        );
        return;
      }

      const newPet: NormalizedPet = {
        id: data.id,
        name: data.name,
        species: data.species || "",
        age: data.age_text || "",
        weight:
          data.weight_kg !== null && data.weight_kg !== undefined
            ? String(data.weight_kg).replace(/\.0+$/, "")
            : undefined,
      };

      setPets((prev) => [...prev, newPet]);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("[PetsSection] unexpected insert error:", err);
      setFormError("Техническая ошибка при сохранении питомца.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      {/* Заголовок + кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
          onClick={() => {
            setShowForm((prev) => !prev);
            setFormError(null);
          }}
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 transition"
        >
          {showForm ? "Отменить" : "Добавить питомца"}
        </button>
      </div>

      {/* Форма добавления нового питомца */}
      {showForm && (
        <form
          onSubmit={handleAddPetSubmit}
          className="rounded-2xl border border-slate-200 bg-onlyvet-bg px-4 py-3 space-y-3 text-[13px]"
        >
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Кличка<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: Локи"
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Вид / порода
              </label>
              <input
                type="text"
                value={newSpecies}
                onChange={(e) => setNewSpecies(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: кошка, шотландская"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Возраст (текстом)
              </label>
              <input
                type="text"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: 2 года, 8 месяцев"
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Вес (кг)
              </label>
              <input
                type="text"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: 4.8"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Особенности / комментарий (необязательно)
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              placeholder="Хронические заболевания, особенности поведения и т.п."
            />
          </div>

          {formError && (
            <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {formError}
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-[12px] pt-1">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-full font-medium ${
                saving
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
              }`}
            >
              {saving ? "Сохраняем..." : "Сохранить питомца"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Отменить
            </button>
          </div>
        </form>
      )}

      {/* Основной контент: список питомцев */}
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
          Пока у вас не добавлено ни одного питомца. Вы можете добавить питомца
          вручную или через оформление заявки на консультацию.
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
