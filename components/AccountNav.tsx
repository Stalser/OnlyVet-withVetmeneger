// components/AccountNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/account", label: "Обзор" },
  { href: "/account/pets", label: "Питомцы" },
  { href: "/account/requests", label: "Консультации и заявки" },
  { href: "/account/documents", label: "Документы" },
  { href: "/account/trusted", label: "Доверенные лица" },
  { href: "/account/profile", label: "Профиль" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/account") return pathname === "/account";
  return pathname.startsWith(href);
}

export function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-full border border-slate-200 shadow-soft px-2 py-1 inline-flex flex-wrap gap-1 text-[12px]">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-full transition ${
              active
                ? "bg-onlyvet-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
