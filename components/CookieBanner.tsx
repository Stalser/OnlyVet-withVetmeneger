// components/CookieBanner.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "onlyvet_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted") {
        setVisible(true);
      }
    } catch {
      // если localStorage недоступен — просто покажем баннер
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // игнорируем ошибки storage
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div
        className="
          mx-auto max-w-5xl
          bg-slate-900/95 text-slate-100
          border border-slate-700
          rounded-2xl
          px-4 py-3
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-3
          text-[12px]
          shadow-[0_18px_50px_rgba(15,23,42,0.75)]
        "
      >
        <div className="space-y-1">
          <div className="font-semibold text-[13px]">
            Мы используем файлы cookie
          </div>
          <p className="text-[12px] text-slate-300">
            Это помогает корректно работать сайту и улучшать сервис: анализировать
            обращения, анонимную статистику и ошибки. Подробности —
            в{" "}
            <Link
              href="/docs/privacy"
              className="text-onlyvet-teal hover:underline underline-offset-2"
            >
              политике обработки данных
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={accept}
            className="
              px-4 py-1.5 rounded-full
              bg-onlyvet-coral text-white
              text-[12px] font-medium
              shadow-[0_10px_26px_rgba(247,118,92,0.55)]
              hover:brightness-105
              transition
            "
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
