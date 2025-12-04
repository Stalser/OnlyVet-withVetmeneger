"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseClient();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем сессию
  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!ignore) {
        setSession(data.session);
        setLoading(false);
      }
    };

    checkSession();

    // Подписка на изменения сессии (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      ignore = true;
      sub?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/70 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="text-onlyvet-navy font-semibold text-lg">
          ONLYVET
        </Link>

        {/* Меню */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link href="/">Главная</Link>
          <Link href="/doctors">Врачи</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/pricing">Цены</Link>
          <Link href="/reviews">Отзывы</Link>
          <Link href="/how-it-works">Как это работает</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/docs">Документы</Link>
        </nav>

        {/* Правый блок: кнопки авторизации */}
        {!loading && (
          <div className="flex items-center gap-3">
            {!session ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-md hover:brightness-105 transition"
                >
                  Зарегистрироваться
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account"
                  className={`px-4 py-1.5 rounded-full ${
                    pathname.startsWith("/account")
                      ? "bg-onlyvet-coral text-white shadow"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  } transition`}
                >
                  Личный кабинет
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
