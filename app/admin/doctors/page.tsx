// app/admin/doctors/page.tsx
"use client";

import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { doctors, type Doctor } from "@/data/doctors";

function getSpecLabel(spec: Doctor["specialization"]): string {
  switch (spec) {
    case "терапия":
      return "Терапия";
    case "эксперт":
      return "Эксперт / сложные случаи";
    case "диагностика":
      return "Диагностика";
    case "онкология":
      return "Онкология";
    default:
      return spec;
  }
}

export default function AdminDoctorsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              / <span className="text-slate-700">Врачи</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Врачи OnlyVet (витрина сайта)
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь собраны врачи, которые используются в разделах «Врачи»,
                  форме записи и связаны с услугами. Vetmanager в перспективе
                  будет основным источником истины по персоналу, а сайт —
                  витриной: здесь можно будет управлять показом, описаниями и
                  “маркетинговым слоем”.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Статистика */}
          <section className="grid gap-3 md:grid-cols-3 text-[13px]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">Всего врачей</div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {doctors.length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Экспертные / сложные случаи
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {doctors.filter((d) => d.specialization === "эксперт").length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Терапия / диагностика / онкология
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {
                  doctors.filter(
                    (d) =>
                      d.specialization === "терапия" ||
                      d.specialization === "диагностика" ||
                      d.specialization === "онкология"
                  ).length
                }
              </div>
            </div>
          </section>

          {/* Список врачей */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">Список врачей</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              {/* Шапка таблицы на десктопе */}
              <div className="hidden md:grid md:grid-cols-[2fr,1.1fr,1.4fr,0.9fr] text-[11px] uppercase tracking-[0.12em] text-slate-400 border-b border-slate-100 px-4 py-2">
                <div>Врач</div>
                <div>Специализация</div>
                <div>Фокус / теги</div>
                <div>Связи</div>
              </div>

              {doctors.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-slate-100 last:border-b-0 px-4 py-3 text-[13px] flex flex-col md:grid md:grid-cols-[2fr,1.1fr,1.4fr,0.9fr] gap-2 md:items-center"
                >
                  {/* Врач */}
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">
                      {d.name}
                    </div>
                    <div className="text-[12px] text-slate-600">
                      {d.role}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ID: {d.id}
                      {d.vmId && ` · vmId: ${d.vmId}`}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Показывать на сайте:{" "}
                      <span
                        className={
                          d.showOnSite !== false
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }
                      >
                        {d.showOnSite !== false ? "да" : "нет"}
                      </span>
                    </div>
                  </div>

                  {/* Специализация */}
                  <div className="text-[12px] text-slate-700">
                    {getSpecLabel(d.specialization)}
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Опыт: {d.experienceLabel}
                    </div>
                  </div>

                  {/* Фокус / теги */}
                  <div className="space-y-1 text-[12px] text-slate-700">
                    <div>{d.servicesShort}</div>
                    {d.tags && d.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                        {d.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-[1px] rounded-full bg-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Связи / ссылки */}
                  <div className="flex flex-col gap-1 text-[11px] text-onlyvet-coral">
                    <Link
                      href={`/doctors/${d.id}`}
                      className="hover:underline"
                    >
                      Страница врача →
                    </Link>
                    <Link
                      href={`/booking?doctorId=${d.id}`}
                      className="hover:underline"
                    >
                      Запись к этому врачу →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Пояснение про Vetmanager */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Связь с Vetmanager
            </div>
            <p>
              Сейчас список врачей сайта хранится в <code>data/doctors.ts</code>{" "}
              и используется для раздела «Врачи», формы записи и фильтрации
              услуг. Поле <code>vmId</code> зарезервировано для связи с
              Vetmanager: когда будет подключен реальный API, сюда можно будет
              подставить ID врача из CRM и синхронизировать базовые данные
              (ФИО, статус, специализацию).
            </p>
            <p>
              Поле <code>showOnSite</code> позволит выводить на сайт не всех
              врачей из Vetmanager, а только тех, кто должен участвовать в
              онлайн-формате OnlyVet. Так сохраняется контроль витрины: CRM —
              для работы, сайт — для клиентов.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
