// lib/db.ts
//
// Это абстракция над БД. Сейчас — мок на массивах.
// Потом здесь нужно будет сделать реальную реализацию поверх Postgres / Supabase.

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

// ВРЕМЕННО: in-memory store
const users: User[] = [];

// Нормализация телефона (удаляем лишние символы)
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

// === Функции для работы с пользователями ===

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

  // Проверка дублей
  if (users.some((u) => u.phone === norm)) {
    throw new Error("USER_DUPLICATE_PHONE");
  }

  const user: User = {
    id: crypto.randomUUID(),
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

// TODO: заменить эти функции на реальные запросы к Postgres,
// когда подключим настоящую БД (например, через Prisma / Supabase client).
