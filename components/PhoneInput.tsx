"use client";

import { useEffect, useState } from "react";

type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
};

const COUNTRIES: CountryOption[] = [
  { code: "RU", name: "Россия", dialCode: "+7" },
  { code: "KZ", name: "Казахстан", dialCode: "+7" },
  { code: "BY", name: "Беларусь", dialCode: "+375" },
  { code: "AM", name: "Армения", dialCode: "+374" },
  { code: "AZ", name: "Азербайджан", dialCode: "+994" },
  { code: "GE", name: "Грузия", dialCode: "+995" },
  { code: "UA", name: "Украина", dialCode: "+380" },
  { code: "DE", name: "Германия", dialCode: "+49" },
  { code: "GB", name: "Великобритания", dialCode: "+44" },
  { code: "US", name: "США", dialCode: "+1" },
];

type PhoneInputProps = {
  /** Полный телефон вида +79998887766 */
  value: string;
  /** Колбэк — всегда отдаём полный номер в международном формате */
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  /** Внешняя ошибка (например, из валидации формы) */
  error?: string | null;
};

export function PhoneInput({
  value,
  onChange,
  label,
  required,
  error,
}: PhoneInputProps) {
  const [country, setCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [localPart, setLocalPart] = useState("");

  // Парсим входящее value -> страна + локальный номер
  useEffect(() => {
    if (!value) {
      setLocalPart("");
      return;
    }

    const trimmed = value.trim();
    const found = COUNTRIES.find((c) => trimmed.startsWith(c.dialCode));

    if (found) {
      setCountry(found);
      const withoutCode = trimmed
        .replace(found.dialCode, "")
        .replace(/\D/g, "");
      setLocalPart(withoutCode);
    } else {
      const digits = trimmed.replace(/\D/g, "");
      setLocalPart(digits);
    }
  }, [value]);

  const handleCountryChange = (code: string) => {
    const next = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    setCountry(next);

    if (localPart) {
      onChange(`${next.dialCode}${localPart}`);
    }
  };

  const handleLocalChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setLocalPart(digits);

    if (digits) {
      onChange(`${country.dialCode}${digits}`);
    } else {
      onChange("");
    }
  };

  const fullPhone = localPart ? `${country.dialCode}${localPart}` : "";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[12px] text-slate-600 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        <select
          value={country.code}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-[40%] md:w-[35%] rounded-xl border border-slate-300 px-2 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} {c.dialCode}
            </option>
          ))}
        </select>

        <input
          type="tel"
          value={localPart}
          onChange={(e) => handleLocalChange(e.target.value)}
          className={`flex-1 rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-400 focus:ring-rose-300"
              : "border-slate-300 focus:ring-onlyvet-teal/40"
          }`}
          placeholder="Номер телефона"
        />
      </div>

      {error ? (
        <p className="mt-1 text-[11px] text-rose-600">{error}</p>
      ) : (
        fullPhone && (
          <p className="mt-1 text-[11px] text-slate-500">
            Будет сохранён как:{" "}
            <span className="font-medium">{fullPhone}</span>
          </p>
        )
      )}
    </div>
  );
}

export default PhoneInput;
