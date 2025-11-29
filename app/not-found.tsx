// app/not-found.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-12">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-900 text-slate-100 text-[11px] uppercase tracking-[0.16em] mb-2">
              404 · страница не найдена
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Кажется, здесь ничего нет
            </h1>
            <p className="text-[13px] text-slate-600 max-w-md mx-auto">
              Возможно, страница была перемещена, удалена или вы ошиблись при
              вводе адреса. Вы можете вернуться на главную или перейти к
              разделам сайта, с которых удобнее начинать.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft px-5 py-4 md:px-6 md:py-5 text-[13px] text-slate-700 max-w-xl w-full">
            <p className="mb-2">
              Если вы пытались открыть ссылку на врача, услугу или отзыв —
              попробуйте воспользоваться основными разделами:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
              >
                На главную
              </Link>
              <Link
                href="/booking"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] text-onlyvet-navy hover:bg-slate-50 transition"
              >
                Записаться на консультацию
              </Link>
              <Link
                href="/services"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] text-onlyvet-navy hover:bg-slate-50 transition"
              >
                Все услуги
              </Link>
              <Link
                href="/doctors"
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] text-onlyvet-navy hover:bg-slate-50 transition"
              >
                Все врачи
              </Link>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 max-w-md">
            Если вы уверены, что ссылка должна работать, вы можете сообщить об
            этом администратору, когда появится общий контакт сервиса или
            отдельный раздел поддержки.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
