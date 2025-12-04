"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
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
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/60 bg-[#101827]/95 backdrop-blur">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Логотип слева */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-onlyvet-teal to-onlyvet-coral flex items-center justify-center text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
            O
          </div>
          <div className="leading-tight">
            <div className="tracking-[0.18em] text-[10px] text-slate-300 uppercase">
              OnlyVet
            </div>
            <div className="text-[11px] text-slate-400">
              Ветеринарная онлайн-клиника
            </div>
          </div>
        </Link>

        {/* Навигация + кнопки */}
        <nav className="flex items-center gap-4">
          <ul className="hidden md:flex items-center gap-4 lg:gap-5 text-[13px]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isHowItWorks = link.href === "/how-it-works";

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      relative inline-flex flex-col items-center
                      ${
                        active
                          ? "text-white font-semibold"
                          : "text-slate-300 hover:text-slate-100"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block
                        ${isHowItWorks ? "whitespace-nowrap" : ""}
                      `}
                    >
                      {link.label}
                    </span>
                    {active && (
                      <span
                        className={`
                          mt-1 h-[2px] w-full rounded-full
                          bg-gradient-to-r from-onlyvet-teal via-onlyvet-coral to-onlyvet-teal
                        `}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Кнопки справа */}
          <div className="flex items-center gap-2">
            <Link
              href="/booking"
              className="
                hidden sm:inline-flex items-center justify-center
                px-4 py-2 rounded-full text-[13px] font-medium
                bg-onlyvet-coral text-white
                shadow-[0_10px_26px_rgba(247,118,92,0.55)]
                hover:brightness-105 transition
              "
            >
              Записаться
            </Link>
            <Link
              href="/auth/login"
              className="
                inline-flex items-center justify-center
                px-4 py-2 rounded-full text-[13px]
                border border-slate-500 text-slate-100
                hover:bg-slate-800/70 transition
              "
            >
              Войти
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
