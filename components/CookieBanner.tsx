"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "onlyvet_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // если localStorage недоступен — просто не показываем баннер
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto max-w-5xl w-full bg-slate-900/95 text-slate-100 border border-slate-700 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.7)]">
        <div className="text-[11px] sm:text-[12px] leading-snug">
          <div className="font-semibold text-[12px] mb-0.5">
            Мы используем cookies
          </div>
          <p>
            OnlyVet использует файлы cookies для корректной работы сайта,
            сохранения настроек и анализа посещаемости. Продолжая пользоваться
            сайтом, вы соглашаетесь с{" "}
            <Link
              href="/docs/privacy"
              className="text-onlyvet-teal hover:underline underline-offset-2"
            >
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-row sm:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={accept}
            className="
              px-4 py-1.5 rounded-full 
              bg-onlyvet-coral text-white text-[11px] font-medium
              shadow-[0_10px_26px_rgba(247,118,92,0.6)]
              hover:brightness-105 transition
            "
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
