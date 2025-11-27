// data/reviews.ts

export type ReviewSource = "yandex" | "2gis" | "google" | "site";

export type Review = {
  id: string;
  clientName: string;
  petName?: string;
  avatarUrl?: string | null;
  rating: number;        // 1–5
  text: string;
  date: string;          // ISO string
  doctorId?: string;     // id из data/doctors
  serviceId?: string;    // id из data/services
  source: ReviewSource;
};

export const reviews: Review[] = [
  {
    id: "rev1",
    clientName: "Екатерина С.",
    petName: "Кошка Локи",
    rating: 5,
    text:
      "Обратились к Эльвину Мазагировичу с уже поставленным диагнозом и сложной схемой лечения. " +
      "Врач спокойно разобрал все анализы, объяснил, почему часть назначений можно убрать, а что важно оставить. " +
      "После консультации стало намного спокойнее, появились чёткие шаги и понимание, чего ждать дальше.",
    date: "2025-01-15",
    doctorId: "elvin",
    serviceId: "second-opinion",
    source: "yandex",
  },
  {
    id: "rev2",
    clientName: "Анна К.",
    petName: "Собака Рекс",
    rating: 5,
    text:
      "Спасибо Диане за внимательное отношение к нашему Рексу. " +
      "У собаки хронический гастрит, долго не могли подобрать схему. " +
      "На онлайн-консультации всё объяснили по шагам, расписали, что делать при обострениях. " +
      "Очень спокойная и понятная подача.",
    date: "2024-12-10",
    doctorId: "diana",
    serviceId: "online-consult",
    source: "2gis",
  },
  {
    id: "rev3",
    clientName: "Мария Л.",
    petName: "Кошка Мира",
    rating: 4,
    text:
      "Обращались за разбором анализов и УЗИ. " +
      "Понравилось, что врач не просто озвучил цифры, а объяснил, что именно они значат для нашей кошки.",
    date: "2024-11-05",
    doctorId: "oleg",
    serviceId: "labs-ultrasound",
    source: "google",
  },
  {
    id: "rev4",
    clientName: "Ольга П.",
    petName: "Кот Барсик",
    rating: 5,
    text:
      "Мы на долгосрочном сопровождении по онкологии. " +
      "Врач объясняет всё спокойно и чётко, без драматизации. Очень ценим подход.",
    date: "2025-01-05",
    doctorId: "elvin",
    serviceId: "long-term",
    source: "site",
  },
];
