// lib/mockUsers.ts
//
// Временное in-memory хранилище пользователей — как mockBookings.
// При перезапуске деплоя данные обнуляются. Потом это место
// можно заменить на Supabase или свою БД в Yandex Cloud.

export type MockUser = {
  id: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  noMiddleName: boolean;
  phone: string;
  email: string;
  password: string; // ВНИМАНИЕ: в демо храним открытым текстом
};

export const mockUsers: MockUser[] = [];

// Нормализация телефона/email для поиска
function normalizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

export function findUserByPhoneOrEmail(identifier: string): MockUser | undefined {
  const norm = normalizeIdentifier(identifier);
  return mockUsers.find((u) => {
    const phoneNorm = normalizeIdentifier(u.phone);
    const emailNorm = normalizeIdentifier(u.email);
    return phoneNorm === norm || emailNorm === norm;
  });
}

export function createMockUser(data: Omit<MockUser, "id">): MockUser {
  const id = `u_${Math.random().toString(36).slice(2, 10)}`;
  const user: MockUser = { id, ...data };
  mockUsers.push(user);
  return user;
}
