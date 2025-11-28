// components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-onlyvet-navy text-white border-b border-slate-800/80">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center font-bold text-lg">
            O
          </div>
          <div className="leading-tight">
            <div className="tracking-[0.18em] text-[11px] font-semibold uppercase">
              ONLYVET
            </div>
            <div className="text-[11px] text-slate-300">
              Ветеринарная онлайн-клиника
            </div>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href="/"
            className={cn(
              "text-slate-300 hover:text-white transition-colors",
              isActive("/") && "text-white font-medium"
            )}
          >
            Главная
          </Link>
          <Link
            href="/doctors"
            className={cn(
              "text-slate-300 hover:text-white transition-colors",
              isActive("/doctors") && "text-white font-medium"
            )}
          >
            Врачи
          </Link>
          <Link
            href="/services"
            className={cn(
              "text-slate-300 hover:text-white transition-colors",
              isActive("/services") && "text-white font-medium"
            )}
          >
            Услуги
          </Link>
          <Link
            href="/reviews"
            className={cn(
              "text-slate-300 hover:text-white transition-colors",
              isActive("/reviews") && "text-white font-medium"
            )}
          >
            Отзывы
          </Link>
          <Link
            href="/docs"
            className={cn(
              "text-slate-300 hover:text-white transition-colors",
              isActive("/docs") && "text-white font-medium"
            )}
          >
            Документы
          </Link>
        </nav>

        {/* Кнопки справа */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/login"
            className="
              px-3.5 py-2 rounded-full 
              border border-slate-500 
              text-[11px] 
              hover:bg-white/5 
              transition
              inline-flex items-center justify-center
            "
          >
            Войти
          </Link>
          <Link
            href="/booking"
            className="
              px-4 py-2 rounded-full 
              bg-onlyvet-coral 
              text-[11px] font-semibold 
              shadow-[0_10px_26px_rgba(247,118,92,0.45)]
              hover:brightness-105 
              transition
              inline-flex items-center justify-center
            "
          >
            Записаться
          </Link>
        </div>

        {/* Мобильное меню — пока заглушка */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-full border border-slate-600"
          aria-label="Меню"
        >
          <span className="w-4 h-[2px] rounded-full bg-slate-100" />
          <span className="w-4 h-[2px] rounded-full bg-slate-100" />
        </button>
      </div>
    </header>
  );
}
