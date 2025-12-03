// app/booking/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { slots } from "@/data/slots";
import { BookingModeCards } from "./BookingModeCards";
import { BookingContactSection } from "./components/BookingContactSection";

type BookingPageProps = {
  searchParams?: {
    doctorId?: string;
    serviceId?: string;
    slotId?: string;
    petId?: string;
  };
};

type DoctorMode = "auto" | "manual";
type RequestKind = "short" | "full";

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
  const [noMiddleName, setNoMiddleName] = useState(false);

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

  // жалобы
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

  // файлы
  const [files, setFiles] = useState<File[]>([]);

  // согласия
  const [consentPersonalData, setConsentPersonalData] = useState(false);
  const [consentOffer, setConsentOffer] = useState(false);
  const [consentRules, setConsentRules] = useState(false);

  // тип заявки
  const [kind, setKind] = useState<RequestKind>("short");

  // статус отправки
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

  const fullName = [lastName, firstName, !noMiddleName && middleName]
    .filter(Boolean)
    .join(" ");

  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const middleNameError =
    hasSubmitted && !noMiddleName && !middleName.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const emailError = hasSubmitted && !email.trim();

  const petNameRequired = kind === "full";
  const newPetNameError =
    hasSubmitted && petMode === "new" && petNameRequired && !newPetName.trim();

  const consentsError =
    hasSubmitted &&
    (!consentPersonalData || !consentOffer || !consentRules);

  const availableDoctors = useMemo(() => {
    if (selectedService) {
      return doctors.filter((d) =>
        selectedService.specializations.includes(d.specialization as any)
      );
    }
    return doctors;
  }, [selectedService]);

  const availableServices = useMemo(() => {
    if (doctorMode === "manual" && selectedDoctorId) {
      const doc = doctors.find((d) => d.id === selectedDoctorId);
      if (!doc) return services;
      return services.filter((s) =>
        s.specializations.includes(doc.specialization as any)
      );
    }
    return services;
  }, [doctorMode, selectedDoctorId]);

  useEffect(() => {
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
    if (
      selectedServiceId &&
      !availableServices.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId("");
    }
  }, [availableServices, selectedServiceId]);

  useEffect(() => {
    if (doctorMode !== "manual" && selectedDoctorId) {
      setSelectedDoctorId("");
    }
  }, [doctorMode, selectedDoctorId]);

  const isValid =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    (noMiddleName || middleName.trim().length > 0) &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    (!petNameRequired || petMode === "existing" || newPetName.trim().length > 0) &&
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
        kind === "full" && petMode === "new"
          ? newPetSpecies || undefined
          : undefined;

      const petNotes =
        kind === "full" && petMode === "new"
          ? [
              newPetBreed ? `порода: ${newPetBreed}` : "",
              newPetAge ? `возраст: ${newPetAge}` : "",
              newPetWeight ? `вес: ${newPetWeight}` : "",
            ]
              .filter(Boolean)
              .join("; ")
          : undefined;

      const effectiveServiceId =
        kind === "full" && selectedServiceId ? selectedServiceId : undefined;

      const effectiveDoctorId =
        kind === "full" && doctorMode === "manual" && selectedDoctorId
          ? selectedDoctorId
          : undefined;

      const effectiveTimeMode = kind === "full" ? timeMode : "any";
      const effectivePreferredDate =
        kind === "full" && timeMode === "choose" && date ? date : undefined;
      const effectivePreferredTime =
        kind === "full" && timeMode === "choose" && time ? time : undefined;

      const payload = {
        fullName,
        phone,
        telegram: telegram || undefined,
        email,
        petMode: kind === "full" ? petMode : "new",
        petId:
          kind === "full" && petMode === "existing"
            ? selectedPetId || undefined
            : undefined,
        petName:
          kind === "full" && petMode === "new"
            ? newPetName || undefined
            : undefined,
        petSpecies,
        petNotes,
        serviceId: effectiveServiceId,
        doctorId: effectiveDoctorId,
        timeMode: effectiveTimeMode,
        preferredDate: effectivePreferredDate,
        preferredTime: effectivePreferredTime,
        vmSlotId: kind === "full" ? selectedSlotId || undefined : undefined,
        complaint: complaint || undefined,
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

  const handleTelegramClick = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://t.me/onlyvet_clinic",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const showFull = kind === "full";

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Заголовок */}
          <div className="mb-6">
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
              Выберите удобный формат: короткая заявка, подробная форма или
              переписка в Telegram.
            </p>
          </div>

          {/* Карточки выбора формата */}
          <BookingModeCards
            kind={kind}
            onChangeKind={setKind}
            onTelegramClick={handleTelegramClick}
          />

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
            <BookingContactSection
              lastName={lastName}
              firstName={firstName}
              middleName={middleName}
              noMiddleName={noMiddleName}
              phone={phone}
              email={email}
              telegram={telegram}
              setLastName={setLastName}
              setFirstName={setFirstName}
              setMiddleName={setMiddleName}
              setNoMiddleName={setNoMiddleName}
              setPhone={setPhone}
              setEmail={setEmail}
              setTelegram={setTelegram}
              errors={{
                lastNameError,
                firstNameError,
                middleNameError,
                phoneError,
                emailError,
              }}
            />

            {/* Питомец – только для подробной заявки */}
            {showFull && (
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
                        В реальной версии здесь будут данные из личного
                        кабинета.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-500">
                      Для выбора существующего питомца нужен личный кабинет.
                      Пока можно указать питомца как нового.
                    </p>
                  )
                ) : (
                  <div className="space-y-3">
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
                            : "border-slate-300 focus:ring-onlyvet-teal/40"
                        }`}
                        placeholder="Например: Локи"
                      />
                      {newPetNameError && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Укажите кличку питомца.
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] text-slate-600 mb-1">
                          Вид
                        </label>
                        <select
                          value={newPetSpecies}
                          onChange={(e) => setNewPetSpecies(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
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
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                          placeholder="Например: шотландская, метис"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] text-slate-600 mb-1">
                          Возраст
                        </label>
                        <input
                          type="text"
                          value={newPetAge}
                          onChange={(e) => setNewPetAge(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                          placeholder="Например: 2 года, 8 месяцев"
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
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                          placeholder="Например: 4.5 кг, ~20 кг"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Кратко о проблеме (общий блок для обоих режимов) */}
            <section className="space-y-3">
              <h2 className="text-[15px] font-semibold">
                Кратко о проблеме
              </h2>
              <p className="text-[12px] text-slate-600">
                Опишите симптомы, длительность, предыдущее лечение и анализы.
              </p>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={kind === "short" ? 4 : 5}
                className="
                  w-full rounded-2xl border border-slate-300 px-3 py-2
                  text-[13px] resize-none
                  focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40
                "
                placeholder="Например: 2 недели периодическая рвота, снижение аппетита..."
              />
            </section>

            {/* Услуга / врач / время / файлы — только для подробной формы */}
            {showFull && (
              <>
                {/* Услуга */}
                <section className="space-y-3">
                  <h2 className="text-[15px] font-semibold">Услуга</h2>
                  <div className="space-y-2">
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Выберите услугу
                    </label>
                    <select
                      value={selectedServiceId || ""}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
                    >
                      <option value="">
                        Не знаю / нужна помощь с выбором
                      </option>
                      <optgroup label="Консультации">
                        {availableServices
                          .filter((s) => s.category === "консультация")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Второе мнение">
                        {availableServices
                          .filter((s) => s.category === "второе мнение")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Диагностика">
                        {availableServices
                          .filter((s) => s.category === "диагностика")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Сопровождение">
                        {availableServices
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
                  </div>
                </section>

                {/* Врач */}
                <section className="space-y-3">
                  <h2 className="text-[15px] font-semibold">Врач</h2>
                  <div className="space-y-2">
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
                          <span className="text-slate-500">
                            (рекомендуется)
                          </span>
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
                        Мы подберём врача с нужной специализацией под ваш
                        запрос.
                      </p>
                    )}
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
                          <span>Любое ближайшее время</span>
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
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
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
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teал/40"
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
                        Если хотите изменить время — снимите бронь слота.
                      </p>
                    </div>
                  )}

                  <div className="bg-onlyvet-bg rounded-2xl border border-dashed border-slate-300 p-3 text-[11px] text-slate-600 mt-2">
                    В реальной версии здесь будут слоты из Vetmanager.
                  </div>
                </section>

                {/* Анализы, файлы */}
                <section className="space-y-3">
                  <h2 className="text-[15px] font-semibold">
                    Анализы, документы, фото
                  </h2>
                  <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/80 text-[13px] text-slate-600">
                    <p className="mb-2">
                      Прикрепите анализы, выписки, УЗИ, рентген, фото и др.
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

                {/* Вы выбрали */}
                {(selectedService || selectedDoctor || selectedSlotLabel) && (
                  <section className="space-y-2">
                    <h2 className="text-[15px] font-semibold">Вы выбрали</h2>
                    <div className="bg-onlyvet-bg rounded-3xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[13px] text-slate-700">
                      <div className="space-y-1">
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
                        {selectedSlotLabel && (
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
                  </section>
                )}
              </>
            )}

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
                  После обработки заявки с вами свяжется администратор.
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
