// data/reviews.ts
export type Review = {
  id: string;
  author: string;
  pet: string;
  rating: string;
  text: string;
};

export const reviews: Review[] = [
  {
    id: "1",
    author: "Екатерина · Локи",
    pet: "Кошка, 2 года",
    rating: "★★★★★",
    text: "Спасибо за спокойное объяснение анализов и понятный план. Реально стало легче.",
  },
  {
    id: "2",
    author: "Анна · Рекс",
    pet: "Собака, 6 лет",
    rating: "★★★★★",
    text: "Второе мнение по онкологии. Чётко разложили варианты и прогноз, без паники.",
  },
  {
    id: "3",
    author: "Мария · Мира",
    pet: "Кошка, 9 лет",
    rating: "★★★★☆",
    text: "Удобно онлайн, кошка не стрессует. Заключение подробное, по делу.",
  },
];
