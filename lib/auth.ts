// lib/auth.ts
//
// ВРЕМЕННЫЙ, НЕБЕЗОПАСНЫЙ вариант для прототипа.
// НИКОГДА не используй это в реальном продакшне.
// Когда будете подключать настоящую БД и авторизацию,
// сюда нужно будет вернуть bcrypt или другой надёжный хэш.

export async function hashPassword(password: string): Promise<string> {
  // В демо-режиме просто возвращаем пароль как "хэш".
  // (Так делать нельзя в реальном проекте!)
  return password;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // В демо считаем, что "хэш" — это сам пароль.
  return password === hash;
}

export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) return false;
  return true;
}
