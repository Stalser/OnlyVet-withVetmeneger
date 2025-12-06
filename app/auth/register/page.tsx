// app/auth/register/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

/**
 * Нормализация телефона для хранения и поиска.
 * - убираем все нецифры
 * - для РФ: 8XXXXXXXXXX / 7XXXXXXXXXX -> последние 10 цифр
 * - для остальных стран просто возвращаем цифры
 */
function normalizePhoneForSearch(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // РФ: 11 цифр и начинается с 7 или 8 → оставляем последние 10
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return digits.slice(1);
  }

  // Всё остальное — просто цифры
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

  // контакты
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");

  // пароль
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // согласия
  const [consentPersonalData, setConsentPersonalData] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // статус
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  // валидация
  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const middleNameError = hasSubmitted && !noMiddleName && !middleName.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const emailError = hasSubmitted && !email.trim();
  const passwordError = hasSubmitted && password.trim().length < 8;
  const password2Error =
    hasSubmitted && password2.trim().length > 0 && password2 !== password;

  const consentsError =
    hasSubmitted &&
    (!consentPersonalData || !consentOffer || !consentRules);

  const isValid =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    (noMiddleName || middleName.trim().length > 0) &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length >= 8 &&
    password2 === password &&
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

      const fullName = [lastName, firstName, !noMiddleName && middleName]
        .filter(Boolean)
        .join(" ");

      const fullPhoneDisplay = phone.trim();
      const normalizedPhone = normalizePhoneForSearch(phone);

      // 1. Проверка дубликата по телефону через /api/auth/check-duplicate
      try {
        const checkRes = await fetch("/api/auth/check-duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNormalized: normalizedPhone || null,
          }),
        });

        if (checkRes.ok) {
          const check = await checkRes.json();
          const phoneExists: boolean = check.phoneExists;

          if (phoneExists) {
            setServerError(
              "Аккаунт с таким номером телефона уже существует. Попробуйте войти или восстановить доступ."
            );
            setLoading(false);
            return; // ⛔ дальше signUp не вызываем
          }
        } else {
          console.warn(
            "[Register] /api/auth/check-duplicate failed:",
            await checkRes.text()
          );
        }
      } catch (checkErr) {
        console.warn("[Register] check-duplicate error:", checkErr);
      }

      // 2. Регистрация пользователя в Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName || null,
            last_name: lastName || null,
            first_name: firstName || null,
            middle_name: noMiddleName ? null : middleName || null,
            phone_raw: fullPhoneDisplay || null,
            phone_normalized: normalizedPhone || null,
            telegram: telegram.trim() || null,
          },
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();

        // Supabase сам не даёт повторить email — ловим его сообщение
        if (msg.includes("already registered")) {
          setServerError(
            "Аккаунт с таким email уже существует. Попробуйте войти или восстановить доступ."
          );
        } else if (
          msg.includes("phone_normalized") ||
          msg.includes("profiles_phone_normalized")
        ) {
          setServerError(
            "Аккаунт с таким номером телефона уже существует. Попробуйте войти или восстановить доступ."
          );
        } else {
          setServerError(
            error.message || "Не удалось создать аккаунт. Попробуйте позже."
          );
        }

        setLoading(false);
        return;
      }

      // 3. Vetmanager сейчас ОТКЛЮЧЁН (pets 503), здесь его не трогаем.

      setServerSuccess(
        "Аккаунт создан. Подтвердите email через письмо и затем войдите в личный кабинет."
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setServerError("Произошла техническая ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 flex justify-center">
          <div className="w-full max-w-md space-y-4">
            <nav className="text-[12px] text-slate-500">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              / <span className="text-slate-700">Регистрация</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Регистрация в OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600">
                  Личный кабинет нужен для хранения данных о питомцах, заявок и
                  доступа к заключениям. Ниже — минимальный набор данных для
                  связи и безопасной работы с консультациями.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
                {/* ФИО */}
                <section className="space-y-2">
                  <h2 className="text-[14px] font-semibold">
                    Контактное лицо
                  </h2>
                  <div className="grid md:grid-cols-3 gap-3">
                    {/* Фамилия */}
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Фамилия<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          lastNameError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="Иванов"
                      />
                      {lastNameError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Укажите фамилию.
                        </p>
                      )}
                    </div>

                    {/* Имя */}
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Имя<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          firstNameError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="Иван"
                      />
                      {firstNameError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Укажите имя.
                        </p>
                      )}
                    </div>

                    {/* Отчество */}
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Отчество{!noMiddleName && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        disabled={noMiddleName}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          noMiddleName
                            ? "border-slate-200 bg-slate-50 text-slate-400"
                            : middleNameError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder={noMiddleName ? "Не указано" : "Иванович"}
                      />
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
                        <input
                          type="checkbox"
                          id="no-middle-name"
                          checked={noMiddleName}
                          onChange={(e) => setNoMiddleName(e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <label
                          htmlFor="no-middle-name"
                          className="select-none cursor-pointer"
                        >
                          Нет отчества
                        </label>
                      </div>
                      {middleNameError && !noMiddleName && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Укажите отчество или отметьте «Нет отчества».
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Контакты */}
                <section className="space-y-2">
                  <h2 className="text-[14px] font-semibold">
                    Контактные данные
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Телефон<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          phoneError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="+7 999 123-45-67"
                      />
                      {phoneError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Укажите телефон, чтобы мы могли связаться с вами.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          emailError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="example@mail.ru"
                      />
                      {emailError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Email нужен для отправки материалов консультации и
                          уведомлений.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Telegram (необязательно)
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="@username"
                    />
                  </div>
                </section>

                {/* Пароль */}
                <section className="space-y-2">
                  <h2 className="text-[14px] font-semibold">Пароль</h2>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Пароль<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          passwordError
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="Не менее 8 символов"
                      />
                      {passwordError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Пароль должен быть не короче 8 символов.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Повторите пароль<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                          password2Error
                            ? "border-rose-400 focus:ring-rose-300"
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="Ещё раз пароль"
                      />
                      {password2Error && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Пароли не совпадают.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Согласия */}
                <section className="space-y-2">
                  <h2 className="text-[14px] font-semibold">Согласия</h2>
                  <div className="space-y-2 text-[12px] text-slate-600">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={consentPersonalData}
                        onChange={(e) =>
                          setConsentPersonalData(e.target.checked)
                        }
                        className="mt-[2px]"
                      />
                      <span>
                        Я даю{" "}
                        <Link
                          href="/docs/privacy"
                          className="text-onlyvet-coral underline-offset-2 hover:underline"
                        >
                          согласие на обработку персональных данных
                        </Link>{" "}
                        в соответствии с Политикой обработки ПДн.
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={consentOffer}
                        onChange={(e) => setConsentOffer(e.target.checked)}
                        className="mt-[2px]"
                      />
                      <span>
                        Я принимаю условия{" "}
                        <Link
                          href="/docs/offer"
                          className="text-onlyvet-coral underline-offset-2 hover:underline"
                        >
                          публичной оферты
                        </Link>{" "}
                        сервиса OnlyVet.
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={consentRules}
                        onChange={(e) => setConsentRules(e.target.checked)}
                        className="mt-[2px]"
                      />
                      <span>
                        Я ознакомлен(а) и согласен(на) с{" "}
                        <Link
                          href="/docs/rules"
                          className="text-onlyvet-coral underline-offset-2 hover:underline"
                        >
                          правилами онлайн-клиники
                        </Link>
                        .
                      </span>
                    </label>
                    {consentsError && (
                      <p className="text-[11px] text-rose-600">
                        Для регистрации необходимо отметить все согласия.
                      </p>
                    )}
                  </div>
                </section>

                {/* Ошибка / успех */}
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

                {/* Кнопка */}
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="
                    w-full mt-1 px-4 py-2.5 rounded-full 
                    bg-onlyvet-coral text-white text-[13px] font-medium 
                    shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                    hover:brightness-105 transition
                    disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Регистрируем..." : "Зарегистрироваться"}
                </button>

                <div className="text-[12px] text-slate-600 mt-2">
                  Уже есть аккаунт?{" "}
                  <Link
                    href="/auth/login"
                    className="text-onlyvet-coral hover:underline"
                  >
                    Войти
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
