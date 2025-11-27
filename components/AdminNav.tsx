// components/AdminNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/reviews", label: "Отзывы (модерация)" },
  { href: "/admin/requests", label: "Заявки" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-full border border-slate-200 shadow-soft px-2 py-1 inline-flex flex-wrap gap-1 text-[12px]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "px-3 py-1.5 rounded-full transition " +
              (active
                ? "bg-onlyvet-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
