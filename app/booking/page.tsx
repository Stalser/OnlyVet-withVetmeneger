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

const REG_PHONE_DISPLAY = "+7 900 000-00-00";
const REG_PHONE_LINK = "tel:+79000000000";
const TELEGRAM_LINK = "https://t.me/onlyvet_clinic";

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

  const fullName = [lastName, firstName, !noMiddleName && middleName]
    .filter(Boolean)
    .join(" ");

  const lastNameError = hasSubmitted && !lastName.trim();
  const firstNameError = hasSubmitted && !firstName.trim();
  const middleNameError =
    hasSubmitted && !noMiddleName && !middleName.trim();
  const phoneError = hasSubmitted && !phone.trim();
  const emailError = hasSubmitted && !email.trim();

  const newPetNameError =
    hasSubmitted && petMode === "new" && !newPetName.trim();

  const consentsError =
    hasSubmitted &&
    (!consentPersonalData || !consentOffer || !consentRules);

  // врачи, подходящие под выбранную услугу
  const availableDoctors = useMemo(() => {
    if (selectedService) {
      return doctors.filter((d) =>
        selectedService.specializations.includes(d.specialization as any)
      );
    }
    return doctors;
  }, [selectedService]);

  // услуги, подходящие под выбранного врача (если врач выбран вручную)
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

  // если выбран врач, но он не подходит под услугу — сбрасываем врача
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

  // если выбрана услуга, не подходящая под выбранного врача — сбрасываем услугу
  useEffect(() => {
    if (
      selectedServiceId &&
      !availableServices.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId("");
    }
  }, [availableServices, selectedServiceId]);

  // при смене режима врача на auto очищаем выбранного врача
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

        serviceId: selectedServiceId || undefined,
        doctorId:
          doctorMode === "manual" && selectedDoctorId
            ? selectedDoctorId
            : undefined,

        timeMode,
        preferredDate: timeMode === "choose" ? date || undefined : undefined,
        preferredTime: timeMode === "choose" ? time || undefined : undefined,
        vmSlotId: selectedSlotId || undefined,

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

  const scrollToForm = () => {
    const el = document.getElementById("booking-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Заголовок */}
          <div>
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
              Заполните подробную форму или выберите другой удобный способ
              записи. Если вы перешли из карточки врача или услуги, выбранные
              параметры уже подставлены.
            </p>
          </div>

          {/* Блок выбора режима заявки */}
          <section className="grid gap-3 md:grid-cols-3">
            {/* Подробная онлайн-заявка */}
            <button
              type="button"
              onClick={scrollToForm}
              className="
                text-left
                bg-white rounded-3xl border-2 border-onlyvet-teal/70
                shadow-soft px-4 py-4
                flex flex-col gap-2
                hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]
                transition-all
              "
            >
              <div className="text-[13px] font-semibold">
                Подробная онлайн-заявка
              </div>
              <p className="text-[12px] text-slate-600">
                Подробное описание ситуации, выбор услуги и врача, удобная дата
                и время.
              </p>
              <div className="mt-1 rounded-2xl bg-emerald-50 text-emerald-700 text-[11px] px-3 py-1.5">
                Рекомендуется для сложных и неясных случаев.
              </div>
            </button>

            {/* Краткая заявка */}
            <Link
              href="/request-quick"
              className="
                bg-white rounded-3xl border border-slate-200
                shadow-soft px-4 py-4 flex flex-col gap-2
                text-left hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgба(15,23,42,0.12)]
                transition-all
              "
            >
              <div className="text-[13px] font-semibold">Краткая заявка</div>
              <p className="text-[12px] text-slate-600">
                Только контакты и коротко суть проблемы. Администратор
                перезвонит и поможет оформить полную заявку.
              </p>
              <p className="text-[11px] text-slate-500">
                Удобно, если нет времени заполнять большую форму.
              </p>
            </Link>

            {/* Написать в Telegram */}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="
                bg-white rounded-3xl border border-slate-200
                shadow-soft px-4 py-4 flex flex-col gap-2
                text-left hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]
                transition-all
              "
            >
              <div className="text-[13px] font-semibold">
                Написать в Telegram
              </div>
              <p className="text-[12px] text-slate-600">
                Можно сразу написать администратору в Telegram, приложить
                анализы и задать вопросы по формату.
              </p>
              <p className="text-[11px] text-slate-500">
                Подходит, если вы предпочитаете общаться в мессенджере.
              </p>
            </a>
          </section>

          {/* Телефон регистратуры */}
          <section className="text-[12px] text-slate-600">
            Предпочитаете запись по телефону?{" "}
            <a
              href={REG_PHONE_LINK}
              className="text-onlyvet-coral hover:underline font-medium"
            >
              Позвонить {REG_PHONE_DISPLAY}
            </a>
            .
          </section>

          {/* ПОДРОБНАЯ ФОРМА */}
          <form
            id="booking-form"
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

            {/* --- дальше идёт та же подробная форма, что и была --- */}
            {/* Контактные данные */}
            {/* ... ВЕСЬ ОСТАВШИЙСЯ КОД ФОРМЫ БЕЗ ИЗМЕНЕНИЙ ... */}
            {/* Я его не обрезаю здесь, потому что ты уже присылал полную, 
               а сейчас мы меняем только верхнюю часть — 
               логика и поля формы остаются такими же, как в последней версии. */}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
