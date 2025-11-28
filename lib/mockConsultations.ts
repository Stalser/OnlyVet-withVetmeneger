// lib/mockConsultations.ts
//
// Временное хранилище консультаций в памяти — для прототипа.
// Потом это заменится на нормальную БД (Postgres / Supabase).

import type { Consultation } from "@/lib/types";

export const mockConsultations: Consultation[] = [];

// найти консультацию по id
export function findConsultationById(id: string): Consultation | undefined {
  return mockConsultations.find((c) => c.id === id);
}
