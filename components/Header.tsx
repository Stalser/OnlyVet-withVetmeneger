"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Header() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Проверка сессии при загрузке шапки
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase.auth.getUser();

      if (!cancelled) {
        setUser(data.user || null);
        setLoading(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <header className="border-b border-slate-200 bg-[#0f172a] text-white">
      <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

        {/* ЛОГО */}
        <Link href="/" className="text-lg font-semibold">
          ONLYVET
        </Link>

        {/* НАВИГАЦИЯ */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-onlyvet-coral">Главная</Link>
          <Link href="/vets" className="hover:text-onlyvet-coral">Врачи</Link>
          <Link href="/services" className="hover:text-onlyvet-coral">Услуги</Link>
          <Link href="/reviews" className="hover:text-onlyvet-coral">Отзывы</Link>
          <Link href="/how-it-works" className="hover:text-onlyvet-coral">Как работает</Link>
          <Link href="/faq" className="hover:text-onlyvet-coral">FAQ</Link>
          <Link href="/docs" className="hover:text-onlyvet-coral">Документы</Link>
        </nav>

        {/* ПРАВАЯ ЧАСТЬ — вход/кабинет */}
        <div className="flex items-center gap-3">

          {!loading && user && (
            <>
              <Link
                href="/account"
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow hover:brightness-110 transition"
              >
                Личный кабинет
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-slate-300 text-white hover:bg-slate-700 transition"
              >
                Выйти
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link
                href="/booking"
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white shadow hover:brightness-110 transition"
              >
                Записаться
              </Link>

              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full border border-slate-300 text-white hover:bg-slate-700 transition"
              >
                Войти
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
