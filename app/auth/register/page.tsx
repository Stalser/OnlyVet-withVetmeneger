"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

// ---- Телефон нормализуем так же, как в триггерах ----
function normalizePhoneForSearch(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // РФ: 7XXXXXXXXXX или 8XXXXXXXXXX = оставляем последние 10 цифр
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return digits.slice(1);
  }

  // Другие страны пока сохраняем как есть
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

  // Телефон
  const [countryCode, setCountryCode] = useState("+7"); // По умолчанию Россия
  const [phoneLocal, setPhoneLocal] = useState("");

  // Контакты
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");

  // Пароль
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Согласия
  const [consentPdn, setConsentPdn] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // UI-состояния
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  // Валидация ФИО
  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const middleNameError =
    hasSubmitted && !noMiddleName && !middleName.trim();

  // Валидация телефона
  const fullPhoneRaw = `${countryCode}${phoneLocal}`;
  const normalizedPhone = normalizePhoneForSearch(fullPhoneRaw);
  const phoneError =
    hasSubmitted && (normalizedPhone.length < 5 || phoneLocal.trim().length < 5);

  // Валидация email
  const emailError = hasSubmitted && !email.trim();

  // Пароль
  const passwordError = hasSubmitted && password.length < 8;
  const password2Error = hasSubmitted && password2 !== password;

  // Согласия
  const consentsError =
    hasSubmitted && (!consentPdn || !consentOffer || !consentRules);

  const isValid =
    !lastNameError &&
    !firstNameError &&
    !middleNameError &&
    !phoneError &&
    !emailError &&
    !passwordError &&
    !password2Error &&
    !consentsError;

  // ---------- ОСНОВНОЙ SUBMIT ----------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid || loading) return;

    try {
      setLoading(true);

      // 1) Проверка — такой email уже зарегистрирован?
      const { data: existingEmail, error: emailCheckError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("email", email.trim())
          .maybeSingle();

      if (existingEmail) {
        setServerError(
          "Аккаунт с таким email уже существует. Войдите или восстановите доступ."
        );
        setLoading(false);
        return;
      }

      // 2) Проверка — такой телефон уже зарегистрирован?
      if (normalizedPhone) {
        const { data: existingPhone, error: phoneCheckError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("phone_normalized", normalizedPhone)
            .maybeSingle();

        if (existingPhone) {
          setServerError(
            "Аккаунт с таким номером телефона уже существует. Войдите или восстановите доступ."
          );
          setLoading(false);
          return;
        }
      }

      // Формируем ФИО
      const fullName = [lastName, firstName, !noMiddleName && middleName]
        .filter(Boolean)
        .join(" ");

      // 3) РЕГИСТРАЦИЯ В SUPABASE
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName,
            last_name: lastName,
            first_name: firstName,
            middle_name: noMiddleName ? null : middleName || null,

            phone_raw: fullPhoneRaw,
            phone_normalized: normalizedPhone,

            telegram: telegram || null,
            role: "user",
          },
        },
      });

      if (signUpError) {
        setServerError(signUpError.message);
        setLoading(false);
        return;
      }

      // 4) Сообщение об успехе
      setServerSuccess(
        "Аккаунт создан. Подтвердите email через письмо и затем войдите в личный кабинет."
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setServerError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ---------------------

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/60">
        <div className="container mx-auto max-w-md px-4">

          <h1 className="text-xl font-semibold mb-2">Регистрация в OnlyVet</h1>
          <p className="text-[13px] text-slate-600 mb-4">
            Личный кабинет нужен для хранения данных о питомцах, заявок и доступа к заключениям.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-[13px]">

            {/* ----------- ФИО ----------- */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Фамилия *"
                value={lastName}
                onChange={setLastName}
                error={lastNameError}
              />
              <Input
                label="Имя *"
                value={firstName}
                onChange={setFirstName}
                error={firstNameError}
              />
              <Input
                label="Отчество"
                value={middleName}
                onChange={setMiddleName}
                disabled={noMiddleName}
                error={middleNameError}
              />
            </div>

            <label className="flex items-center gap-2 text-[12px] text-slate-600">
              <input
                type="checkbox"
                checked={noMiddleName}
                onChange={(e) => setNoMiddleName(e.target.checked)}
              />
              Нет отчества
            </label>

            {/* ----------- Телефон ----------- */}
            <div>
              <label className="block text-[12px] text-slate-600 mb-1">
                Телефон *
              </label>

              <div className="flex gap-2">
                <select
                  className="w-24 rounded-xl border border-slate-300 px-2 py-2"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+7">🇷🇺 +7</option>
                </select>

                <input
                  type="tel"
                  className={`flex-1 rounded-xl border px-3 py-2 ${
                    phoneError
                      ? "border-rose-400"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  }`}
                  placeholder="999 123-45-67"
                  value={phoneLocal}
                  onChange={(e) => setPhoneLocal(e.target.value)}
                />
              </div>

              {phoneError && (
                <p className="text-[11px] text-rose-600 mt-1">
                  Укажите корректный номер телефона.
                </p>
              )}
            </div>

            {/* ----------- Email ----------- */}
            <Input
              label="Email *"
              value={email}
              onChange={setEmail}
              error={emailError}
              placeholder="example@mail.ru"
            />

            {/* ----------- Telegram ---------- */}
            <Input
              label="Telegram (необязательно)"
              value={telegram}
              onChange={setTelegram}
              placeholder="@username"
            />

            {/* ----------- Пароль ----------- */}
            <Input
              label="Пароль *"
              type="password"
              value={password}
              onChange={setPassword}
              error={passwordError}
              placeholder="Не менее 8 символов"
            />

            <Input
              label="Повторите пароль *"
              type="password"
              value={password2}
              onChange={setPassword2}
              error={password2Error}
              placeholder="Повторите пароль"
            />

            {/* ----------- Согласия ----------- */}
            <div className="space-y-2 text-[12px] text-slate-700">
              <CheckboxRow
                checked={consentPdn}
                onChange={setConsentPdn}
                text="Я даю согласие на обработку персональных данных"
                link="/docs/privacy"
              />

              <CheckboxRow
                checked={consentOffer}
                onChange={setConsentOffer}
                text="Я принимаю условия публичной оферты"
                link="/docs/offer"
              />

              <CheckboxRow
                checked={consentRules}
                onChange={setConsentRules}
                text="Я ознакомлен(а) и согласен(на) с правилами онлайн-клиники"
                link="/docs/rules"
              />

              {consentsError && (
                <p className="text-[11px] text-rose-600">
                  Необходимо принять все согласия.
                </p>
              )}
            </div>

            {/* ----------- Ошибки / успех ----------- */}
            {serverError && (
              <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                {serverError}
              </div>
            )}

            {serverSuccess && (
              <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                {serverSuccess}
              </div>
            )}

            {/* ----------- Кнопка ----------- */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className="
                w-full px-4 py-2.5 rounded-full 
                bg-onlyvet-coral text-white text-[13px] font-medium 
                shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                hover:brightness-105 transition
                disabled:bg-slate-300 disabled:cursor-not-allowed
              "
            >
              {loading ? "Регистрируем..." : "Зарегистрироваться"}
            </button>

            <p className="text-[12px] text-slate-600">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-onlyvet-coral">
                Войти
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ============================== */
/* ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ 👇 */
/* ============================== */

function Input({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  disabled = false,
}: any) {
  return (
    <div className="space-y-1">
      <label className="block text-[12px] text-slate-600">{label}</label>
      <input
        type={type}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-400 focus:ring-rose-300"
            : "border-slate-300 focus:ring-onlyvet-teal/40"
        }`}
      />
      {error && (
        <p className="text-[11px] text-rose-600">Поле заполнено некорректно.</p>
      )}
    </div>
  );
}

function CheckboxRow({ checked, onChange, text, link }: any) {
  return (
    <label className="flex items-start gap-2 text-[12px]">
      <input
        type="checkbox"
        className="mt-[2px]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        {text}{" "}
        <Link href={link} className="text-onlyvet-coral underline-offset-2">
          подробнее
        </Link>
      </span>
    </label>
  );
}
