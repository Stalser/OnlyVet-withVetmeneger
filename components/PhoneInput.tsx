// components/PhoneInput.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type CountryCode =
  | "RU"
  | "KZ"
  | "BY"
  | "UA"
  | "AM"
  | "GE"
  | "KG";

type CountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string; // без знака "+"
  flag: string;
};

const COUNTRIES: CountryOption[] = [
  { code: "RU", name: "Россия", dialCode: "7", flag: "🇷🇺" },
  { code: "KZ", name: "Казахстан", dialCode: "7", flag: "🇰🇿" },
  { code: "BY", name: "Беларусь", dialCode: "375", flag: "🇧🇾" },
  { code: "UA", name: "Украина", dialCode: "380", flag: "🇺🇦" },
  { code: "AM", name: "Армения", dialCode: "374", flag: "🇦🇲" },
  { code: "GE", name: "Грузия", dialCode: "995", flag: "🇬🇪" },
  { code: "KG", name: "Киргизия", dialCode: "996", flag: "🇰🇬" },
];

function findCountryByCode(code: CountryCode): CountryOption {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

function findCountryByPhone(value: string): {
  country: CountryOption;
  localDigits: string;
} {
  const digits = value.replace(/\D/g, "");

  // Ищем страну по коду: от самых длинных к коротким
  const byDialCode =
    COUNTRIES.slice()
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((c) => digits.startsWith(c.dialCode)) ?? COUNTRIES[0];

  const localDigits = digits.startsWith(byDialCode.dialCode)
    ? digits.slice(byDialCode.dialCode.length)
    : digits;

  return { country: byDialCode, localDigits };
}

function formatLocalDigits(digits: string, country: CountryOption): string {
  // Очень лёгкое форматирование — без фанатизма
  // Для РФ/КЗ — 3-3-2-2, для остальных просто группируем по 3–4
  if (country.dialCode === "7") {
    // ожидаем до 10 цифр
    const d = digits.slice(0, 10);
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 6);
    const p3 = d.slice(6, 8);
    const p4 = d.slice(8, 10);

    return [p1, p2, p3, p4].filter(Boolean).join("-");
  }

  // общий случай
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string | null;
}

/**
 * Красивый ввод телефона:
 * - слева выбор страны (+ код)
 * - справа только номер без дублирования кода
 * - наружу отдаёт строку вида "+7 9829138405"
 */
export function PhoneInput({
  value,
  onChange,
  label = "Телефон",
  required,
  error,
}: PhoneInputProps) {
  const [country, setCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [localDigits, setLocalDigits] = useState<string>("");

  // Инициализация по входящему значению
  useEffect(() => {
    if (!value) return;
    const { country: c, localDigits: ld } = findCountryByPhone(value);
    setCountry(c);
    setLocalDigits(ld);
  }, [value]);

  // Форматированное значение для отображения
  const formattedLocal = useMemo(
    () => formatLocalDigits(localDigits, country),
    [localDigits, country]
  );

  // Обновление вверх
  const pushChange = (nextCountry: CountryOption, nextLocalDigits: string) => {
    const trimmedDigits = nextLocalDigits.replace(/\D/g, "");
    if (!trimmedDigits) {
      onChange("");
      return;
    }
    const full = `+${nextCountry.dialCode} ${trimmedDigits}`;
    onChange(full);
  };

  const handleCountryChange = (code: string) => {
    const next = findCountryByCode(code as CountryCode);
    setCountry(next);
    // оставляем локальные цифры, просто меняем код
    pushChange(next, localDigits);
  };

  const handleLocalChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 15); // защита от перебора
    setLocalDigits(digitsOnly);
    pushChange(country, digitsOnly);
  };

  return (
    <div className="w-full space-y-1">
      {/* Основный лейбл */}
      <label className="block text-[12px] text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Подписи для двух полей */}
      <div className="grid grid-cols-1 md:grid-cols-[160px,1fr] gap-2 text-[11px] text-slate-500">
        <div>Код страны</div>
        <div>Номер телефона</div>
      </div>

      {/* Страна + номер */}
      <div className="grid grid-cols-1 md:grid-cols-[160px,1fr] gap-2">
        {/* Страна */}
        <div>
          <div className="relative">
            <select
              value={country.code}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="
                w-full appearance-none rounded-xl border border-slate-300 bg-white
                px-3 py-2 text-[13px] pr-8
                focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
              "
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} (+{c.dialCode})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400 text-xs">
              ▾
            </span>
          </div>
        </div>

        {/* Номер */}
        <div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-onlyvet-teal/40">
            <span className="text-[13px] text-slate-500 whitespace-nowrap">
              +{country.dialCode}
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={formattedLocal}
              onChange={(e) => handleLocalChange(e.target.value)}
              className="w-full border-none bg-transparent text-[13px] focus:outline-none"
              placeholder={
                country.dialCode === "7"
                  ? "912 345-67-89"
                  : "номер телефона"
              }
            />
          </div>
        </div>
      </div>

      {/* Подсказка / ошибка */}
      {error ? (
        <p className="mt-1 text-[11px] text-rose-600">{error}</p>
      ) : (
        <p className="mt-1 text-[11px] text-slate-500">
          Номер нужен для связи с вами и поиска карты в клинике.
        </p>
      )}
    </div>
  );
}

export default PhoneInput;
