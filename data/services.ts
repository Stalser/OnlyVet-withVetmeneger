// data/services.ts
export type Service = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  priceLabel: string;
  category: string;
};

export const services: Service[] = [
  {
    id: "online-consult",
    name: "Онлайн-консультация",
    description:
      "Первичный или повторный приём, разбор жалоб и текущего лечения.",
    tags: ["Кошки", "Собаки"],
    priceLabel: "от 2 500 ₽",
    category: "консультации",
  },
  {
    id: "second-opinion",
    name: "Второе мнение",
    description:
      "Проверяем диагноз и план лечения, объясняем варианты с опорой на протоколы.",
    tags: ["Сложные случаи"],
    priceLabel: "от 3 000 ₽",
    category: "второе мнение",
  },
  {
    id: "labs-ultrasound",
    name: "Разбор анализов и УЗИ",
    description:
      "Чётко объясняем результаты, динамику и дальнейшие шаги.",
    tags: ["Анализы", "УЗИ"],
    priceLabel: "от 1 800 ₽",
    category: "диагностика",
  },
];
