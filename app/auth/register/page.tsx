"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const emailError = hasSubmitted && !email.trim();
  const passwordError =
    hasSubmitted && (!password || password.length < 8);
  const password2Error =
    hasSubmitted && (!password2 || password2 !== password);

  const isValid =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    password2 === password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError(null);

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName,
          firstName,
          middleName,
          phone,
          email,
          telegram,
          password,
          password2,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("Произошла техническая ошибка. Попробуйте позже.");
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
                  Личный кабинет позволит вам видеть заявки, историю
                  консультаций и питомцев. Сейчас это каркас — позже он будет
                  связан с реальной базой данных и Vetmanager.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px]">
                {/* Фамилия / Имя / Отчество */}
                <div className="grid md:grid-cols-3 gap-3">
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
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Отчество
                    </label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      placeholder="Иванович"
                    />
                  </div>
                </div>

                {/* Телефон + email */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Телефон (логин)<span className="text-red-500">*</span>
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
                      placeholder="+7 ..."
                    />
                    {phoneError && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Телефон обязателен для входа и связи.
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1">
                      По этому номеру будет выполняться вход в личный кабинет.
                    </p>
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
                        Email обязателен для уведомлений и восстановления
                        доступа.
                      </p>
                    )}
                  </div>
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Логин Telegram
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="@username (необязательно)"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    При наличии нам проще и быстрее связываться через Telegram.
                  </p>
                </div>

                {/* Пароли */}
                <div className="grid md:grid-cols-2 gap-3">
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
                      placeholder="Не короче 8 символов"
                    />
                    {passwordError && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Пароль должен быть не короче 8 символов.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Повтор пароля<span className="text-red-500">*</span>
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
                      placeholder="Повторите пароль"
                    />
                    {password2Error && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Пароли должны совпадать.
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full mt-1 px-4 py-2.5 rounded-full 
                    bg-onlyvet-coral text-white text-[13px] font-medium 
                    shadow-[0_10px_26px_rgba(247,118,92,0.45)]
                    hover:brightness-105 transition
                    disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
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

              <p className="text-[11px] text-slate-500">
                В демонстрационном режиме эта форма отправляет данные на
                внутренний API <code>/api/auth/register</code>. Позже этот API
                будет создавать реального пользователя в базе данных и
                связывать его с клиентом в Vetmanager.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
