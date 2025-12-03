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
import { BookingPetSection } from "./components/BookingPetSection";
import { BookingComplaintSection } from "./components/BookingComplaintSection";
import { BookingDoctorSection } from "./components/BookingDoctorSection";
import { BookingTimeSection } from "./components/BookingTimeSection";
import { BookingFilesSection } from "./components/BookingFilesSection";
import { BookingSummarySection } from "./components/BookingSummarySection";

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

  // время
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

  // подстановка мок-пользователя
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

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;
  const selectedService =
    services.find((s) => s.id === selectedServiceId) || null;
  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || null;

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
    }
  }, [selectedDoctorId, availableDoctors]);

  useEffect(() => {
    if (
      selectedServiceId &&
      !availableServices.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId("");
    }
  }, [selectedServiceId, availableServices]);

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
    (!petNameRequired ||
      petMode === "existing" ||
      newPetName.trim().length > 0) &&
    consentPersonalData &&
    consentOffer &&
    consentRules;

  const showFull = kind === "full";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const petSpecies =
        showFull && petMode === "new" ? newPetSpecies || undefined : undefined;

      const petNotes =
        showFull && petMode === "new"
          ? [
              newPetBreed && `порода: ${newPetBreed}`,
              newPetAge && `возраст: ${newPetAge}`,
              newPetWeight && `вес: ${newPetWeight}`,
            ]
              .filter(Boolean)
              .join("; ")
          : undefined;

      const payload = {
        fullName,
        phone,
        telegram: telegram || undefined,
        email,
        petMode: showFull ? petMode : "new",
        petId:
          showFull && petMode === "existing" ? selectedPetId || undefined : undefined,
        petName:
          showFull && petMode === "new" ? newPetName || undefined : undefined,
        petSpecies,
        petNotes,
        serviceId: showFull && selectedServiceId ? selectedServiceId : undefined,
        doctorId:
          showFull && doctorMode === "manual" && selectedDoctorId
            ? selectedDoctorId
            : undefined,
        timeMode: showFull ? timeMode : "any",
        preferredDate:
          showFull && timeMode === "choose" ? date || undefined : undefined,
        preferredTime:
          showFull && timeMode === "choose" ? time || undefined : undefined,
        vmSlotId: showFull && selectedSlotId ? selectedSlotId : undefined,
        complaint: complaint || undefined,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(data.error || "Не удалось отправить заявку.");
        return;
      }

      setServerSuccess("Заявка отправлена. Мы свяжемся с вами.");
    } catch (err) {
      setServerError("Произошла ошибка. Попробуйте позже.");
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
              / <span className="text-slate-700">Записаться на консультацию</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Записаться на онлайн-консультацию
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Выберите удобный формат: короткая заявка, подробная форма или переписка в Telegram.
            </p>
          </div>

          {/* Карточки формата */}
          <BookingModeCards
            kind={kind}
            onChangeKind={setKind}
            onTelegramClick={handleTelegramClick}
          />

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-6"
          >
            {/* Сообщения */}
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

            {/* Контакты */}
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

            {/* Питомец */}
            {showFull && (
              <BookingPetSection
                petMode={petMode}
                setPetMode={setPetMode}
                selectedPetId={selectedPetId}
                setSelectedPetId={setSelectedPetId}
                newPetName={newPetName}
                setNewPetName={setNewPetName}
                newPetSpecies={newPetSpecies}
                setNewPetSpecies={setNewPetSpecies}
                newPetBreed={newPetBreed}
                setNewPetBreed={setNewPetBreed}
                newPetAge={newPetAge}
                setNewPetAge={setNewPetAge}
                newPetWeight={newPetWeight}
                setNewPetWeight={setNewPetWeight}
                newPetNameError={newPetNameError}
                isLoggedIn={mockIsLoggedIn}
                pets={mockUser.pets}
              />
            )}

            {/* Проблема */}
            <BookingComplaintSection
              complaint={complaint}
              setComplaint={setComplaint}
              kind={kind}
            />

            {/* Услуга / врач / время / файлы / summary – только в полной форме */}
            {showFull && (
              <>
                {/* Услуга (пока inline, можно вынести позже) */}
                <section className="space-y-3">
                  <h2 className="text-[15px] font-semibold">Услуга</h2>
                  <div className="space-y-2">
                    <label className="block text-[12px] text-slate-600 mb-1">
                      Выберите услугу
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                    >
                      <option value="">Не знаю / нужна помощь</option>
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
                      <p className="text-[11px] text-slate-500">
                        {selectedService.shortDescription}
                      </p>
                    )}
                  </div>
                </section>

                {/* Врач */}
                <BookingDoctorSection
                  doctorMode={doctorMode}
                  setDoctorMode={setDoctorMode}
                  selectedDoctorId={selectedDoctorId}
                  setSelectedDoctorId={setSelectedDoctorId}
                  availableDoctors={availableDoctors}
                  selectedDoctor={selectedDoctor || undefined}
                />

                {/* Дата и время */}
                <BookingTimeSection
                  timeMode={timeMode}
                  setTimeMode={setTimeMode}
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
                  timeSelectionLocked={timeSelectionLocked}
                  selectedSlotLabel={selectedSlotLabel || undefined}
                />

                {/* Файлы */}
                <BookingFilesSection
                  files={files}
                  onFileChange={setFiles}
                />

                {/* Итоговый summary */}
                <BookingSummarySection
                  selectedService={selectedService}
                  selectedDoctor={selectedDoctor}
                  selectedSlotLabel={selectedSlotLabel || null}
                  resetSelection={resetSelection}
                  resetSlot={resetSlot}
                />
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
                    </Link>
                    .
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
                    </Link>
                    .
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
