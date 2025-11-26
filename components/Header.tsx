"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 bg-onlyvet-navy text-white border-b border-slate-800">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center font-bold text-lg">
            O
          </div>
          <div className="leading-tight">
            <div className="tracking-[0.18em] text-xs font-semibold">
              ONLYVET
            </div>
            <div className="text-[11px] text-slate-300">
              Ветеринарная онлайн-клиника
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href="/"
            className={isActive("/") ? "font-medium" : "text-slate-300"}
          >
            Главная
          </Link>
          <Link
            href="/doctors"
            className={isActive("/doctors") ? "font-medium" : "text-slate-300"}
          >
            Врачи
          </Link>
          <Link
            href="/services"
            className={isActive("/services") ? "font-medium" : "text-slate-300"}
          >
            Услуги
          </Link>
          <Link
            href="/reviews"
            className={isActive("/reviews") ? "font-medium" : "text-slate-300"}
          >
            Отзывы
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button className="px-3 py-2 rounded-full border border-slate-500 text-xs">
            Войти
          </button>
          <button className="px-4 py-2 rounded-full bg-onlyvet-coral text-xs font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)]">
            Записаться
          </button>
        </div>

        {/* Мобильное меню потом сделаем отдельным компонентом */}
        <button className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-full border border-slate-600">
          <span className="w-4 h-[2px] bg-slate-100 rounded-full" />
          <span className="w-4 h-[2px] bg-slate-100 rounded-full" />
        </button>
      </div>
    </header>
  );
}
