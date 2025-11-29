// app/admin/sync/services/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";
import { services, type Service } from "@/data/services";

// Тип “удалённой” услуги (Vetmanager) — пока мок, потом заменим на реальные данные
type RemoteService = {
  vmId: string;
  name: string;
  priceLabel: string;
  category?: string;
};

// ⚠️ Моковые данные Vetmanager.
// Сейчас просто копируем услуги с сайта, но логика уже под VM: работаем через vmId.
const remoteServicesMock: RemoteService[] = services.map((s) => ({
  vmId: s.vmId ?? `VM-S-${s.id}`,
  name: s.name,
  priceLabel: s.priceLabel,
  category: s.category,
}));

// Ключ для сопоставления — в первую очередь vmId, если есть.
function getKeyFromSiteService(s: Service): string {
  return (s.vmId || s.id).toString();
}

function getKeyFromRemoteService(s: RemoteService): string {
  return s.vmId.toString();
}

export default function AdminSyncServicesPage() {
  const siteByKey = useMemo(() => {
    const map = new Map<string, Service>();
    for (const s of services) {
      map.set(getKeyFromSiteService(s), s);
    }
    return map;
  }, []);

  const remoteByKey = useMemo(() => {
    const map = new Map<string, RemoteService>();
    for (const s of remoteServicesMock) {
      map.set(getKeyFromRemoteService(s), s);
    }
    return map;
  }, []);

  const {
    onlySite,
    onlyRemote,
    both,
  }: {
    onlySite: Service[];
    onlyRemote: RemoteService[];
    both: { site: Service; remote: RemoteService; changed: boolean }[];
  } = useMemo(() => {
    const onlySite: Service[] = [];
    const onlyRemote: RemoteService[] = [];
    const both: {
      site: Service;
      remote: RemoteService;
      changed: boolean;
    }[] = [];

    // Сравниваем по vmId/id
    for (const s of services) {
      const key = getKeyFromSiteService(s);
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

    // Ищем услуги, которые есть только в VM
    for (const r of remoteServicesMock) {
      const key = getKeyFromRemoteService(r);
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
          {/* Хлебные крошки / заголовок */}
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
                  Здесь отображается разница между услугами на сайте и
                  (пока моковым) списком услуг из Vetmanager. В будущем
                  здесь будут реальные данные: администратор сможет
                  принимать решения, какие услуги выводить на сайт и
                  как отображать их цену.
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
                Требуют проверки (цена/название)
              </div>
              <div className="text-[22px] font-semibold text-onlyvet-navy">
                {both.filter((b) => b.changed).length}
              </div>
            </div>
          </section>

          {/* Совпадающие услуги */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Совпадающие услуги (по vmId / id)
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
                        Категория: {site.category} · ID: {site.id} · vmId:{" "}
                        {site.vmId ?? "—"}
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
                      {/* TODO: реальные действия после подключения API Vetmanager */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        Обновить с данными Vetmanager (будет позже)
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
                      Данные совпадают (по названию и цене).
                    </div>
                  )}
                </div>
              ))}
              {both.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-slate-500">
                  Совпадающих услуг пока нет (по vmId / id).
                </div>
              )}
            </div>
          </section>

          {/* Только в Vetmanager */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Услуги только в Vetmanager (мок)
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь будут услуги, которые завели в Vetmanager, но ещё не
              оформили на сайте. Из этого списка можно будет создавать
              “витринные” услуги: добавлять описания, категорию, теги.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlyRemote.map((item) => (
                <div key={item.vmId} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    vmId: {item.vmId} · Цена: {item.priceLabel}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-onlyvet-teal bg-white text-onlyvet-teal hover:bg-teal-50 transition"
                    >
                      Создать услугу на сайте (будет позже)
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

          {/* Только на сайте */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold">
              Услуги только на сайте
            </h2>
            <p className="text-[13px] text-slate-600">
              Здесь — витринные услуги, у которых пока нет связки с
              Vetmanager по vmId. Это может быть маркетинговый формат
              (пакет нескольких внутренних услуг) или временная карточка.
            </p>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 text-[13px]">
              {onlySite.map((item) => (
                <div key={item.id} className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    Категория: {item.category} · Цена: {item.priceLabel} · vmId:{" "}
                    {item.vmId ?? "не привязан"}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                    >
                      Пометить как “только витрина”
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
                  Пока нет услуг, которые есть только на сайте.
                </div>
              )}
            </div>
          </section>

          {/* Пояснение */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Что будет, когда подключим реальный Vetmanager
            </div>
            <p>
              Сейчас используется мок-список услуг Vetmanager, чтобы отработать
              логику сравнения и интерфейс. После подключения реального API
              вместо <code>remoteServicesMock</code> будут подставляться живые
              данные из Vetmanager, а кнопки “Обновить”, “Создать услугу” и т.п.
              будут выполнять реальные действия — всегда с вашего одобрения.
            </p>
            <p>
              Главный принцип: Vetmanager — источник данных, сайт — витрина.
              Сайт не меняется автоматически — администратор всегда принимает
              решение, что и как показывать клиентам.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
