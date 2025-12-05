// app/booking/page.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import { getSupabaseClient } from "@/lib/supabaseClient";

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
import { BookingConsentsSection } from "./components/BookingConsentsSection";
import { BookingServiceSection } from "./components/BookingServiceSection";

const supabase = getSupabaseClient();

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
  const [submitted, setSubmitted] = useState(false); // флаг успешной отправки

  // Supabase user id (для связи с consultations.owner_id)
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // refs для автоскролла
  const contactRef = useRef<HTMLDivElement | null>(null);
  const petRef = useRef<HTMLDivElement | null>(null);
  const consentsRef = useRef<HTMLDivElement | null>(null);

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

  // вытаскиваем user.id из Supabase (если пользователь залогинен)
  useEffect(() => {
    let cancelled = false;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!cancelled && data.user) {
        setSupabaseUserId(data.user.id);
      }
    };
    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const scrollToFirstError = () => {
    // ошибки в контактах
    const contactInvalid =
      !lastName.trim() ||
      !firstName.trim() ||
      (!noMiddleName && !middleName.trim()) ||
      !phone.trim() ||
      !email.trim();

    if (contactInvalid) {
      contactRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // ошибки в питомце (только full, новый питомец)
    const petInvalid =
      showFull && petMode === "new" && petNameRequired && !newPetName.trim();

    if (petInvalid) {
      petRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // ошибки в согласиях
    const consentsInvalid =
      !consentPersonalData || !consentOffer || !consentRules;

    if (consentsInvalid) {
      consentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setServerError(null);
    setServerSuccess(null);

    if (!isValid) {
      scrollToFirstError();
      return;
    }

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
          showFull && petMode === "existing"
            ? selectedPetId || undefined
            : undefined,
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
        supabaseUserId: supabaseUserId || undefined, // 🔹 привязка к owner_id в consultations
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
      setSubmitted(true);
    } catch (err) {
      console.error("[booking] submit error:", err);
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

  const handleNewRequest = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
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

          {submitted ? (
            // Экран успешной отправки
            <section className="mt-4 bg-white rounded-3xl border border-emerald-200 shadow-soft p-6 md:p-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 text-xl">✓</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Заявка отправлена
                  </h2>
                  <p className="mt-1 text-[13px] text-slate-600">
                    {serverSuccess ??
                      "Мы получили вашу заявку. Администратор свяжется с вами в ближайшее время для подтверждения времени консультации и уточнения деталей."}
                  </p>
                </div>
              </div>

              {(selectedService || selectedDoctor || selectedSlotLabel) && (
                <div className="mt-4 bg-onlyvet-bg rounded-2xl border border-slate-200 p-4 text-[13px] text-slate-700 space-y-1">
                  {selectedService && (
                    <div>
                      Услуга:{" "}
                      <span className="font-medium">
                        {selectedService.name}
                      </span>{" "}
                      {selectedService.priceLabel && (
                        <span className="text-[12px] text-slate-500">
                          · {selectedService.priceLabel}
                        </span>
                      )}
                    </div>
                  )}
                  {selectedDoctor && (
                    <div>
                      Врач:{" "}
                      <span className="font-medium">
                        {selectedDoctor.name}
                      </span>{" "}
                      <span className="text-[12px] text-slate-500">
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
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNewRequest}
                  className="px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_10px_24px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                >
                  Создать новую заявку
                </button>
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-full border border-slate-300 text-[13px] text-slate-700 hover:bg-slate-50 transition"
                >
                  На главную
                </Link>
              </div>
            </section>
          ) : (
            // Основная форма (до отправки)
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-6"
            >
              {/* Сообщения об ошибке */}
              {serverError && (
                <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
                  {serverError}
                </div>
              )}

              {/* Контактные данные */}
              <div ref={contactRef}>
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
              </div>

              {/* Питомец – только для подробной заявки */}
              {showFull && (
                <div ref={petRef}>
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
                </div>
              )}

              {/* Кратко о проблеме */}
              <BookingComplaintSection
                complaint={complaint}
                setComplaint={setComplaint}
                kind={kind}
              />

              {/* Услуга / врач / время / файлы — только для полной формы */}
              {showFull && (
                <>
                  {/* Услуга */}
                  <BookingServiceSection
                    selectedServiceId={selectedServiceId}
                    setSelectedServiceId={setSelectedServiceId}
                    availableServices={availableServices}
                    selectedService={selectedService}
                  />

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

                  {/* Вы выбрали */}
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
              <div ref={consentsRef}>
                <BookingConsentsSection
                  consentPersonalData={consentPersonalData}
                  consentOffer={consentOffer}
                  consentRules={consentRules}
                  setConsentPersonalData={setConsentPersonalData}
                  setConsentOffer={setConsentOffer}
                  setConsentRules={setConsentRules}
                  consentsError={consentsError}
                  isValid={isValid}
                  isSubmitting={isSubmitting}
                />
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
