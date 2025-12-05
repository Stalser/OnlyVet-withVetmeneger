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
 * - для остальных стран пока просто возвращаем цифры как есть
 */
function normalizePhoneForSearch(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return digits.slice(1); // последние 10 цифр
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
  const middleNameError =
    hasSubmitted && !noMiddleName && !middleName.trim();
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

      const emailLower = email.trim().toLowerCase();

      // 1. Проверка дубликатов (email + телефон)
      try {
        const checkRes = await fetch("/api/auth/check-duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailLower,
            phone_normalized: normalizedPhone || null,
          }),
        });

        if (checkRes.ok) {
          const check = await checkRes.json();

          if (check.duplicate) {
            const fields: string[] = check.fields || [];

            if (fields.includes("email") && fields.includes("phone")) {
              setServerError(
                "Аккаунт с таким email и номером телефона уже существует. Попробуйте войти или восстановить доступ."
              );
            } else if (fields.includes("email")) {
              setServerError(
                "Аккаунт с таким email уже существует. Попробуйте войти или восстановить доступ."
              );
            } else if (fields.includes("phone")) {
              setServerError(
                "Аккаунт с таким номером телефона уже существует. Попробуйте войти или восстановить доступ."
              );
            } else {
              setServerError(
                "Аккаунт с такими данными уже существует. Попробуйте войти или восстановить доступ."
              );
            }

            setLoading(false);
            return;
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
        email: emailLower,
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
                {/* ... Вёрстку я не меняю, оставляю как у тебя ... */}
                {/* (оставляем тот же JSX, что в твоей последней версии, чтобы форма выглядела так как на скрине) */}

                {/* ... весь блок ФИО ... */}
                {/* ... весь блок Контактные данные (телефон, email, telegram) ... */}
                {/* ... блок Пароль ... */}
                {/* ... блок Согласия ... */}

                {/* Я не дублирую JSX здесь, потому что у тебя он уже корректно отстроен визуально —
                    важна была только логика наверху. */}

              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
