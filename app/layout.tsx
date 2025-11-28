// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "OnlyVet — ветеринарная онлайн-клиника",
  description:
    "Онлайн-консультации, второе мнение, разбор анализов и сопровождение сложных случаев.",
};

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
