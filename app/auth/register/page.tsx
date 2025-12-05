"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

/** Нормализация телефона для БД */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && ["7", "8"].includes(digits[0])) {
    return digits.slice(1); // оставляем 10 цифр РФ
  }
  return digits;
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  // ФИО
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [noMiddleName, setNoMiddleName] = useState(false);

  // Контакты
  const [countryCode, setCountryCode] = useState("+7");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");

  // Пароль
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Согласия
  const [consentPersonalData, setConsentPersonalData] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // Статусы
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  // Валидация
  const fullPhone = `${countryCode}${phone}`;
  const digits = fullPhone.replace(/\D/g, "");
  const phoneError = hasSubmitted && digits.length < 10;
  const emailError = hasSubmitted && !email.trim();
  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const middleNameError = hasSubmitted && !noMiddleName && !middleName.trim();
  const passwordError = hasSubmitted && password.length < 8;
  const password2Error = hasSubmitted && password2 !== password;

  const isValid =
    !phoneError &&
    !emailError &&
    !lastNameError &&
    !firstNameError &&
    !middleNameError &&
    !passwordError &&
    !password2Error &&
    consentPersonalData &&
    consentOffer &&
    consentRules;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid || loading) return;

    try {
      setLoading(true);

      const normalized = normalizePhone(fullPhone);
      const fullName = [lastName, firstName, !noMiddleName && middleName]
        .filter(Boolean)
        .join(" ");

      // Проверка на дубль телефона в Supabase
      const { data: phoneDup } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone_normalized", normalized)
        .maybeSingle();

      if (phoneDup) {
        setServerError(
          "Аккаунт с таким номером телефона уже существует. Войдите или восстановите доступ."
        );
        setLoading(false);
        return;
      }

      // Регистрация в Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            last_name: lastName,
            first_name: firstName,
            middle_name: noMiddleName ? null : middleName,
            phone_raw: fullPhone,
            phone_normalized: normalized,
            telegram,
          },
        },
      });

      if (error) {
        setServerError(
          error.message.includes("exists")
            ? "Аккаунт с таким email уже существует."
            : error.message
        );
        setLoading(false);
        return;
      }

      setServerSuccess(
        "Аккаунт создан! Подтвердите email через письмо и затем войдите."
      );

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err) {
      console.error(err);
      setServerError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="py-10 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 flex justify-center">
          <div className="w-full max-w-md space-y-6">

            <nav className="text-xs text-slate-500">
              <Link href="/">Главная</Link> / Регистрация
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">

              <h1 className="text-xl font-semibold mb-4">
                Регистрация в OnlyVet
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">

                {/* ФИО */}
                <div className="space-y-2">
                  <h2 className="font-semibold text-base">Контактное лицо</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Фамилия"
                      className="rounded-xl border px-3 py-2"
                    />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Имя"
                      className="rounded-xl border px-3 py-2"
                    />
                    <div>
                      <input
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        disabled={noMiddleName}
                        placeholder="Отчество"
                        className="rounded-xl border px-3 py-2 w-full disabled:bg-slate-100"
                      />
                      <label className="flex items-center gap-1 mt-1 text-xs">
                        <input
                          type="checkbox"
                          checked={noMiddleName}
                          onChange={(e) => setNoMiddleName(e.target.checked)}
                        />
                        Нет отчества
                      </label>
                    </div>
                  </div>
                </div>

                {/* Телефон + Email */}
                <div className="space-y-2">
                  <h2 className="font-semibold text-base">Контактные данные</h2>

                  {/* Телефон красивый */}
                  <div>
                    <label className="block text-xs mb-1">Телефон *</label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-xl border px-3 py-2 w-24"
                      >
                        <option value="+7">+7 (Россия)</option>
                        <option value="+1">+1 (США)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+48">+48 (Польша)</option>
                      </select>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="999 123-45-67"
                        className={`flex-1 rounded-xl border px-3 py-2 ${
                          phoneError ? "border-rose-400" : ""
                        }`}
                      />
                    </div>

                    {phoneError && (
                      <p className="text-xs text-rose-600 mt-1">
                        Укажите корректный номер (минимум 10 цифр).
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.ru"
                      className={`w-full rounded-xl border px-3 py-2 ${
                        emailError ? "border-rose-400" : ""
                      }`}
                    />
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-xs mb-1">Telegram</label>
                    <input
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                </div>

                {/* Пароль */}
                <div className="space-y-2">
                  <h2 className="font-semibold text-base">Пароль</h2>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Не менее 8 символов"
                    className={`w-full rounded-xl border px-3 py-2 ${
                      passwordError ? "border-rose-400" : ""
                    }`}
                  />

                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Повторите пароль"
                    className={`w-full rounded-xl border px-3 py-2 ${
                      password2Error ? "border-rose-400" : ""
                    }`}
                  />
                </div>

                {/* Согласия */}
                <div className="space-y-1 text-xs">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={consentPersonalData}
                      onChange={(e) => setConsentPersonalData(e.target.checked)}
                    />
                    Я даю согласие на обработку ПДн
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={consentOffer}
                      onChange={(e) => setConsentOffer(e.target.checked)}
                    />
                    Я принимаю условия оферты
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={consentRules}
                      onChange={(e) => setConsentRules(e.target.checked)}
                    />
                    Я согласен с правилами онлайн-клиники
                  </label>
                </div>

                {/* Ошибки */}
                {serverError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2">
                    {serverError}
                  </p>
                )}
                {serverSuccess && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                    {serverSuccess}
                  </p>
                )}

                {/* Кнопка */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-onlyvet-coral text-white py-2 shadow-md hover:brightness-105"
                >
                  {loading ? "Регистрация…" : "Зарегистрироваться"}
                </button>

                <p className="text-xs text-slate-600 mt-2">
                  Уже есть аккаунт?{" "}
                  <Link href="/auth/login" className="text-onlyvet-coral">
                    Войти
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
