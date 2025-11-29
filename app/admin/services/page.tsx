// app/admin/services/page.tsx
"use client";

import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { services, type Service } from "@/data/services";
import { doctors } from "@/data/doctors";

function getSpecializationLabel(spec: string): string {
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

function getDoctorsForService(service: Service) {
  // сейчас — по specializations (логика, которой мы уже пользуемся)
  return doctors.filter((d) =>
    service.specializations.includes(d.specialization)
  );
}

export default function AdminServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки / заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              / <span className="text-slate-700">Услуги</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Услуги OnlyVet (витрина сайта)
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь собран список услуг, которые отображаются в разделах
                  «Услуги», «Цены» и в форме записи. Vetmanager отвечает за
                  “железо” (реальные услуги и цены), сайт — за витрину: тексты,
                  описание, структуру. Сейчас данные берутся из{" "}
                  <code>data/services.ts</code>.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Краткая статистика */}
          <section className="grid gap-3 md:grid-cols-3 text-[13px]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Всего услуг на сайте
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {services.length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Консультации и второе мнение
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {
                  services.filter(
                    (s) =>
                      s.category === "консультация" ||
                      s.category === "второе мнение"
                  ).length
                }
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Диагностика / сопровождение
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {
                  services.filter(
                    (s) =>
                      s.category === "диагностика" ||
                      s.category === "сопровождение"
                  ).length
                }
              </div>
            </div>
          </section>

          {/* Таблица услуг */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">Список услуг</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="hidden md:grid md:grid-cols-[2fr,1.1fr,1.3fr,0.8fr,0.8fr] text-[11px] uppercase tracking-[0.12em] text-slate-400 border-b border-slate-100 px-4 py-2">
                <div>Услуга</div>
                <div>Категория</div>
                <div>Специализации / врачи</div>
                <div>Цена</div>
                <div>Связи</div>
              </div>

              {services.map((s) => {
                const relatedDoctors = getDoctorsForService(s);
                return (
                  <div
                    key={s.id}
                    className="border-b border-slate-100 last:border-b-0 px-4 py-3 text-[13px] flex flex-col md:grid md:grid-cols-[2fr,1.1fr,1.3fr,0.8fr,0.8fr] gap-2 md:items-center"
                  >
                    {/* Услуга */}
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-800">
                        {s.name}
                      </div>
                      {s.shortDescription && (
                        <div className="text-[12px] text-slate-600">
                          {s.shortDescription}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">
                        ID: {s.id}
                        {s.vmId && ` · vmId: ${s.vmId}`}
                      </div>
                    </div>

                    {/* Категория */}
                    <div className="text-[12px] text-slate-700">
                      {s.category === "консультация" && "Консультация"}
                      {s.category === "второе мнение" && "Второе мнение"}
                      {s.category === "диагностика" && "Диагностика"}
                      {s.category === "сопровождение" && "Сопровождение"}
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Показывать на сайте:{" "}
                        <span
                          className={
                            s.showOnSite !== false
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }
                        >
                          {s.showOnSite !== false ? "да" : "нет"}
                        </span>
                      </div>
                    </div>

                    {/* Специализации / врачи */}
                    <div className="space-y-1 text-[12px] text-slate-700">
                      <div>
                        Специализации:{" "}
                        {s.specializations
                          .map((sp) => getSpecializationLabel(sp))
                          .join(", ")}
                      </div>
                      {relatedDoctors.length > 0 ? (
                        <div className="text-[11px] text-slate-500">
                          Врачи:{" "}
                          {relatedDoctors
                            .map((d) => d.name.split(" ")[0])
                            .join(", ")}
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-600">
                          Пока нет привязанных врачей (по специализациям)
                        </div>
                      )}
                    </div>

                    {/* Цена */}
                    <div className="text-[13px] font-semibold text-onlyvet-navy">
                      {s.priceLabel}
                    </div>

                    {/* Связи / ссылки */}
                    <div className="flex flex-col gap-1 text-[11px] text-onlyvet-coral">
                      <Link
                        href={`/services/${s.id}`}
                        className="hover:underline"
                      >
                        Страница услуги →
                      </Link>
                      <Link
                        href={`/booking?serviceId=${s.id}`}
                        className="hover:underline"
                      >
                        Запись с этой услугой →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Пояснение про Vetmanager и будущее */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Как это связано с Vetmanager
            </div>
            <p>
              Сейчас услуги сайта берутся из <code>data/services.ts</code> и
              используются в разделах «Услуги», «Цены» и в форме записи.
              Vetmanager в перспективе будет основным источником истины по
              номенклатуре и ценам: сайт будет “подхватывать” изменения через
              слой синхронизации, а администратор — решать, как и что
              отображать клиентам.
            </p>
            <p>
              Поля <code>vmId</code> зарезервированы для связи с Vetmanager, а{" "}
              <code>showOnSite</code> позволит не выводить на сайт все услуги из
              CRM, а только те, которые нужны в онлайн-витрине.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
