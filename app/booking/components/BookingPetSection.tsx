"use client";

type PetMode = "existing" | "new";

type PetOption = {
  id: string;
  name: string;
};

type BookingPetSectionProps = {
  petMode: PetMode;
  setPetMode: (mode: PetMode) => void;

  selectedPetId: string;
  setSelectedPetId: (id: string) => void;

  newPetName: string;
  setNewPetName: (v: string) => void;
  newPetSpecies: string;
  setNewPetSpecies: (v: string) => void;
  newPetBreed: string;
  setNewPetBreed: (v: string) => void;
  newPetAge: string;
  setNewPetAge: (v: string) => void;
  newPetWeight: string;
  setNewPetWeight: (v: string) => void;

  newPetNameError: boolean;

  isLoggedIn: boolean;
  pets: PetOption[];
};

export function BookingPetSection({
  petMode,
  setPetMode,
  selectedPetId,
  setSelectedPetId,
  newPetName,
  setNewPetName,
  newPetSpecies,
  setNewPetSpecies,
  newPetBreed,
  setNewPetBreed,
  newPetAge,
  setNewPetAge,
  newPetWeight,
  setNewPetWeight,
  newPetNameError,
  isLoggedIn,
  pets,
}: BookingPetSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Информация о питомце</h2>

      {/* переключатель режимов */}
      <div className="flex flex-wrap gap-3 text-[12px]">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="petMode"
            value="existing"
            checked={petMode === "existing"}
            onChange={() => setPetMode("existing")}
            className="rounded-full border-slate-300"
          />
          <span>Выбрать из существующих (личный кабинет)</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="petMode"
            value="new"
            checked={petMode === "new"}
            onChange={() => setPetMode("new")}
            className="rounded-full border-slate-300"
          />
          <span>Новый питомец</span>
        </label>
      </div>

      {petMode === "existing" ? (
        isLoggedIn && pets.length > 0 ? (
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Питомец
            </label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            >
              <option value="">Выберите питомца</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              В реальной версии здесь будут данные из вашего личного кабинета.
            </p>
          </div>
        ) : (
          <p className="text-[12px] text-slate-500">
            Для выбора существующего питомца нужен личный кабинет. Пока можно
            указать питомца как нового.
          </p>
        )
      ) : (
        <div className="space-y-3">
          {/* кличка */}
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Кличка<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                newPetNameError
                  ? "border-rose-400 focus:ring-rose-300"
                  : "border-slate-300 focus:ring-onlyvet-teal/40"
              }`}
              placeholder="Например: Локи"
            />
            {newPetNameError && (
              <p className="mt-1 text-[11px] text-rose-600">
                Укажите кличку питомца.
              </p>
            )}
          </div>

          {/* вид / порода */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Вид
              </label>
              <select
                value={newPetSpecies}
                onChange={(e) => setNewPetSpecies(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              >
                <option value="">
                  Выберите вид или оставьте пустым
                </option>
                <option value="кошка">Кошка</option>
                <option value="собака">Собака</option>
                <option value="грызун">Грызун</option>
                <option value="птица">Птица</option>
                <option value="другое">Другое</option>
                <option value="не знаю">Не знаю</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Порода
              </label>
              <input
                type="text"
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: шотландская, метис и т.п."
              />
            </div>
          </div>

          {/* возраст / вес */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Возраст
              </label>
              <input
                type="text"
                value={newPetAge}
                onChange={(e) => setNewPetAge(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: 2 года, 8 месяцев, не знаю"
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Вес (примерно)
              </label>
              <input
                type="text"
                value={newPetWeight}
                onChange={(e) => setNewPetWeight(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                placeholder="Например: 4.5 кг, ~20 кг, не знаю"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
