// app/account/components/PetsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type PetRow = {
  id: string;
  owner_id: string;
  name: string;
  species: string | null;
  age_text: string | null;
  weight_kg: number | null;
  notes: string | null;
};

type PetViewModel = {
  id: string;
  name: string;
  species: string;
  ageText: string;
  weightLabel?: string;
  notes?: string;
};

type FormMode = "create" | "edit";

export default function PetsSection() {
  const supabase = getSupabaseClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [pets, setPets] = useState<PetViewModel[]>([]);

  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [ageText, setAgeText] = useState("");
  const [weightText, setWeightText] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formTouched, setFormTouched] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const nameError = formTouched && !name.trim();

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setName("");
    setSpecies("");
    setAgeText("");
    setWeightText("");
    setNotes("");
    setFormTouched(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  // Подгружаем пользователя + питомцев
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          if (!cancelled) {
            setLoadError("Не удалось получить данные пользователя.");
          }
          return;
        }

        if (cancelled) return;

        setUser({
          id: user.id,
          email: user.email || undefined,
          user_metadata: user.user_metadata || {},
        });

        const { data, error } = await supabase
          .from("pets")
          .select(
            "id, owner_id, name, species, age_text, weight_kg, notes"
          )
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("[PetsSection] load pets error:", error);
          setLoadError("Не удалось загрузить список питомцев.");
          return;
        }

        const vm: PetViewModel[] =
          data?.map((row: PetRow) => ({
            id: row.id,
            name: row.name,
            species: row.species || "",
            ageText: row.age_text || "",
            weightLabel:
              row.weight_kg !== null && row.weight_kg !== undefined
                ? `${String(row.weight_kg).replace(/\.0+$/, "")} кг`
                : undefined,
            notes: row.notes || undefined,
          })) ?? [];

        setPets(vm);
      } catch (err) {
        console.error("[PetsSection] unexpected load error:", err);
        if (!cancelled) {
          setLoadError("Техническая ошибка при загрузке питомцев.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setSaveError(null);
    setSaveSuccess(null);

    if (!user) {
      setSaveError("Пользователь не найден. Повторите вход в систему.");
      return;
    }

    if (!name.trim()) return;

    setSaving(true);

    try {
      const weightNum = weightText.trim()
        ? Number(weightText.replace(",", "."))
        : null;

      if (mode === "create") {
        const { data, error } = await supabase
          .from("pets")
          .insert({
            owner_id: user.id,
            name: name.trim(),
            species: species.trim() || null,
            age_text: ageText.trim() || null,
            weight_kg:
              weightNum !== null && !Number.isNaN(weightNum)
                ? weightNum
                : null,
            notes: notes.trim() || null,
          })
          .select(
            "id, owner_id, name, species, age_text, weight_kg, notes"
          )
          .single<PetRow>();

        if (error) {
          console.error("[PetsSection] create pet error:", error);
          setSaveError("Не удалось сохранить питомца.");
          return;
        }

        const vm: PetViewModel = {
          id: data.id,
          name: data.name,
          species: data.species || "",
          ageText: data.age_text || "",
          weightLabel:
            data.weight_kg !== null && data.weight_kg !== undefined
              ? `${String(data.weight_kg).replace(/\.0+$/, "")} кг`
              : undefined,
          notes: data.notes || undefined,
        };

        setPets((prev) => [...prev, vm]);
        setSaveSuccess("Питомец сохранён.");
        resetForm();
      } else if (mode === "edit" && editingId) {
        const { data, error } = await supabase
          .from("pets")
          .update({
            name: name.trim(),
            species: species.trim() || null,
            age_text: ageText.trim() || null,
            weight_kg:
              weightNum !== null && !Number.isNaN(weightNum)
                ? weightNum
                : null,
            notes: notes.trim() || null,
          })
          .eq("id", editingId)
          .eq("owner_id", user.id)
          .select(
            "id, owner_id, name, species, age_text, weight_kg, notes"
          )
          .single<PetRow>();

        if (error) {
          console.error("[PetsSection] update pet error:", error);
          setSaveError("Не удалось обновить данные питомца.");
          return;
        }

        const vm: PetViewModel = {
          id: data.id,
          name: data.name,
          species: data.species || "",
          ageText: data.age_text || "",
          weightLabel:
            data.weight_kg !== null && data.weight_kg !== undefined
              ? `${String(data.weight_kg).replace(/\.0+$/, "")} кг`
              : undefined,
          notes: data.notes || undefined,
        };

        setPets((prev) =>
          prev.map((p) => (p.id === data.id ? vm : p))
        );
        setSaveSuccess("Изменения сохранены.");
        resetForm();
      }
    } catch (err) {
      console.error("[PetsSection] submit error:", err);
      setSaveError("Техническая ошибка при сохранении.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pet: PetViewModel) => {
    setMode("edit");
    setEditingId(pet.id);
    setName(pet.name);
    setSpecies(pet.species || "");
    setAgeText(pet.ageText || "");
    // вытаскиваем число из подписи "4.8 кг"
    const weight = pet.weightLabel?.replace(" кг", "") ?? "";
    setWeightText(weight);
    setNotes(pet.notes || "");
    setFormTouched(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Удалить этого питомца?")) return;

    setDeletingId(id);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) {
        console.error("[PetsSection] delete pet error:", error);
        setSaveError("Не удалось удалить питомца.");
        return;
      }

      setPets((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setSaveSuccess("Питомец удалён.");
    } catch (err) {
      console.error("[PetsSection] delete error:", err);
      setSaveError("Техническая ошибка при удалении.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      {/* Заголовок блока */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Здесь отображаются питомцы, закреплённые за вашим аккаунтом.
            В будущем данные будут синхронизироваться с Vetmanager.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
        >
          Записаться на консультацию
        </Link>
      </div>

      {/* Форма создания / редактирования */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-onlyvet-bg p-4 md:p-5 space-y-3 text-[13px]"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-semibold text-slate-900">
            {mode === "create" ? "Новый питомец" : "Редактировать питомца"}
          </div>
          {mode === "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[11px] text-slate-500 hover:text-onlyvet-coral underline underline-offset-2"
            >
              Отменить редактирование
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Кличка<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setFormTouched(true)}
              className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                nameError
                  ? "border-rose-400 focus:ring-rose-300"
                  : "border-slate-300 focus:ring-onlyvet-teal/40"
              }`}
              placeholder="Например: Локи"
            />
            {nameError && (
              <p className="mt-1 text-[11px] text-rose-600">
                Укажите кличку питомца.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Вид / порода
            </label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              placeholder="Например: кошка, шотландская"
            />
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Возраст (текстом)
            </label>
            <input
              type="text"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value)}
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
              value={weightText}
              onChange={(e) => setWeightText(e.target.value)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            placeholder="Хронические заболевания, особенности поведения и т.п."
          />
        </div>

        {saveError && (
          <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            {saveSuccess}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className={`
              px-4 py-2 rounded-full text-[13px] font-medium
              ${
                saving
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-onlyvet-coral text-white shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105"
              }
            `}
          >
            {saving
              ? "Сохраняем..."
              : mode === "create"
              ? "Сохранить питомца"
              : "Сохранить изменения"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-full border border-slate-300 text-[13px] text-slate-700 bg-white hover:bg-slate-50 transition"
          >
            Отменить
          </button>
        </div>
      </form>

      {/* Список питомцев */}
      <div className="pt-2">
        {loading ? (
          <p className="text-[12px] text-slate-500">
            Загружаем список питомцев…
          </p>
        ) : pets.length === 0 ? (
          <p className="text-[12px] text-slate-500">
            Пока у вас не добавлено ни одного питомца. Вы можете добавить
            питомца вручную или через оформление заявки на консультацию.
          </p>
        ) : (
          <div className="space-y-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 md:p-3.5 flex flex-col gap-1.5 text-[13px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">
                    {pet.name}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ID: {pet.id.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-700">
                  {pet.species || "Вид не указан"}
                </div>
                {(pet.ageText || pet.weightLabel) && (
                  <div className="text-[12px] text-slate-600">
                    {pet.ageText && <>Возраст: {pet.ageText}</>}
                    {pet.ageText && pet.weightLabel && " · "}
                    {pet.weightLabel && <>Вес: {pet.weightLabel}</>}
                  </div>
                )}
                {pet.notes && (
                  <div className="text-[12px] text-slate-600 mt-1">
                    {pet.notes}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2 text-[12px]">
                  <Link
                    href={`/account/pets/${pet.id}`}
                    className="px-2.5 py-1 rounded-full border border-slate-300 bg-white text-onlyvet-navy hover:bg-slate-50 transition"
                  >
                    Открыть карточку
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEdit(pet)}
                    className="px-2.5 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pet.id)}
                    disabled={deletingId === pet.id}
                    className={`px-2.5 py-1 rounded-full border text-[12px] ${
                      deletingId === pet.id
                        ? "border-rose-200 bg-rose-50 text-rose-400 cursor-not-allowed"
                        : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    {deletingId === pet.id ? "Удаляем..." : "Удалить"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {loadError && (
          <p className="mt-2 text-[12px] text-rose-600">{loadError}</p>
        )}
      </div>
    </section>
  );
}
