import "./globals.css";
import type { Metadata } from "next";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-onlyvet-bg text-slate-900">
        <div className="min-h-screen flex flex-col">{children}</div>
        <CookieBanner />
      </body>
    </html>
  );
}
