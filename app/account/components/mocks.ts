// app/account/components/mocks.ts

// Базовый тип уровня доступа
type AccessLevel = "view" | "manage" | "finance";

export type TrustedPerson = {
  id: string;
  name: string;
  contact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

export type TrustedForMe = {
  id: string;
  ownerName: string;
  ownerContact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

// --------- Моки для вкладки "Доверенные лица" ----------

export const mockTrustedPeople: TrustedPerson[] = [
  {
    id: "t1",
    name: "Ольга Петрова",
    contact: "Телефон: +7 900 000-00-01",
    accessLevel: ["view", "manage"],
    scope: "all_pets",
  },
  {
    id: "t2",
    name: "Фонд «Хвосты и лапы»",
    contact: "Email: curator@tails.ru",
    accessLevel: ["view"],
    scope: "selected_pets",
    petNames: ["Рекс"],
  },
];

export const mockTrustedForMe: TrustedForMe[] = [
  {
    id: "tm1",
    ownerName: "Анна Смирнова",
    ownerContact: "Телефон: +7 900 123-45-67",
    accessLevel: ["view", "manage"],
    scope: "selected_pets",
    petNames: ["Марта"],
  },
];

// --------- Моки для вкладки "Уведомления" ----------

export const mockNotificationSettings = {
  email: {
    address: "user@example.com",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: true,
    reminderEvents: false,
  },
  telegram: {
    connected: false,
    username: "",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: false,
    reminderEvents: false,
  },
} as const;
