// components/PhoneInput.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type CountryOption = {
  code: string;      // ISO-код (для нас чисто внутренний идентификатор)
  name: string;      // Название для выпадающего списка
  dialCode: string;  // Цифровой код страны без плюса (7, 1, 44 и т.д.)
  label: string;     // То, что показываем в селекте
};

// Минимальный набор стран — можно дополнять потом
const COUNTRIES: CountryOption[] = [
  {
    code: "RU",
    name: "Россия",
    dialCode: "7",
    label: "Россия +7",
  },
  {
    code: "KZ",
    name: "Казахстан",
    dialCode: "7",
    label: "Казахстан +7",
  },
  {
    code: "US",
    name: "США",
    dialCode: "1",
    label: "США +1",
  },
  {
    code: "EU",
    name: "Европа",
    dialCode: "44",
    label: "Европа +44",
  },
];

type PhoneInputProps = {
  /**
   * Нормализованный телефон: только цифры, включая код страны.
   * Примеры:
   *  - "79829138405"
   *  - "14155552671"
   */
  value: string;
  onChange: (normalized: string) => void;

  label?: string;
  required?: boolean;
  disabled?: boolean;

  /** Флаг ошибки (для подсветки поля) */
  error?: boolean;

  /** Текст подсказки / ошибки под полем */
  helperText?: string;
};

function normalizeDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

function detectCountry(value: string | undefined): CountryOption {
  const digits = normalizeDigits(value ?? "");

  if (!digits) {
    return COUNTRIES[0]; // Россия по умолчанию
  }

  // Ищем страну по префиксу dialCode
  const found =
    COUNTRIES.find((c) => digits.startsWith(c.dialCode)) ?? COUNTRIES[0];

  return found;
}

export default function PhoneInput(props: PhoneInputProps) {
  const {
    value,
    onChange,
    label,
    required,
    disabled,
    error = false,
    helperText,
  } = props;

  // Вычисляем страну из текущего значения
  const initialCountry = useMemo(() => detectCountry(value), [value]);

  const [country, setCountry] = useState<CountryOption>(initialCountry);
  const [localPart, setLocalPart] = useState<string>(() => {
    const digits = normalizeDigits(value);
    if (!digits) return "";
    // Отрезаем код страны и оставляем "хвост"
    return digits.slice(initialCountry.dialCode.length);
  });

  // Если значение снаружи поменялось (например, при сбросе формы) —
  // синхронизируем локальное состояние
  useEffect(() => {
    const detected = detectCountry(value);
    setCountry(detected);
    const digits = normalizeDigits(value);
    setLocalPart(digits.slice(detected.dialCode.length));
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const nextCountry =
      COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];

    setCountry(nextCountry);

    const digits = normalizeDigits(localPart);
    const newValue = nextCountry.dialCode + digits;

    onChange(newValue);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = normalizeDigits(raw);

    // Можно ограничить длину local-части (для РФ — 10 цифр, для США — 10 и т.п.)
    // Пока мягкий лимит — максимум 15 цифр локальной части.
    const trimmed = digits.slice(0, 15);

    setLocalPart(trimmed);

    const newValue = country.dialCode + trimmed;
    onChange(newValue);
  };

  const displayLocal = localPart;

  const borderClass = error
    ? "border-rose-400 focus:ring-rose-300"
    : "border-slate-300 focus:ring-onlyvet-teal/40";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[12px] text-slate-600 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Выбор страны */}
        <div className="w-[40%] min-w-[120px]">
          <div className="text-[11px] text-slate-500 mb-1">Код страны</div>
          <select
            className={`w-full rounded-xl border px-2 py-2 text-[13px] bg-white outline-none focus:ring-2 ${borderClass}`}
            value={country.code}
            onChange={handleCountryChange}
            disabled={disabled}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Локальный номер */}
        <div className="flex-1">
          <div className="text-[11px] text-slate-500 mb-1">
            Номер телефона
          </div>
          <div className="flex items-center rounded-xl border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-onlyvet-teal/40">
            <span className="text-[13px] text-slate-500 mr-1">
              +{country.dialCode}
            </span>
            <input
              type="tel"
              className="flex-1 bg-transparent text-[13px] outline-none"
              placeholder="9991234567"
              value={displayLocal}
              onChange={handleLocalChange}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Подсказка / ошибка */}
      {(helperText || error) && (
        <p
          className={`mt-1 text-[11px] ${
            error ? "text-rose-600" : "text-slate-500"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
