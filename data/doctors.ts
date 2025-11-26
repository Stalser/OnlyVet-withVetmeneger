// data/doctors.ts
export type Doctor = {
  id: string;
  initials: string;
  name: string;
  role: string;
  services: string;
  tags: string[];
  experienceLabel: string;
  specialization: string; // для фильтров
};

export const doctors: Doctor[] = [
  {
    id: "elvin",
    initials: "ЭМ",
    name: "Эльвин Мазагирович",
    role: "Ветеринарный врач, эксперт",
    services: "Сложные случаи, консилиумы, онкология",
    tags: ["Консилиум", "Сложные случаи"],
    experienceLabel: "Опыт > 10 лет",
    specialization: "эксперт",
  },
  {
    id: "diana",
    initials: "ДЧ",
    name: "Диана Чемерилова",
    role: "Ветеринарный врач",
    services: "Терапия кошек и собак, второе мнение",
    tags: ["Терапия", "Кошки и собаки"],
    experienceLabel: "Приём онлайн",
    specialization: "терапия",
  },
  {
    id: "oleg",
    initials: "ОВ",
    name: "Олег Врач",
    role: "Диагностика",
    services: "УЗИ, интерпретация анализов, контроль динамики",
    tags: ["УЗИ", "Анализы"],
    experienceLabel: "Работает в команде",
    specialization: "диагностика",
  },
];
