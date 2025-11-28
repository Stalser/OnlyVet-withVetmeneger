// app/api/booking/mockStore.ts
//
// Временное хранилище заявок в памяти — для прототипа.
// Потом это заменится на нормальную БД (Postgres / Supabase).

import type { BookingRequest } from "@/lib/types";

export const mockBookings: BookingRequest[] = [];

// Утилита для поиска заявки по id
export function findBookingById(id: string): BookingRequest | undefined {
  return mockBookings.find((b) => b.id === id);
}
