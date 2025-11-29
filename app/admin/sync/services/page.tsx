// app/admin/sync/services/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { services } from "@/data/services";

// Тип услуги на сайте (ровно то, что у тебя уже есть в data/services)
type SiteService = (typeof services)[number];

// Тип “удалённой” услуги (Vetmanager) — пока мок, потом заменим на реальные данные
type RemoteService = {
  vmId: string;
  name: string;
  priceLabel: string;
  category?: string;
};

// ⚠️ Моковые данные Vetmanager — ЗДЕСЬ будет реальный запрос к API VM
const remoteServicesMock: RemoteService[] = services.map((s, index) => ({
  vmId: `VM-S-${index + 1}`, // временный vmId, потом будем брать реальный
  name: s.name,
  priceLabel: s.priceLabel,
  category: s.category,
}));

// На будущее: нормальная стратегия ключа – vmId, сейчас привязываемся к имени
function getKeyForSync(s: SiteService | RemoteService): string {
  return s.name.trim().toLowerCase();
}

export default function AdminSyncServicesPage() {
  // Индексы по имени для быстрого сравнения
  const siteByKey = useMemo(() => {
    const map = new Map<string, SiteService>();
    for (const s of services) {
      map.set(getKeyForSync(s), s);
    }
    return map;
  }, []);

  const remoteByKey = useMemo(() => {
    const map = new Map<string, RemoteService>();
    for (const s of remoteServicesMock) {
      map.set(getKeyForSync(s), s);
    }
    return map;
  }, []);

  const {
    onlySite,
    onlyRemote,
    both,
  }: {
    onlySite: SiteService[];
    onlyRemote: RemoteService[];
    both: { site: SiteService; remote: RemoteService; changed: boolean }[];
  } = useMemo(() => {
    const onlySite: SiteService[] = [];
    const onlyRemote: RemoteService[] = [];
    const both: { site: SiteService; remote: RemoteService; changed: boolean }[] =
      [];

    // Смотрим услуги на сайте
    for (const s of services) {
      const key = getKeyForSync(s);
      const remote = remoteByKey.get(key);
      if (!remote) {
        onlySite.push(s);
      } else {
        const changed =
          s.priceLabel.trim() !== remote.priceLabel.trim() ||
          s.name.trim() !== remote.name.trim();
        both.push({ site: s, remote, changed });
      }
    }

    // Смотрим услуги в VM, которых нет на сайте
    for (const r of remoteServicesMock) {
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
          {/* Хлебные крошки и заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              /{" "}
              <span className="text-slate-700">
                Синхронизация с Vetmanager — услуги
              </span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Синхронизация услуг с Vetmanager
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь будет отображаться разница между услугами на сайте и
                  услугами в Vetmanager. Vetmanager — главный источник данных,
                  а сайт — витрина: изменения не применяются автоматически,
                  администратор решает, что вывести наружу.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {/* Статистика */}
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
                Только в Vetmanager (мок)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {onlyRemote.length}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
              <div className="text-[12px] text-slate-500">
                Требуют проверки (совпадают по имени, но могут отличаться)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {both.filter((b) => b.changed).length}
              </div>
            </div>
          </section>

          {/* Услуги есть и там, и там */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Совпадающие услуги (сравнение сайта и Vetmanager)
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
                        Категория: {site.category} · ID на сайте: {site.id} ·
                        (vm-мок)
                      </div>
                    </div>
                    <div className="text-right text-[12px] text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Сайт:
                        </span>{" "}
                        {site.priceLabel}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          Vetmanager:
                        </span>{" "}
                        {remote.priceLabel}
                      </div>
                    </div>
                  </div>
                  {changed && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="px-2 py-[2px] rounded-full bg-amber-50 text-amber-700">
                        Требует проверки: цена или название отличаются
                      </span>
                      {/* TODO: здесь потом будут реальные кнопки действий */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        Обновить с данными Vetmanager (потом)
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                      >
                        Оставить как на сайте
                      </button>
                    </div>
                  )}
                  {!changed && (
                    <div className="text-[11px] text-emerald-600">
                      Данные совпадают (по имени и цене).
                    </div>
                  )}
                </div>
              ))}
              {both.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Совместных услуг (по имени) пока не найдено.
                </div>
              )}
            </div>
          </section>

          {/* Есть только в Vetmanager */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Услуги, которые есть только в Vetmanager (мок)
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут услуги, которые добавили в Vetmanager, но ещё не
              оформили на сайте. В будущем отсюда можно будет быстро создать
              карточку услуги на сайте.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlyRemote.map((item) => (
                <div key={item.vmId} className="px-4 py-3 flex flex-col gap-1">
                  <div className="font-semibold text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    Vetmanager, vmId: {item.vmId} · Цена: {item.priceLabel}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-onlyvet-teal bg-white text-onlyvet-teal hover:bg-teal-50 transition"
                    >
                      Создать услугу на сайте (потом)
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
                  Пока нет услуг, которые есть только в Vetmanager.
                </div>
              )}
            </div>
          </section>

          {/* Есть только на сайте */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Услуги, которые есть только на сайте
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут услуги, которые есть на сайте, но их нет в Vetmanager.
              Это может быть признаком того, что:
              <br />— услугу ещё не завели в Vetmanager, или<br />— формат на
              сайте — маркетинговый “пакет” из нескольких внутренних услуг VM.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlySite.map((item) => (
                <div key={item.id} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    Категория: {item.category} · Цена: {item.priceLabel}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                    >
                      Пометить как “только маркетинговый пакет”
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
                  Нет услуг, которые есть только на сайте.
                </div>
              )}
            </div>
          </section>

          {/* Пояснение про будущее */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Что будет дальше, когда подключим настоящий Vetmanager
            </div>
            <p>
              Сейчас используется мок-список услуг Vetmanager, чтобы отработать
              логику сравнения и интерфейс. После подключения реального API
              вместо <code>remoteServicesMock</code> будут подставляться живые
              данные из Vetmanager, а кнопки “Обновить”, “Создать услугу” и т.п.
              будут выполнять реальные действия (с учётом вашего подтверждения).
            </p>
            <p>
              Главное: Vetmanager остаётся главным источником данных, а сайт не
              меняется автоматически — администратор решает, что и как
              показывать клиентам.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
