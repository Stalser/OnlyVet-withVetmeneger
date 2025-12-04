// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

// --------------------
// Типы и мок-данные
// --------------------

type AccountTab = "consultations" | "pets" | "trusted" | "notifications" | "profile";

type ConsultationStatus = "new" | "in_progress" | "done";

type MockConsultation = {
  id: string;
  petName: string;
  serviceName: string;
  date: string;
  status: ConsultationStatus;
};

type MockPet = {
  id: string;
  name: string;
  species: string;
  age: string;
  weight?: string;
};

type AccessLevel = "view" | "manage" | "finance";

type TrustedPerson = {
  id: string;
  name: string;
  contact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

type TrustedForMe = {
  id: string;
  ownerName: string;
  ownerContact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

const mockConsultations: MockConsultation[] = [
  {
    id: "c1",
    petName: "Локи",
    serviceName: "Онлайн-консультация терапевта",
    date: "2024-12-01 19:00",
    status: "in_progress",
  },
  {
    id: "c2",
    petName: "Рекс",
    serviceName: "Второе мнение по анализам",
    date: "2024-11-20 14:00",
    status: "done",
  },
  {
    id: "c3",
    petName: "Локи",
    serviceName: "Разбор УЗИ и плана лечения",
    date: "2024-11-10 18:30",
    status: "done",
  },
];

const mockPets: MockPet[] = [
  {
    id: "pet1",
    name: "Локи",
    species: "Кошка, шотландская",
    age: "2 года 6 месяцев",
    weight: "4.8 кг",
  },
  {
    id: "pet2",
    name: "Рекс",
    species: "Собака, метис",
    age: "6 лет",
    weight: "22 кг",
  },
];

const mockTrustedPeople: TrustedPerson[] = [
  {
    id: "t1",
    name: "Ольга Петрова",
    contact: "Телефон: +7 900 000-00-01",
    accessLevel: ["view", "manage"],
    scope: "all_pets",
  },
  {
    id: "t2",
    name: "Фонд «Хвосты и лапы»",
    contact: "Email: curator@tails.ru",
    accessLevel: ["view"],
    scope: "selected_pets",
    petNames: ["Рекс"],
  },
];

const mockTrustedForMe: TrustedForMe[] = [
  {
    id: "tm1",
    ownerName: "Анна Смирнова",
    ownerContact: "Телефон: +7 900 123-45-67",
    accessLevel: ["view", "manage"],
    scope: "selected_pets",
    petNames: ["Марта"],
  },
];

const mockNotificationSettings = {
  email: {
    address: "user@example.com",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: true,
    reminderEvents: false,
  },
  telegram: {
    connected: false,
    username: "",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: false,
    reminderEvents: false,
  },
};

// --------------------
// Страница
// --------------------

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>("consultations");

  const [currentUserName, setCurrentUserName] = useState<string>("Пользователь");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !data.user) {
        router.replace("/auth/login");
        return;
      }

      const user = data.user;
      const meta = (user.user_metadata || {}) as any;

      const fullNameFromMeta =
        meta.full_name ||
        [meta.last_name, meta.first_name].filter(Boolean).join(" ");

      setCurrentUserName(
        fullNameFromMeta && fullNameFromMeta.trim().length > 0
          ? fullNameFromMeta
          : user.email || "Пользователь"
      );
      setCurrentUserEmail(user.email || "");
      setCheckingAuth(false);
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <p className="text-[13px] text-slate-600">
              Загружаем личный кабинет...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/60">
        <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
          {/* Заголовок страницы */}
          <div className="mb-5 md:mb-6">
            <nav className="text-[11px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              / <span className="text-slate-700">Личный кабинет</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Личный кабинет
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Аккаунт:{" "}
              <span className="font-medium">{currentUserName}</span>
              {currentUserEmail && (
                <>
                  {" "}
                  · <span className="text-slate-500">{currentUserEmail}</span>
                </>
              )}
            </p>
          </div>

          {/* Навигация по вкладкам */}
          <div className="mb-5 border-b border-slate-200">
            <div className="flex flex-wrap gap-2 text-[12px] md:text-[13px]">
              <AccountTabButton
                tab="consultations"
                current={tab}
                setTab={setTab}
              >
                Консультации
              </AccountTabButton>
              <AccountTabButton tab="pets" current={tab} setTab={setTab}>
                Питомцы
              </AccountTabButton>
              <AccountTabButton tab="trusted" current={tab} setTab={setTab}>
                Доверенные лица
              </AccountTabButton>
              <AccountTabButton
                tab="notifications"
                current={tab}
                setTab={setTab}
              >
                Уведомления
              </AccountTabButton>
              <AccountTabButton tab="profile" current={tab} setTab={setTab}>
                Профиль
              </AccountTabButton>
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="space-y-4 md:space-y-5">
            {tab === "consultations" && <ConsultationsSection />}
            {tab === "pets" && <PetsSection />}
            {tab === "trusted" && (
              <TrustedSection
                currentUserName={currentUserName}
                trustedPeople={mockTrustedPeople}
                trustedForMe={mockTrustedForMe}
              />
            )}
            {tab === "notifications" && (
              <NotificationsSection settings={mockNotificationSettings} />
            )}
            {tab === "profile" && (
              <ProfileSection
                currentUserName={currentUserName}
                currentUserEmail={currentUserEmail}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ---- дальше — твои уже существующие компоненты вкладок (ConsultationsSection, PetsSection, etc.)
// Я их не переписывал, логика осталась той же, что ты скидывал.
// Вставляешь их ниже, как у тебя сейчас, без изменений, кроме уже сделанного вверху.
