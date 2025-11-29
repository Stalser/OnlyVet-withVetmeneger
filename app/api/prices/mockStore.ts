// app/api/prices/mockStore.ts

import { randomUUID } from "crypto";

export type PriceKind = "main" | "extra";

export type PriceItem = {
  id: string;
  kind: PriceKind;          // "main" — основная услуга, "extra" — доп.рекомендации
  name: string;
  shortDescription?: string;
  priceLabel: string;       // строка, например "от 2 500 ₽"
  isActive: boolean;
  sortOrder: number;
};

// Временный прайс (как в БД, но в памяти)
export const mockPrices: PriceItem[] = [
  {
    id: "main-consult",
    kind: "main",
    name: "Онлайн-консультация",
    shortDescription: "Первичный разбор ситуации, анализы, рекомендации.",
    priceLabel: "от 2 500 ₽",
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "main-second-opinion",
    kind: "main",
    name: "Второе мнение",
    shortDescription:
      "Анализ уже поставленного диагноза и назначений, помощь с выбором тактики.",
    priceLabel: "от 3 000 ₽",
    isActive: true,
    sortOrder: 20,
  },
  {
    id: "main-lab-review",
    kind: "main",
    name: "Разбор анализов и УЗИ",
    shortDescription:
      "Подробная интерпретация лабораторных показателей и визуальных исследований.",
    priceLabel: "от 1 800 ₽",
    isActive: true,
    sortOrder: 30,
  },
  {
    id: "main-follow-up",
    kind: "main",
    name: "Контрольная консультация",
    shortDescription:
      "Повторный онлайн-приём по уже известному пациенту для оценки динамики.",
    priceLabel: "от 1 500 ₽",
    isActive: true,
    sortOrder: 40,
  },
  // Доп. рекомендации
  {
    id: "extra-written-summary",
    kind: "extra",
    name: "Письменное заключение",
    shortDescription: "Краткое письменное резюме рекомендаций после приёма.",
    priceLabel: "от 1 000 ₽",
    isActive: true,
    sortOrder: 110,
  },
  {
    id: "extra-long-term-support",
    kind: "extra",
    name: "Долгосрочное сопровождение",
    shortDescription:
      "План наблюдения и поддержка для хронических пациентов (условия обсуждаются индивидуально).",
    priceLabel: "по запросу",
    isActive: true,
    sortOrder: 120,
  },
  {
    id: "extra-additional-review",
    kind: "extra",
    name: "Дополнительный разбор анализов",
    shortDescription:
      "Повторный разбор новых исследований в рамках текущего случая.",
    priceLabel: "от 1 000 ₽",
    isActive: true,
    sortOrder: 130,
  },
];

// утилита создания новой позиции
export function createPriceItem(partial?: Partial<PriceItem>): PriceItem {
  return {
    id: partial?.id ?? randomUUID(),
    kind: partial?.kind ?? "main",
    name: partial?.name ?? "Новая услуга",
    shortDescription: partial?.shortDescription ?? "",
    priceLabel: partial?.priceLabel ?? "по запросу",
    isActive: partial?.isActive ?? true,
    sortOrder: partial?.sortOrder ?? Date.now(),
  };
}
