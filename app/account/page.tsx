// app/account/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Вынесенные секции
import ConsultationsSection from "./components/ConsultationsSection";
import PetsSection from "./components/PetsSection";
import TrustedSection from "./components/TrustedSection";
import NotificationsSection from "./components/NotificationsSection";
import ProfileSection from "./components/ProfileSection";

// Моки (пока Vetmanager не подключён по этим блокам)
import {
  mockTrustedPeople,
  mockTrustedForMe,
  mockNotificationSettings,
} from "./components/mocks";

type AccountTab =
  | "consultations"
  | "pets"
  | "trusted"
  | "notifications"
  | "profile";

export default function AccountPage() {
  const router = useRouter();

  const [tab, setTab] = useState<AccountTab>("consultations");

  const [currentUserName, setCurrentUserName] =
    useState<string>("Пользователь");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // чтобы не дёргать Vetmanager init бесконечно
  const [vmInitCalled, setVmInitCalled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseClient();

    // Аккуратный INIT Vetmanager (вызывается только после успешной авторизации)
    const initVetmanagerIfNeeded = async (user: any, meta: any) => {
      if (cancelled) return;
      if (vmInitCalled) return; // на всякий случай — чтобы не дёргать повторно в рамках одной сессии
      setVmInitCalled(true);

      try {
        const email = user.email as string | null;
        const phoneRaw =
          (meta && (meta.phone_raw || meta.phone)) ??
          ""; // phone_raw мы сохраняем при регистрации

        if (!email || !phoneRaw) {
          // Без этих данных инициализация не имеет смысла
          return;
        }

        await fetch("/api/vetmanager/profile/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseUserId: user.id,
            phone: phoneRaw,
            firstName: meta.first_name || "",
            lastName: meta.last_name || "",
            email,
          }),
        });
      } catch (err) {
        // Важно: не ломаем личный кабинет, просто логируем.
        console.warn("[Vetmanager init] error:", err);
      }
    };

    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !data.user) {
        router.replace("/auth/login");
        return;
      }

      const user = data.user;
      const meta = (user.user_metadata || {}) as any;

      // ФИО для отображения
      const fullNameFromMeta =
        meta.full_name ||
        [meta.last_name, meta.first_name].filter(Boolean).join(" ");

      setCurrentUserName(
        fullNameFromMeta && fullNameFromMeta.trim().length > 0
          ? fullNameFromMeta
          : user.email || "Пользователь"
      );
      setCurrentUserEmail(user.email || "");

      // Параллельно пробуем аккуратно подтянуть Vetmanager
      initVetmanagerIfNeeded(user, meta);

      setCheckingAuth(false);
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, vmInitCalled]);

  // Пока идёт проверка сессии
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

// ============================
// Вспомогательная кнопка вкладки
// ============================
function AccountTabButton({
  tab,
  current,
  setTab,
  children,
}: {
  tab: AccountTab;
  current: AccountTab;
  setTab: (tab: AccountTab) => void;
  children: React.ReactNode;
}) {
  const isActive = tab === current;
  return (
    <button
      type="button"
      onClick={() => setTab(tab)}
      className={`
        relative px-3 py-1.5 rounded-full
        transition text-xs md:text-[13px]
        ${
          isActive
            ? "bg-white text-onlyvet-navy border border-slate-200 shadow-sm"
            : "text-slate-600 hover:text-onlyvet-navy hover:bg-white/70"
        }
      `}
    >
      {children}
    </button>
  );
}
