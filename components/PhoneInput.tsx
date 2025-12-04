// components/PhoneInput.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type CountryOption = {
  code: string;
  name: string;
  dialCode: string; // "+7"
};

const COUNTRIES: CountryOption[] = [
  { code: "RU", name: "Россия", dialCode: "+7" },
  { code: "KZ", name: "Казахстан", dialCode: "+7" },
  { code: "BY", name: "Беларусь", dialCode: "+375" },
  { code: "UA", name: "Украина", dialCode: "+380" },
  { code: "EU", name: "Европа", dialCode: "+49" }, // условно DE
  { code: "US", name: "США / Канада", dialCode: "+1" },
];

export type PhoneInputProps = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string | null;
};

export function isValidPhone(phone: string): boolean {
  // очень простой чек: + и 8–15 цифр
  return /^\+\d{8,15}$/.test(phone.trim());
}

export function PhoneInput({
  label,
  value,
  onChange,
  required,
  error,
}: PhoneInputProps) {
  // определяем страну по префиксу
  const initialCountry = useMemo(() => {
    const trimmed = value.trim();
    const found = COUNTRIES.find((c) =>
      trimmed.startsWith(c.dialCode)
    );
    return found || COUNTRIES[0];
  }, [value]);

  const [country, setCountry] = useState<CountryOption>(initialCountry);

  const [localPart, setLocalPart] = useState<string>("");

  useEffect(() => {
    const trimmed = value.trim();
    let c = country;
    const found = COUNTRIES.find((opt) =>
      trimmed.startsWith(opt.dialCode)
    );
    if (found) c = found;
    const withoutCode = trimmed.replace(c.dialCode, "").replace(/\D/g, "");
    setCountry(c);
    setLocalPart(withoutCode);
  }, [value]);

  const handleCountryChange = (code: string) => {
    const next = COUNTRIES.find((c) => c.code === code) || country;
    setCountry(next);
    const cleaned = localPart.replace(/\D/g, "");
    onChange(cleaned ? `${next.dialCode}${cleaned}` : "");
  };

  const handleLocalChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setLocalPart(digits);
    onChange(digits ? `${country.dialCode}${digits}` : "");
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[12px] text-slate-600 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <div className="w-[40%] sm:w-[35%]">
          <select
            value={country.code}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="
              w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
              bg-white focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
            "
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} {c.dialCode}
              </option>
            ))}
          </select>
          <div className
                  <div className="flex-1">
        <input
          type="tel"
          value={localPart}
          onChange={(e) => handleLocalChange(e.target.value)}
          className="
            w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px]
            focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
          "
          placeholder="Номер телефона"
        />
      </div>
    </div>

    {error && (
      <p className="text-[11px] text-rose-600 mt-1">
        {error}
      </p>
    )}
  </div>
);
}

export default PhoneInput;
