// lib/auth.ts
//
// Хэширование и проверка пароля.
// Требуется: npm install bcryptjs

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Сгенерировать хэш пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Проверить пароль
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Простейшая проверка сложности пароля
export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) return false;
  // при желании можно добавить проверку на цифры/буквы/символы
  return true;
}
