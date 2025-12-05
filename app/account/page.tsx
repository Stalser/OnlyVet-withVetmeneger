"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";

// импортируем вынесенные вкладки
import ConsultationsSection from "./components/ConsultationsSection";
import PetsSection from "./components/PetsSection";
import TrustedSection from "./components/TrustedSection";
import NotificationsSection from "./components/NotificationsSection";
import ProfileSection from "./components/ProfileSection";

type AccountTab =
  | "consultations"
  | "pets"
  | "trusted"
  | "notifications"
  | "profile";

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>("consultations");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !data.user) {
        router.replace("/auth/login");
        return;
      }

      setCurrentUser(data.user);
      setCheckingAuth(false);
    };

    load();
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
            <p className="text-[13px] text-slate-600">Загружаем профиль…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fullName =
    currentUser?.user_metadata?.full_name ??
    `${currentUser?.user_metadata?.last_name ?? ""} ${
      currentUser?.user_metadata?.first_name ?? ""
    }`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/60">
        <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
          {/* Заголовок */}
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
              <span className="font-medium">
                {fullName?.trim() || currentUser.email}
              </span>{" "}
              ·{" "}
              <span className="text-slate-500">
                {currentUser.email ?? "email отсутствует"}
              </span>
            </p>
          </div>

          {/* Навигация */}
          <div className="mb-5 border-b border-slate-200">
            <div className="flex flex-wrap gap-2 text-[12px] md:text-[13px]">
              {(["consultations", "pets", "trusted", "notifications", "profile"] as AccountTab[]).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-full transition ${
                      tab === t
                        ? "bg-white text-onlyvet-navy border border-slate-200 shadow-sm"
                        : "text-slate-600 hover:text-onlyvet-navy hover:bg-white/70"
                    }`}
                  >
                    {{
                      consultations: "Консультации",
                      pets: "Питомцы",
                      trusted: "Доверенные лица",
                      notifications: "Уведомления",
                      profile: "Профиль",
                    }[t]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Контент вкладки */}
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

      <Footer />
    </>
  );
}
