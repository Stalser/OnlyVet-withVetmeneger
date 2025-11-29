// app/admin/prices/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminNav } from "@/components/AdminNav";

type PriceKind = "main" | "extra";

type PriceItem = {
  id: string;
  kind: PriceKind;
  name: string;
  shortDescription?: string;
  priceLabel: string;
  isActive: boolean;
  sortOrder: number;
};

export default function AdminPricesPage() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creatingKind, setCreatingKind] = useState<PriceKind>("main");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/prices", { cache: "no-store" });
      if (!res.ok) throw new Error("Не удалось загрузить прайс");
      const data = await res.json();
      setItems(data.prices || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка загрузки прайса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFieldChange = (
    id: string,
    field: keyof PriceItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveItem = async (item: PriceItem) => {
    try {
      setSavingId(item.id);
      const res = await fetch(`/api/prices/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          shortDescription: item.shortDescription,
          priceLabel: item.priceLabel,
          isActive: item.isActive,
          kind: item.kind,
        }),
      });
      if (!res.ok) throw new Error("Не удалось сохранить позицию");
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка сохранения");
    } finally {
      setSavingId(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Удалить эту позицию прайса?")) return;
    try {
      const res = await fetch(`/api/prices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Не удалось удалить позицию");
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка удаления");
    }
  };

  const createItem = async () => {
    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: creatingKind,
          name:
            creatingKind === "main"
              ? "Новая основная услуга"
              : "Новая доп.услуга",
          priceLabel: "по запросу",
        }),
      });
      if (!res.ok) throw new Error("Не удалось создать позицию");
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка создания позиции");
    }
  };

  const main = items.filter((i) => i.kind === "main");
  const extra = items.filter((i) => i.kind === "extra");

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Хлебные крошки / заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-onlyvet-coral">
                Админ-панель
              </Link>{" "}
              / <span className="text-slate-700">Прайс</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Прайс онлайн-клиники OnlyVet
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl leading-relaxed">
                  Здесь можно управлять списком основных услуг и дополнительных
                  рекомендаций. Сейчас данные хранятся в памяти сервера
                  (mock-режим) и будут сбрасываться при перезапуске деплоя.
                </p>
              </div>
              <AdminNav />
            </div>
          </div>

          {loading && (
            <div className="text-[13px] text-slate-500">Загрузка прайса…</div>
          )}
          {error && (
            <div className="text-[13px] text-rose-600">{error}</div>
          )}

          {/* Основные услуги */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">
                Основные услуги
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCreatingKind("main");
                  createItem();
                }}
                className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] shadow-[0_10px_20px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Добавить услугу
              </button>
            </div>

            <div className="space-y-2">
              {main.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleFieldChange(item.id, "name", e.target.value)
                        }
                        className="w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      />
                      <textarea
                        value={item.shortDescription || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "shortDescription",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full text-[12px] text-slate-700 rounded-xl border border-slate-300 px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                        placeholder="Краткое описание услуги"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                      <input
                        type="text"
                        value={item.priceLabel}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "priceLabel",
                            e.target.value
                          )
                        }
                        className="w-full text-[13px] font-semibold text-onlyvet-navy rounded-xl border border-slate-300 px-3 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      />
                      <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "isActive",
                              e.target.checked
                            )
                          }
                          className="rounded border-slate-300"
                        />
                        <span>Показывать в прайсе</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-[12px]">
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                    >
                      Удалить
                    </button>
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="px-3 py-1.5 rounded-full bg-onlyvet-teal text-white hover:brightness-105 transition disabled:opacity-60"
                    >
                      {savingId === item.id ? "Сохраняем…" : "Сохранить"}
                    </button>
                  </div>
                </div>
              ))}
              {main.length === 0 && !loading && (
                <div className="text-[13px] text-slate-500">
                  Основные услуги ещё не добавлены.
                </div>
              )}
            </div>
          </section>

          {/* Дополнительные услуги */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">
                Дополнительные услуги и рекомендации
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCreatingKind("extra");
                  createItem();
                }}
                className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white text-[12px] shadow-[0_10px_20px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
              >
                Добавить доп.услугу
              </button>
            </div>

            <div className="space-y-2">
              {extra.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 space-y-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleFieldChange(item.id, "name", e.target.value)
                        }
                        className="w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      />
                      <textarea
                        value={item.shortDescription || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "shortDescription",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full text-[12px] text-slate-700 rounded-xl border border-slate-300 px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                        placeholder="Пояснение, в каких случаях эта услуга может быть предложена"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                      <input
                        type="text"
                        value={item.priceLabel}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "priceLabel",
                            e.target.value
                          )
                        }
                        className="w-full text-[13px] font-semibold text-onlyvet-navy rounded-xl border border-slate-300 px-3 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
                      />
                      <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "isActive",
                              e.target.checked
                            )
                          }
                          className="rounded border-slate-300"
                        />
                        <span>Показывать в прайсе</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-[12px]">
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                    >
                      Удалить
                    </button>
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="px-3 py-1.5 rounded-full bg-onlyvet-teal text-white hover:brightness-105 transition disabled:opacity-60"
                    >
                      {savingId === item.id ? "Сохраняем…" : "Сохранить"}
                    </button>
                  </div>
                </div>
              ))}
              {extra.length === 0 && !loading && (
                <div className="text-[13px] text-slate-500">
                  Дополнительные услуги ещё не добавлены.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
