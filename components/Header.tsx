"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Тип сессии
type SupabaseSession = {
  user: any;
} | null;

const navItems = [
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
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Проверка сессии + подписка на изменения
  useEffect(() => {
    const supabase = getSupabaseClient();
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setSession(data.session ?? null);
        setCheckingAuth(false);
      }
    };

    check();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!cancelled) setSession(newSession ?? null);
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
    router.push("/auth/login");
  };

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="w-full border-b border-slate-900/15 bg-[#050816] text-white">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">

        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-coral 
            flex items-center justify-center text-[13px] font-bold">
            OV
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-wide">
              ONLYVET
            </span>
            <span className="text-[11px] text-slate-400">
              Ветеринарная онлайн-клиника
            </span>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-4 text-[13px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${
                isActive(item.href)
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Правый блок (login/account/logout) */}
        <div className="flex items-center gap-2 text-[13px]">
          <Link
            href="/booking"
            className="px-4 py-1.5 rounded-full bg-onlyvet-coral text-white font-medium 
            shadow-[0_10px_26px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
          >
            Записаться
          </Link>

          {checkingAuth ? (
            // Пока загружаем — показываем нейтральный вариант
            <Link
              href="/auth/login"
              className="px-4 py-1.5 rounded-full border border-slate-500 text-slate-100 
              hover:bg-slate-800/60 transition"
            >
              Войти
            </Link>
          ) : session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className={`px-4 py-1.5 rounded-full border border-slate-500 text-slate-100 transition ${
                  pathname?.startsWith("/account")
                    ? "bg-slate-800/80"
                    : "hover:bg-slate-800/60"
                }`}
              >
                Личный кабинет
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full border border-slate-600 
                text-[12px] text-slate-200 hover:bg-slate-800/60 transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-1.5 rounded-full border border-slate-500 text-slate-100 
              hover:bg-slate-800/60 transition"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
