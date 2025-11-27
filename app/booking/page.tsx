// app/booking/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

// Заглушка "пользователь залогинен" + данные — потом заменим реальным ЛК
const mockIsLoggedIn = false;
const mockUser = {
  fullName: "Иванов Иван Иванович",
  phone: "+7 900 000-00-00",
  telegram: "@ivanov",
  pets: [
    { id: "pet1", name: "Локи, кошка 2 года" },
    { id: "pet2", name: "Рекс, собака 6 лет" },
  ],
};

export default function BookingPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");

  // питомец
  const [petMode, setPetMode] = useState<"existing" | "new">("existing");
  const [selectedPetId, setSelectedPetId] = useState<string>(""); // для существующего
  const [newPetName, setNewPetName] = useState(""); // для нового

  // услуга / врач
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [doctorMode, setDoctorMode] = useState<"any" | "specific">("any");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  // дата/время
  const [timeMode, setTimeMode] = useState<"any" | "choose">("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // файлы
  const [files, setFiles] = useState<File[]>([]);

  // согласия
  const [consentPersonalData, setConsentPersonalData] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // если юзер залогинен — подставить данные
  useEffect(() => {
    if (mockIsLoggedIn) {
      setFullName(mockUser.fullName);
      setPhone(mockUser.phone);
      setTelegram(mockUser.telegram);
      if (mockUser.pets.length > 0) {
        setSelectedPetId(mockUser.pets[0].id);
      }
    }
  }, []);

  // простая валидация
  const isValid =
    fullName.trim().length > 0 &&
    phone.trim().length > 0 &&
    consentPersonalData &&
    consentOffer &&
    consentRules;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Здесь потом будет реальная отправка на backend / в Vetmanager
    console.log("Submit booking:", {
      fullName,
      phone,
      telegram,
      email,
      petMode,
      selectedPetId,
      newPetName,
      selectedServiceId,
      doctorMode,
      selectedDoctorId,
      timeMode,
      date,
      time,
      files,
      consents: {
        consentPersonalData,
        consentOffer,
        consentRules,
      },
    });
    alert("Заявка на консультацию отправлена (пока демонстрационный вариант).");
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-5">
            <nav className="text-[12px] text-slate-500 mb-2">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">Записаться на консультацию</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Записаться на онлайн-консультацию
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Заполните форму ниже — мы подберём удобное время и врача. При
              необходимости вы сможете прикрепить анализы, УЗИ, фото и другие
              материалы.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-6"
          >
            {/* 1. Данные клиента */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Контактные данные</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    ФИО<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Например: Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Номер телефона<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="+7 ..."
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Логин Telegram
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="@username"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    По возможности используем Telegram для связи.
                  </p>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="опционально"
                  />
                </div>
              </div>
            </section>

            {/* 2. Питомец */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Информация о питомце</h2>
              <div className="flex flex-wrap gap-3 text-[12px]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="petMode"
                    value="existing"
                    checked={petMode === "existing"}
                    onChange={() => setPetMode("existing")}
                    className="rounded-full border-slate-300"
                  />
                  <span>Выбрать из существующих (личный кабинет)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="petMode"
                    value="new"
                    checked={petMode === "new"}
                    onChange={() => setPetMode("new")}
                    className="rounded-full border-slate-300"
                  />
                  <span>Новый питомец</span>
                </label>
              </div>

              {petMode === "existing" ? (
                mockIsLoggedIn && mockUser.pets.length > 0 ? (
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Питомец
                    </label>
                    <select
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    >
                      <option value="">Выберите питомца</option>
                      {mockUser.pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      В реальной версии здесь будут данные из личного кабинета.
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-500">
                    Для выбора существующего питомца нужен личный кабинет. Пока
                    можете указать питомца как нового.
                  </p>
                )
              ) : (
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Питомец
                  </label>
                  <input
                    type="text"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    placeholder="Кличка, вид, возраст (например: Локи, кошка 2 года)"
                  />
                </div>
              )}
            </section>

            {/* 3. Услуга и врач */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Услуга и врач
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Услуга
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  >
                    <option value="">Выберите услугу</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Врач
                  </label>
                  <div className="flex flex-wrap gap-2 text-[12px] mb-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="doctorMode"
                        value="any"
                        checked={doctorMode === "any"}
                        onChange={() => setDoctorMode("any")}
                        className="rounded-full border-slate-300"
                      />
                      <span>Любой врач</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="doctorMode"
                        value="specific"
                        checked={doctorMode === "specific"}
                        onChange={() => setDoctorMode("specific")}
                        className="rounded-full border-slate-300"
                      />
                      <span>Выбрать врача</span>
                    </label>
                  </div>

                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    disabled={doctorMode === "any"}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  >
                    <option value="">Не выбран</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 4. Дата и время */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Дата и время</h2>
              <div className="flex flex-wrap gap-3 text-[12px]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeMode"
                    value="any"
                    checked={timeMode === "any"}
                    onChange={() => setTimeMode("any")}
                    className="rounded-full border-slate-300"
                  />
                  <span>Любое ближайшее время (администратор предложит варианты)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeMode"
                    value="choose"
                    checked={timeMode === "choose"}
                    onChange={() => setTimeMode("choose")}
                    className="rounded-full border-slate-300"
                  />
                  <span>Выбрать дату и время</span>
                </label>
              </div>

              {timeMode === "choose" && (
                <div className="grid md:grid-cols-[1fr,1fr] gap-4">
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Дата
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Время
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 5. Файлы и документы */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Анализы, документы, фото (при необходимости)
              </h2>
              <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/80 text-[13px] text-slate-600">
                <p className="mb-2">
                  Вы можете прикрепить результаты анализов, выписки, УЗИ, рентген,
                  фото и другие файлы, которые помогут врачу лучше понять
                  ситуацию.
                </p>
                <label className="inline-flex items-center gap-2 text-[12px] cursor-pointer">
                  <span className="px-3 py-1.5 rounded-full bg-white border border-slate-300 shadow-sm">
                    Выбрать файлы
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx"
                  />
                  <span className="text-slate-500">
                    (pdf, изображения и другие форматы)
                  </span>
                </label>
                {files.length > 0 && (
                  <ul className="mt-2 text-[12px] text-slate-600 list-disc pl-4">
                    {files.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* 6. Согласия и отправка */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Согласия и завершение заявки
              </h2>
              <div className="space-y-2 text-[12px] text-slate-600">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={consentPersonalData}
                    onChange={(e) => setConsentPersonalData(e.target.checked)}
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
                    Я подтверждаю, что, нажимая кнопку «Записаться», заключаю
                    договор в соответствии с{" "}
                    <Link
                      href="/docs/offer"
                      className="text-onlyvet-coral underline-offset-2 hover:underline"
                    >
                      публичной офертой
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
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`
                    w-full px-4 py-2.5 rounded-full text-[13px] font-medium
                    ${
                      isValid
                        ? "bg-onlyvet-coral text-white shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }
                  `}
                >
                  Записаться на консультацию
                </button>
                <p className="mt-2 text-[11px] text-slate-500">
                  Нажимая «Записаться», вы подтверждаете корректность указанных
                  данных. После обработки заявки с вами свяжется администратор
                  для уточнения деталей.
                </p>
              </div>
            </section>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
