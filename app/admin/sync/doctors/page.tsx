// app/admin/sync/doctors/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { doctors, type Doctor } from "@/data/doctors";

// Тип врача из Vetmanager (пока мок)
type RemoteDoctor = {
  vmId: string;
  fullName: string;
  specialization?: string;
  active: boolean;
};

// ⚠️ Мок “врачей Vetmanager”: в будущем тут будет реальный API вызов.
const remoteDoctorsMock: RemoteDoctor[] = doctors.map((doc) => ({
  vmId: doc.vmId ?? `VM-D-${doc.id}`,
  fullName: doc.name,
  specialization: doc.role,
  active: true,
}));

// Ключ — vmId, если есть, иначе имя.
function getKeyFromSiteDoctor(d: Doctor): string {
  return (d.vmId || d.name).toString().trim().toLowerCase();
}

function getKeyFromRemoteDoctor(d: RemoteDoctor): string {
  return d.vmId.toString().trim().toLowerCase();
}

export default function AdminSyncDoctorsPage() {
  const siteByKey = useMemo(() => {
    const m = new Map<string, Doctor>();
    for (const d of doctors) {
      m.set(getKeyFromSiteDoctor(d), d);
    }
    return m;
  }, []);

  const remoteByKey = useMemo(() => {
    const m = new Map<string, RemoteDoctor>();
    for (const d of remoteDoctorsMock) {
      m.set(getKeyFromRemoteDoctor(d), d);
    }
    return m;
  }, []);

  const {
    onlySite,
    onlyRemote,
    both,
  }: {
    onlySite: Doctor[];
    onlyRemote: RemoteDoctor[];
    both: { site: Doctor; remote: RemoteDoctor; changed: boolean }[];
  } = useMemo(() => {
    const onlySite: Doctor[] = [];
    const onlyRemote: RemoteDoctor[] = [];
    const both: {
      site: Doctor;
      remote: RemoteDoctor;
      changed: boolean;
    }[] = [];

    // смотрим сайт
    for (const d of doctors) {
      const key = getKeyFromSiteDoctor(d);
      const remote = remoteByKey.get(key);
      if (!remote) {
        onlySite.push(d);
      } else {
        const changed =
          (d.role || "").trim().toLowerCase() !==
          (remote.specialization || "").trim().toLowerCase();
        both.push({ site: d, remote, changed });
      }
    }

    // смотрим VM
    for (const r of remoteDoctorsMock) {
      const key = getKeyFromRemoteDoctor(r);
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
                  Эта страница показывает, какие врачи есть на сайте, какие —
                  в Vetmanager (мок-режим), и где есть расхождения. В
                  дальнейшем здесь можно будет создавать карточки врачей на
                  сайте и обновлять их данные после изменения в Vetmanager.
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
                Требуют проверки (роль/спец.)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {both.filter((b) => b.changed).length}
              </div>
            </div>
          </section>

          {/* Совпадающие врачи */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Совпадающие врачи (по vmId / имени)
            </h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100">
              {both.map(({ site, remote, changed }) => (
                <div
                  key={site.id}
                  className="px-4 py-3 space-y-1 text-[13px]"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {site.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ID на сайте: {site.id} · vmId: {site.vmId ?? "—"}
                      </div>
                    </div>
                    <div className="text-right text-[12px] text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Сайт:
                        </span>{" "}
                        {site.role}
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
                      {/* TODO: реальные действия после подключения API Vetmanager */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        Обновить данные с Vetmanager (будет позже)
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
                      Данные совпадают (роль/спец. совпадает).
                    </div>
                  )}
                </div>
              ))}
              {both.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Нет врачей с совпадающими vmId (или именами).
                </div>
              )}
            </div>
          </section>

          {/* Только в Vetmanager */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Врачи только в Vetmanager (мок)
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут врачи, которых добавили в Vetmanager, но ещё не
              оформили на сайте. Из этого списка можно будет создавать
              “витринные” карточки врачей на сайте: добавить фото, описания,
              теги.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlyRemote.map((d) => (
                <div key={d.vmId} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {d.fullName}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    vmId: {d.vmId}
                    {d.specialization && ` · Специализация: ${d.specialization}`}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-onlyvet-teал bg-white text-onlyvet-teал hover:bg-teal-50 transition"
                    >
                      Создать врача на сайте (будет позже)
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

          {/* Только на сайте */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Врачи только на сайте
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь — врачи, у которых пока нет связки с Vetmanager через vmId.
              Это может быть временный эксперт, консультант или врач, которого
              ещё не завели в CRM.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlySite.map((d) => (
                <div key={d.id} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {d.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    Роль: {d.role} · vmId: {d.vmId ?? "не привязан"}
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
                      className="px-3 py-1.5 rounded-full border border-сlate-200 bg-slate-50 hover:bg-сlate-100 transition"
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

          {/* Пояснение */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Что будет дальше, когда подключим реальный Vetmanager
            </div>
            <p>
              Сейчас используется мок-список врачей Vetmanager, чтобы отработать
              логику сравнения и интерфейс. После подключения реального API
              вместо <code>remoteDoctorsMock</code> будут подставляться живые
              данные из Vetmanager, а кнопки “Обновить данные”, “Создать врача”
              и т.п. будут выполнять реальные действия — всегда с вашего
              подтверждения.
            </p>
            <p>
              Главное: Vetmanager остаётся главным источником данных, а сайт не
              меняется автоматически. Администратор принимает решение, какую
              информацию показывать клиентам и как её оформлять.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
