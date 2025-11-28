// lib/auth.ts
//
// ВРЕМЕННЫЙ, НЕБЕЗОПАСНЫЙ вариант для прототипа.
// НИКОГДА не используй это в реальном продакшне.
// Когда будете подключать настоящую БД и авторизацию,
// сюда нужно будет вернуть bcrypt или другой надёжный хэш.

export async function hashPassword(password: string): Promise<string> {
  return password; // временно
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return password === hash;
}

export function isPasswordStrong(password: string): boolean {
  return password.length >= 8;
}
}
