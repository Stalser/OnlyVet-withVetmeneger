// lib/auth.ts
//
// Вспомогательные функции для работы с паролями.
// Требуется установить bcryptjs:
//   npm install bcryptjs
//

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Хэш пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Проверка пароля
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Простая проверка "сложности" пароля (на фронте и на бэке)
export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) return false;
  // можно усилить: буквы верх/низ, цифры, символы
  return true;
}
