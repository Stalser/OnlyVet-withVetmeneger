// app/admin/sync/doctors/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { doctors } from "@/data/doctors";

// Тип врача на сайте
type SiteDoctor = (typeof doctors)[number];

// Тип врача из Vetmanager (пока мок)
type RemoteDoctor = {
  vmId: string;
  fullName: string;
  specialization?: string;
  active: boolean;
};

// ⚠️ Моковые данные “врачей Vetmanager”.
// Потом здесь будет реальный вызов API Vetmanager.
const remoteDoctorsMock: RemoteDoctor[] = doctors.map((doc, idx) => ({
  vmId: `VM-D-${idx + 1}`,
  fullName: doc.name,
  specialization: (doc as any).role ?? undefined,
  active: true,
}));

// Ключ для сопоставления — пока по имени.
// В будущем заменим на vmId, когда появится реальная связка.
function getKeyForSync(d: SiteDoctor | RemoteDoctor): string {
  return ("name" in d ? d.name : d.fullName).trim().toLowerCase();
}

export default function AdminSyncDoctorsPage() {
  const siteByKey = useMemo(() => {
    const m = new Map<string, SiteDoctor>();
    for (const d of doctors) {
      m.set(getKeyForSync(d), d);
    }
    return m;
  }, []);

  const remoteByKey = useMemo(() => {
    const m = new Map<string, RemoteDoctor>();
    for (const d of remoteDoctorsMock) {
      m.set(getKeyForSync(d), d);
    }
    return m;
  }, []);

  const {
    onlySite,
    onlyRemote,
    both,
  }: {
    onlySite: SiteDoctor[];
    onlyRemote: RemoteDoctor[];
    both: { site: SiteDoctor; remote: RemoteDoctor; changed: boolean }[];
  } = useMemo(() => {
    const onlySite: SiteDoctor[] = [];
    const onlyRemote: RemoteDoctor[] = [];
    const both: { site: SiteDoctor; remote: RemoteDoctor; changed: boolean }[] =
      [];

    // Сначала — по сайту
    for (const d of doctors) {
      const key = getKeyForSync(d);
      const remote = remoteByKey.get(key);
      if (!remote) {
        onlySite.push(d);
      } else {
        const changed =
          // Пока сравниваем только “роль/специализация”
          ((d as any).role || "").trim().toLowerCase() !==
          (remote.specialization || "").trim().toLowerCase();
        both.push({ site: d, remote, changed });
      }
    }

    // Теперь — те, кто есть только в Vetmanager
    for (const r of remoteDoctorsMock) {
      const key = getKeyForSync(r);
      if (!siteByKey.has(key)) {
        onlyRemote.push(r);
      }
    }

    return { onlySite, onlyRemote, both };
  }, [siteByKey, remoteByKey]);

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
              /{" "}
              <span className="text-slate-700">
                Синхронизация с Vetmanager — врачи
              </span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Синхронизация врачей с Vetmanager
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь будет отображаться разница между врачами на сайте и
                  врачами в Vetmanager. Vetmanager — главный источник данных, а
                  сайт — витрина: изменения не применяются автоматически,
                  администратор решает, какие карточки показать клиентам.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Статистика */}
          <section className="grid gap-3 md:grid-cols-3 text-[13px]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Врачи на сайте
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {doctors.length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Только в Vetmanager (мок)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {onlyRemote.length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Требуют проверки (роль/спец. отличается)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {both.filter((b) => b.changed).length}
              </div>
            </div>
          </section>

          {/* Совпадающие по имени врачи */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Совпадающие врачи (сайт ↔ Vetmanager, по имени)
            </h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100">
              {both.map(({ site, remote, changed }) => (
                <div
                  key={site.id ?? site.name}
                  className="px-4 py-3 space-y-1 text-[13px]"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {site.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ID на сайте: {site.id ?? "—"} · (vmId: {remote.vmId})
                      </div>
                    </div>
                    <div className="text-right text-[12px] text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Сайт:
                        </span>{" "}
                        {(site as any).role ?? "—"}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          Vetmanager:
                        </span>{" "}
                        {remote.specialization ?? "—"}
                      </div>
                    </div>
                  </div>
                  {changed && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="px-2 py-[2px] rounded-full bg-amber-50 text-amber-700">
                        Требует проверки: роль/специализация отличается
                      </span>
                      {/* TODO: тут будут реальные действия при подключении VM */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        Обновить данные с Vetmanager (потом)
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                      >
                        Оставить как на сайте
                      </button>
                    </div>
                  )}
                  {!changed && (
                    <div className="text-[11px] text-emerald-600">
                      Данные совпадают (по имени и роли/спец.).
                    </div>
                  )}
                </div>
              ))}
              {both.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Совпадающих по имени врачей пока не найдено.
                </div>
              )}
            </div>
          </section>

          {/* Врачи только в Vetmanager */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Врачи, которые есть только в Vetmanager (мок)
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут врачи, которых добавили в Vetmanager, но ещё не
              оформили на сайте. В будущем отсюда можно будет быстро создать
              карточку врача на сайте, добавить фото, расширенное описание и
              настроить показ в разделах.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlyRemote.map((d) => (
                <div key={d.vmId} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {d.fullName}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    Vetmanager, vmId: {d.vmId}
                    {d.specialization && ` · Специализация: ${d.specialization}`}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-onlyvet-teal bg-white text-onlyvet-teal hover:bg-teal-50 transition"
                    >
                      Создать врача на сайте (потом)
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      Скрыть / игнорировать
                    </button>
                  </div>
                </div>
              ))}
              {onlyRemote.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Пока нет врачей, которые есть только в Vetmanager.
                </div>
              )}
            </div>
          </section>

          {/* Врачи только на сайте */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Врачи, которые есть только на сайте
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут врачи, у которых нет прямого соответствия в
              Vetmanager. Это может означать, что:
              <br />— врача ещё не завели в Vetmanager, или<br />— карточка на сайте
              нужна только для контента (например, экспертный консультант).
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlySite.map((d) => (
                <div key={d.id ?? d.name} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {d.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    {(d as any).role ?? "Роль не указана"}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                    >
                      Пометить как “только сайт/эксперт”
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      Скрыть с сайта
                    </button>
                  </div>
                </div>
              ))}
              {onlySite.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Нет врачей, которые есть только на сайте.
                </div>
              )}
            </div>
          </section>

          {/* Пояснение про будущее */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Что будет дальше, когда подключим реальный Vetmanager
            </div>
            <p>
              Сейчас используется мок-список врачей Vetmanager, чтобы отработать
              логику сравнения и интерфейс. После подключения реального API
              вместо <code>remoteDoctorsMock</code> будут подставляться живые
              данные из Vetmanager, а кнопки “Обновить данные”, “Создать врача
              на сайте” и т.п. будут выполнять реальные действия (с учётом
              вашего подтверждения).
            </p>
            <p>
              Главное: Vetmanager остаётся главным источником данных, а сайт не
              изменяется автоматически — администратор решает, что и как
              показывать клиентам. Это защищает от “убийства” сайта случайными
              правками в CRM.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
