// lib/db.ts
//
// ВРЕМЕННЫЙ слой "БД в памяти" для прототипа.
// В будущем этот файл нужно будет заменить на реальную работу с Postgres/Yandex Cloud,
// но интерфейс функций (getUserByPhone, createUser) можно сохранить прежним.

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  password_hash: string;
  full_name?: string | null;
  telegram?: string | null;
  role: UserRole;
  vetmanager_client_id?: number | null;
  created_at: string;
  updated_at: string;
}

// in-memory store — живёт, пока работает сервер
const users: User[] = [];

// Нормализация телефона: убираем всё, кроме цифр, приводим к виду 7XXXXXXXXXX
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("8") && digits.length === 11) {
    return "7" + digits.slice(1);
  }
  if (digits.length === 10) {
    return "7" + digits;
  }
  return digits;
}

// Сгенерировать простой id (пока вместо uuid)
function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Найти пользователя по телефону
export async function getUserByPhone(phone: string): Promise<User | null> {
  const norm = normalizePhone(phone);
  const found = users.find((u) => u.phone === norm);
  return found ?? null;
}

// Создать пользователя
export async function createUser(opts: {
  phone: string;
  email?: string;
  password_hash: string;
  full_name?: string;
  telegram?: string;
  role?: UserRole;
}): Promise<User> {
  const now = new Date().toISOString();
  const norm = normalizePhone(opts.phone);

  // защита от дублей
  if (users.some((u) => u.phone === norm)) {
    const err = new Error("USER_DUPLICATE_PHONE");
    throw err;
  }

  const user: User = {
    id: genId(),
    phone: norm,
    email: opts.email ?? null,
    password_hash: opts.password_hash,
    full_name: opts.full_name ?? null,
    telegram: opts.telegram ?? null,
    role: opts.role ?? "user",
    vetmanager_client_id: null,
    created_at: now,
    updated_at: now,
  };

  users.push(user);
  return user;
}

// На будущее: сюда же можно будет добавить методы для обновления профиля,
// поиска по id и т.д.
