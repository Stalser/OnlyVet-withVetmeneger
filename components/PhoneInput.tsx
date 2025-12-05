// components/PhoneInput.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type CountryOption = {
  code: string;      // ISO-код (RU, KZ, US и т.д.)
  dialCode: string;  // Префикс с плюсом, например "+7"
  label: string;     // Название для пользователя
  example?: string;  // Пример номера без префикса
};

// Минимальный набор стран — можно дополнять по мере надобности
const COUNTRIES: CountryOption[] = [
  { code: "RU", dialCode: "+7", label: "Россия", example: "9829138405" },
  { code: "KZ", dialCode: "+7", label: "Казахстан", example: "7012345678" },
  { code: "BY", dialCode: "+375", label: "Беларусь", example: "291234567" },
  { code: "UA", dialCode: "+380", label: "Украина", example: "671234567" },
  { code: "US", dialCode: "+1", label: "США / Канада", example: "4155551234" },
];

type PhoneInputProps = {
  label?: string;
  value: string;                         // Полное значение, например "+79829138405"
  onChange: (value: string) => void;     // Сюда отдаём полное значение
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
};

function normalizeDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function PhoneInput(props: PhoneInputProps) {
  const {
    label,
    value,
    onChange,
    required,
    error,
    helperText,
    className = "",
  } = props;

  // Выбранная страна
  const [country, setCountry] = useState<CountryOption>(COUNTRIES[0]);
  // Локальная часть номера (без кода страны)
  const [localPart, setLocalPart] = useState<string>("");

  // При первом рендере / смене value — распарсить существующее значение
  useEffect(() => {
    if (!value) {
      setCountry(COUNTRIES[0]);
      setLocalPart("");
      return;
    }

    const trimmed = value.trim();

    // Найдём страну по префиксу
    const found =
      COUNTRIES.find((opt) => trimmed.startsWith(opt.dialCode)) || COUNTRIES[0];

    const withoutCode = trimmed.replace(found.dialCode, "");
    setCountry(found);
    setLocalPart(normalizeDigits(withoutCode));
  }, [value]);

  // Плейсхолдер для локальной части
  const localPlaceholder = useMemo(() => {
    if (!country.example) return "";
    return country.example;
  }, [country]);

  // Изменение страны
  const handleCountryChange = (code: string) => {
    const next =
      COUNTRIES.find((opt) => opt.code === code) || COUNTRIES[0];

    setCountry(next);

    // Пересобираем полное значение и отдаём наружу
    const digits = normalizeDigits(localPart);
    const combined = digits ? `${next.dialCode}${digits}` : next.dialCode;
    onChange(combined);
  };

  // Изменение локальной части номера
  const handleLocalChange = (raw: string) => {
    const digits = normalizeDigits(raw);
    setLocalPart(digits);

    const combined = digits ? `${country.dialCode}${digits}` : country.dialCode;
    onChange(combined);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[12px] text-slate-600 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Выбор страны */}
        <div className="w-[40%] min-w-[120px]">
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            value={country.code}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            {COUNTRIES.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label} {opt.dialCode}
              </option>
            ))}
          </select>
        </div>

        {/* Локальная часть номера */}
        <div className="flex-1 relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-500">
            {country.dialCode}
          </div>
          <input
            type="tel"
            inputMode="tel"
            value={localPart}
            onChange={(e) => handleLocalChange(e.target.value)}
            placeholder={localPlaceholder}
            className={`w-full rounded-xl border px-3 py-2 pl-10 text-[13px] focus:outline-none focus:ring-2 ${
              error
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
          />
        </div>
      </div>

      {helperText && (
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

export default PhoneInput;
