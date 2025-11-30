// lib/db.ts
//
// ВРЕМЕННЫЙ слой "БД в памяти" для прототипа.
// В будущем нужно будет заменить на работу с Postgres/Yandex Cloud,
// но интерфейс функций (getUserByPhone, getUserByEmail, createUser) останется тем же.

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

// in-memory store — живёт, пока работает сервер процесса
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

function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  return email.trim().toLowerCase() || null;
}

// простой id для прототипа (в будущем UUID из БД)
function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// === Функции для работы с пользователями ===

// Найти пользователя по телефону
export async function getUserByPhone(phone: string): Promise<User | null> {
  const norm = normalizePhone(phone);
  const found = users.find((u) => u.phone === norm);
  return found ?? null;
}

// Найти пользователя по email
export async function getUserByEmail(email: string): Promise<User | null> {
  const norm = normalizeEmail(email);
  if (!norm) return null;
  const found = users.find(
    (u) => u.email && u.email.toLowerCase() === norm
  );
  return found ?? null;
}

// 🔹 Найти пользователя по id (пригодится, когда будем линковать с Vetmanager)
export async function getUserById(id: string): Promise<User | null> {
  const found = users.find((u) => u.id === id);
  return found ?? null;
}

// Создать пользователя
export async function createUser(opts: {
  phone: string;
  email: string;
  password_hash: string;
  full_name?: string;
  telegram?: string;
  role?: UserRole;
}): Promise<User> {
  const now = new Date().toISOString();
  const normPhone = normalizePhone(opts.phone);
  const normEmail = normalizeEmail(opts.email);

  // защита от дублей по телефону
  if (users.some((u) => u.phone === normPhone)) {
    const err = new Error("USER_DUPLICATE_PHONE");
    throw err;
  }

  // защита от дублей по email
  if (
    normEmail &&
    users.some((u) => u.email && u.email.toLowerCase() === normEmail)
  ) {
    const err = new Error("USER_DUPLICATE_EMAIL");
    throw err;
  }

  const user: User = {
    id: genId(),
    phone: normPhone,
    email: normEmail,
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

// 🔹 Привязать пользователя к клиенту Vetmanager
export async function setUserVetmanagerClientId(
  userId: string,
  vmClientId: number
): Promise<User | null> {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  user.vetmanager_client_id = vmClientId;
  user.updated_at = new Date().toISOString();
  return user;
}
