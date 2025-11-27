"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "onlyvet_cookies_accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = window.localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-3">
      <div className="max-w-5xl w-full bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.7)]">
        <div className="text-[12px] md:text-[13px]">
          Мы используем cookies, чтобы сайт работал стабильно и показывал
          актуальную информацию. Продолжая использовать сайт, вы соглашаетесь с{" "}
          <a href="/docs/cookies" className="text-onlyvet-teal underline">
            политикой cookies
          </a>
          .
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={accept}
            className="px-4 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] font-medium"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
