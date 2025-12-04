// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SupabaseSession = {
  user: {
    email?: string;
    user_metadata?: Record<string, any>;
  };
} | null;

const NAV_ITEMS = [
    { href: "/", label: "Главная" },
    { href: "/doctors", label: "Врачи" },
    { href: "/services", label: "Услуги" },
    { href: "/prices", label: "Цены" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/how-it-works", label: "Как это работает" },
    { href: "/faq", label: "FAQ" },
    { href: "/docs", label: "Документы" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<SupabaseSession>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Проверяем текущую сессию и подписываемся на изменения
  useEffect(() => {
    const supabase = getSupabaseClient();
    let cancelled = false;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setSession(data.session as any);
        setAuthLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!cancelled) {
          setSession(newSession as any);
        }
      }
    );

    return () => {
      cancelled = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setSession(null);
    setMobileOpen(false);
    router.push("/auth/login");
  };

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname?.startsWith(href)) return true;
    return false;
  };

  const displayName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.email ||
    "Аккаунт";

  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/40 bg-[#050816]/85 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 md:h-18 items-center justify-between gap-4">

          {/* ЛОГОТИП */}
          <button
            type="button"
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-coral shadow-[0_0_25px_rgba(56,189,248,0.55)] flex items-center justify-center">
                <span className="text-[14px] font-semibold tracking-[0.18em] text-white">
                  OV
                </span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-[13px] font-semibold tracking-[0.14em] uppercase text-slate-50">
                OnlyVet
              </span>
              <span className="text-[11px] text-slate-300/80">
                Ветеринарная онлайн-клиника
              </span>
            </div>
          </button>

          {/* ДЕСКТОП-НАВИГАЦИЯ */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px]">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavClick(item.href)}
                className={`
                  relative pb-1 transition
                  ${isActive(item.href)
                    ? "text-slate-50"
                    : "text-slate-300 hover:text-slate-100"}
                `}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-onlyvet-teal to-transparent" />
                )}
              </button>
            ))}
          </nav>

          {/* ПРАВЫЙ БЛОК (кнопки + аккаунт) */}
          <div className="flex items-center gap-2">

            {/* Кнопка "Записаться" — всегда */}
            <button
              type="button"
              onClick={() => handleNavClick("/booking")}
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-onlyvet-coral px-4 py-1.5 text-[13px] font-medium text-white shadow-[0_12px_28px_rgba(247,118,92,0.6)] hover:brightness-105 active:translate-y-[1px] transition"
            >
              Записаться
            </button>

            {/* Состояние авторизации */}
            {authLoading ? (
              // Лоадер состояния — небольшой скелетон
              <div className="h-8 w-24 rounded-full bg-slate-700/40 animate-pulse" />
            ) : session ? (
              // Залогиненный пользователь
              <div className="flex items-center gap-2">
                {/* Чип аккаунта */}
                <button
                  type="button"
                  onClick={() => handleNavClick("/account")}
                  className="hidden sm:flex items-center gap-2 rounded-full border border-slate-500/70 bg-slate-900/40 px-2.5 py-1.5 text-[12px] text-slate-100 hover:bg-slate-800/80 hover:border-slate-300/70 transition"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[11px] font-semibold uppercase text-slate-50">
                    {avatarLetter}
                  </span>
                  <span className="max-w-[140px] truncate" title={displayName}>
                    {displayName}
                  </span>
                </button>

                {/* Кнопка "Выйти" */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1.5 text-[12px] text-slate-200 hover:bg-slate-800/80 transition"
                >
                  Выйти
                </button>

                {/* Мобильная иконка аккаунта */}
                <button
                  type="button"
                  onClick={() => handleNavClick("/account")}
                  className="sm:hidden flex items-center justify-center rounded-full border border-slate-600 w-8 h-8 text-[12px] font-semibold"
                >
                  {avatarLetter}
                </button>
              </div>
            ) : (
              // Не залогинен
              <button
                type="button"
                onClick={() => handleNavClick("/auth/login")}
                className="inline-flex items-center justify-center rounded-full border border-slate-500 px-4 py-1.5 text-[13px] text-slate-100 hover:bg-slate-800/80 transition"
              >
                Войти
              </button>
            )}

            {/* Бургер на мобильных */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full border border-slate-700/80 p-1.5 text-slate-100 hover:bg-slate-800/80 lg:hidden"
              aria-label="Открыть меню"
            >
              <span className="flex flex-col gap-0.5">
                <span className={`h-0.5 w-4 rounded bg-slate-100 transition ${mobileOpen ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`h-0.5 w-4 rounded bg-slate-100 transition ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`h-0.5 w-4 rounded bg-slate-100 transition ${mobileOpen ? "-translate-y-1 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800/70 bg-[#050816]/95 backdrop-blur-xl">
          <div className="container mx-auto max-w-6xl px-4 py-3 space-y-3 text-[14px]">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={`
                    flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left
                    ${isActive(item.href)
                      ? "bg-slate-800/80 text-slate-50"
                      : "text-slate-200 hover:bg-slate-800/60"}
                  `}
                >
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-onlyvet-teal/90" />
                  )}
                </button>
              ))}
            </nav>

            {!authLoading && (
              <div className="pt-2 border-t border-slate-800/70 mt-2">
                {session ? (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleNavClick("/account")}
                      className="flex items-center gap-2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[13px] font-semibold">
                        {avatarLetter}
                      </span>
                      <span className="text-[13px] text-slate-100 truncate max-w-[180px]">
                        {displayName}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-[12px] text-slate-300 underline underline-offset-4"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick("/auth/login")}
                      className="flex-1 rounded-full border border-slate-600 px-3 py-1.5 text-[13px] text-slate-100 hover:bg-slate-800/70 transition"
                    >
                      Войти
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick("/booking")}
                      className="flex-1 rounded-full bg-onlyvet-coral px-3 py-1.5 text-[13px] text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
                    >
                      Записаться
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
