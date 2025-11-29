// app/booking/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { slots } from "@/data/slots";

type BookingPageProps = {
  searchParams?: {
    doctorId?: string;
    serviceId?: string;
    slotId?: string;
    petId?: string;
  };
};

// режим выбора врача
type DoctorMode = "auto" | "manual";

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

export default function BookingPage({ searchParams }: BookingPageProps) {
  const doctorIdFromQuery = searchParams?.doctorId || "";
  const serviceIdFromQuery = searchParams?.serviceId || "";
  const slotIdFromQuery = searchParams?.slotId || "";
  const petIdFromQuery = searchParams?.petId || "";

  const initialDoctorId =
    doctorIdFromQuery && doctors.some((d) => d.id === doctorIdFromQuery)
      ? doctorIdFromQuery
      : "";

  const initialServiceId =
    serviceIdFromQuery && services.some((s) => s.id === serviceIdFromQuery)
      ? serviceIdFromQuery
      : "";

  const initialSlotId =
    slotIdFromQuery && slots.some((s) => s.id === slotIdFromQuery)
      ? slotIdFromQuery
      : "";

  const initialPetId =
    petIdFromQuery && mockUser.pets.some((p) => p.id === petIdFromQuery)
      ? petIdFromQuery
      : "";

  // ФИО
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");

  // контакты
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");

  // питомец
  const [petMode, setPetMode] = useState<"existing" | "new">("existing");
  const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId);

  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState("");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [newPetAge, setNewPetAge] = useState("");
  const [newPetWeight, setNewPetWeight] = useState("");

  // жалобы / суть проблемы
  const [complaint, setComplaint] = useState("");

  // врач / услуга / слот
  const [selectedServiceId, setSelectedServiceId] =
    useState<string>(initialServiceId);
  const [doctorMode, setDoctorMode] = useState<DoctorMode>(
    initialDoctorId ? "manual" : "auto"
  );
  const [selectedDoctorId, setSelectedDoctorId] =
    useState<string>(initialDoctorId);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId);

  // время вручную
  const [timeMode, setTimeMode] = useState<"any" | "choose">("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // файлы (пока только на фронте)
  const [files, setFiles] = useState<File[]>([]);

  // согласия
  const [consentPersonalData, setConsentPersonalData] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // валидация / статус отправки
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mockIsLoggedIn) {
      const parts = mockUser.fullName.split(" ");
      setLastName(parts[0] || "");
      setFirstName(parts[1] || "");
      setMiddleName(parts.slice(2).join(" ") || "");
      setPhone(mockUser.phone);
      setTelegram(mockUser.telegram);
      if (mockUser.pets.length > 0 && !selectedPetId) {
        setSelectedPetId(mockUser.pets[0].id);
      }
    }
  }, [selectedPetId]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  const timeSelectionLocked = !!selectedSlot;

  const fullName = [lastName, firstName, middleName].filter(Boolean).join(" ");

  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const emailError = hasSubmitted && !email.trim();

  const newPetNameError =
    hasSubmitted && petMode === "new" && !newPetName.trim();

  const consentsError =
    hasSubmitted &&
    (!consentPersonalData || !consentOffer || !consentRules);

  // фильтрация врачей под выбранную услугу
  const availableDoctors = selectedService
    ? doctors.filter((d) =>
        selectedService.specializations.includes(d.specialization as any)
      )
    : doctors;

  useEffect(() => {
    // если выбран врач, но он не подходит под выбранную услугу — сбрасываем
    if (
      selectedDoctorId &&
      !availableDoctors.some((d) => d.id === selectedDoctorId)
    ) {
      setSelectedDoctorId("");
      if (doctorMode === "manual") {
        setDoctorMode("manual");
      }
    }
  }, [selectedServiceId, selectedDoctorId, availableDoctors, doctorMode]);

  useEffect(() => {
    // при смене режима врача на auto очищаем выбранного врача
    if (doctorMode !== "manual" && selectedDoctorId) {
      setSelectedDoctorId("");
    }
  }, [doctorMode, selectedDoctorId]);

  const isValid =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    (petMode === "existing" || newPetName.trim().length > 0) &&
    consentPersonalData &&
    consentOffer &&
    consentRules;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const petSpecies =
        petMode === "new" ? newPetSpecies || undefined : undefined;

      const petNotes =
        petMode === "new"
          ? [
              newPetBreed ? `порода: ${newPetBreed}` : "",
              newPetAge ? `возраст: ${newPetAge}` : "",
              newPetWeight ? `вес: ${newPetWeight}` : "",
            ]
              .filter(Boolean)
              .join("; ")
          : undefined;

      const payload = {
        fullName,
        phone,
        telegram: telegram || undefined,
        email,
        petMode,
        petId: petMode === "existing" ? selectedPetId || undefined : undefined,
        petName: petMode === "new" ? newPetName || undefined : undefined,
        petSpecies,
        petNotes,

        serviceId:
          selectedServiceId && selectedServiceId !== "unknown"
            ? selectedServiceId
            : undefined,
        doctorId:
          doctorMode === "manual" && selectedDoctorId
            ? selectedDoctorId
            : undefined,

        timeMode,
        preferredDate: timeMode === "choose" ? date || undefined : undefined,
        preferredTime: timeMode === "choose" ? time || undefined : undefined,
        vmSlotId: selectedSlotId || undefined,

        complaint: complaint || undefined, // 🔹 жалоба
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(
          data?.error || "Не удалось отправить заявку. Попробуйте позже."
        );
        return;
      }

      await res.json();

      setServerSuccess(
        "Заявка отправлена. Мы свяжемся с вами для подтверждения консультации."
      );
    } catch (err) {
      console.error(err);
      setServerError("Произошла техническая ошибка. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSelection = () => {
    setSelectedDoctorId("");
    setSelectedServiceId("");
    setSelectedSlotId("");
    setDoctorMode("auto");
  };

  const resetSlot = () => {
    setSelectedSlotId("");
  };

  const selectedSlotLabel =
    selectedSlot &&
    (() => {
      const dt = new Date(selectedSlot.start);
      const dateLabel = dt.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timeLabel = dt.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${dateLabel} · ${timeLabel}`;
    })();

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Заголовок */}
          <div className="mb-5">
            <nav className="text-[12px] text-slate-500 mb-2">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">
                Записаться на консультацию
              </span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Записаться на онлайн-консультацию
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Заполните форму — мы подберём удобное время и врача. Если вы
              перешли из карточки врача или услуги, выбранные параметры уже
              подставлены.
            </p>
          </div>

          {/* Плашка выбора врача/услуги/слота */}
          {(selectedDoctor || selectedService || selectedSlot) && (
            <div className="mb-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1 text-[13px] text-slate-700">
                <div className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                  Вы выбрали
                </div>
                {selectedDoctor && (
                  <div>
                    Врач:{" "}
                    <Link
                      href={`/doctors/${selectedDoctor.id}`}
                      className="font-medium text-onlyvet-navy hover:text-onlyvet-coral"
                    >
                      {selectedDoctor.name}
                    </Link>
                    <span className="text-[12px] text-slate-500">
                      {" "}
                      · {selectedDoctor.role}
                    </span>
                  </div>
                )}
                {selectedService && (
                  <div>
                    Услуга:{" "}
                    <Link
                      href={`/services/${selectedService.id}`}
                      className="font-medium text-onlyvet-navy hover:text-onlyvet-coral"
                    >
                      {selectedService.name}
                    </Link>
                    <span className="text-[12px] text-slate-500">
                      {" "}
                      · {selectedService.priceLabel}
                    </span>
                  </div>
                )}
                {selectedSlot && selectedSlotLabel && (
                  <div>
                    Время:{" "}
                    <span className="font-medium text-onlyvet-navy">
                      {selectedSlotLabel}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-[12px]">
                {selectedSlot && (
                  <button
                    type="button"
                    onClick={resetSlot}
                    className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                  >
                    Изменить время
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetSelection}
                  className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  Сбросить выбор
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-6"
          >
            {/* Сообщения об успехе/ошибке */}
            {serverSuccess && (
              <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2">
                {serverSuccess}
              </div>
            )}
            {serverError && (
              <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
                {serverError}
              </div>
            )}

            {/* Контактные данные */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Контактные данные</h2>

              {/* ФИО */}
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
                    placeholder="Иванович (необязательно)"
                  />
                </div>
              </div>

              {/* Телефон + email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Номер телефона<span className="text-red-500">*</span>
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
                      Укажите номер телефона, чтобы мы могли связаться с вами.
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
                        : "border-slate-300 focus:ring-onlyvet-teал/40"
                    }`}
                    placeholder="example@mail.ru"
                  />
                  {emailError && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      Email обязателен для подтверждений и материалов
                      консультации.
                    </p>
                  )}
                </div>
              </div>

              {/* Telegram */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Логин Telegram
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                    placeholder="@username (необязательно)"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    При наличии нам проще общаться через Telegram.
                  </p>
                </div>
              </div>
            </section>

            {/* Питомец */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Информация о питомце
              </h2>
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
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                    >
                      <option value="">Выберите питомца</option>
                      {mockUser.pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      В реальной версии здесь будут данные из вашего личного
                      кабинета.
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-500">
                    Для выбора существующего питомца нужен личный кабинет. Пока
                    можно указать питомца как нового.
                  </p>
                )
              ) : (
                <div className="space-y-3">
                  {/* Кличка */}
                  <div>
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Кличка<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                        newPetNameError
                          ? "border-rose-400 focus:ring-rose-300"
                          : "border-slate-300 focus:ring-onlyvet-teал/40"
                      }`}
                      placeholder="Например: Локи"
                    />
                    {newPetNameError && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Укажите кличку питомца.
                      </p>
                    )}
                  </div>

                  {/* Вид и порода */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] text-сlate-600 mb-1">
                        Вид
                      </label>
                      <select
                        value={newPetSpecies}
                        onChange={(e) => setNewPetSpecies(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                      >
                        <option value="">
                          Выберите вид или оставьте пустым
                        </option>
                        <option value="кошка">Кошка</option>
                        <option value="собака">Собака</option>
                        <option value="грызун">Грызун</option>
                        <option value="птица">Птица</option>
                        <option value="другое">Другое</option>
                        <option value="не знаю">Не знаю</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Порода
                      </label>
                      <input
                        type="text"
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                        placeholder="Например: шотландская, метис и т.п."
                      />
                    </div>
                  </div>

                  {/* Возраст и вес */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Возраст
                      </label>
                      <input
                        type="text"
                        value={newPetAge}
                        onChange={(e) => setNewPetAge(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                        placeholder="Например: 2 года, 8 месяцев, не знаю"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-slate-600 mb-1">
                        Вес (примерно)
                      </label>
                      <input
                        type="text"
                        value={newPetWeight}
                        onChange={(e) => setNewPetWeight(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                        placeholder="Например: 4.5 кг, ~20 кг, не знаю"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Кратко о проблеме */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Кратко о проблеме
              </h2>
              <p className="text-[12px] text-slate-600">
                Опишите, что вас беспокоит: какие симптомы, с какого времени,
                что уже делали (анализы, лечение). Это поможет врачу лучше
                подготовиться к консультации.
              </p>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={4}
                className="
                  w-full rounded-2xl border border-slate-300 px-3 py-2
                  text-[13px] resize-none
                  focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
                "
                placeholder="Например: 2 недели периодическая рвота, снижение аппетита, гастрит в анамнезе, есть анализы крови за прошлую неделю..."
              />
              <p className="text-[11px] text-slate-500">
                Это поле не обязательно, но очень помогает врачу.
              </p>
            </section>

            {/* Услуга и врач */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Услуга и врач</h2>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                {/* Услуга */}
                <div className="space-y-2">
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Услуга
                  </label>
                  <select
                    value={selectedServiceId || "unknown"}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  >
                    <option value="unknown">
                      Не знаю / нужна помощь с выбором
                    </option>
                    <optgroup label="Консультации">
                      {services
                        .filter((s) => s.category === "консультация")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Второе мнение">
                      {services
                        .filter((s) => s.category === "второе мнение")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Диагностика">
                      {services
                        .filter((s) => s.category === "диагностика")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Сопровождение">
                      {services
                        .filter((s) => s.category === "сопровождение")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                  {selectedService && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Фокус услуги: {selectedService.shortDescription}
                    </p>
                  )}
                  {!selectedService && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Если вы не уверены, какая услуга нужна — оставьте вариант
                      «Не знаю». Администратор поможет подобрать формат.
                    </p>
                  )}
                </div>

                {/* Врач */}
                <div className="space-y-2">
                  <label className="block text-[12px] text-slate-600 mb-1">
                    Врач
                  </label>

                  <div className="flex flex-col gap-1 text-[12px] mb-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="doctorMode"
                        value="auto"
                        checked={doctorMode === "auto"}
                        onChange={() => setDoctorMode("auto")}
                        className="rounded-full border-slate-300"
                      />
                      <span>
                        <span className="font-medium">
                          Автоматический подбор врача
                        </span>{" "}
                        <span className="text-slate-500">(рекомендуется)</span>
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="doctorMode"
                        value="manual"
                        checked={doctorMode === "manual"}
                        onChange={() => setDoctorMode("manual")}
                        className="rounded-full border-slate-300"
                      />
                      <span className="font-medium">
                        Выбрать врача вручную
                      </span>
                    </label>
                  </div>

                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    disabled={doctorMode !== "manual"}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                  >
                    <option value="">Не выбран</option>
                    {availableDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  {doctorMode === "manual" && selectedDoctor && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Специализация врача: {selectedDoctor.role}
                    </p>
                  )}
                  {doctorMode === "auto" && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Мы подберём врача с нужной специализацией под ваш запрос.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Дата и время */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">Дата и время</h2>

              {!timeSelectionLocked && (
                <>
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
                      <span>Любое ближайшее время (подберём сами)</span>
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
                </>
              )}

              {timeSelectionLocked && selectedSlot && selectedSlotLabel && (
                <div className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3 text-[12px] text-slate-600 space-y-1">
                  <div className="font-medium text-slate-700">
                    Время выбрано: {selectedSlotLabel}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Если вы хотите изменить дату или время, нажмите «Изменить
                    время» выше — слот будет снят, и вы сможете выбрать другую
                    опцию.
                  </p>
                </div>
              )}

              <div className="bg-onlyvet-bg rounded-2xl border border-dashed border-slate-300 p-3 text-[11px] текст-slate-600 mt-2">
                В реальной версии здесь будут отображаться доступные слоты из
                Vetmanager, а выбранный слот будет бронироваться автоматически.
              </div>
            </section>

            {/* Файлы */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Анализы, документы, фото (при необходимости)
              </h2>
              <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/80 text-[13px] text-slate-600">
                <p className="mb-2">
                  Вы можете прикрепить результаты анализов, выписки, УЗИ,
                  рентген, фото и другие файлы, которые помогут врачу лучше
                  понять ситуацию.
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
                    (pdf, изображения и др. форматы)
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

            {/* Согласия */}
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
                {consentsError && (
                  <p className="text-[11px] text-rose-600">
                    Для отправки заявки необходимо отметить все согласия.
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`
                    w-full px-4 py-2.5 rounded-full text-[13px] font-medium
                    ${
                      !isValid || isSubmitting
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-onlyvet-coral text-white shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
                    }
                  `}
                >
                  {isSubmitting
                    ? "Отправляем заявку..."
                    : "Записаться на консультацию"}
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
