// app/reviews/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { reviews } from "@/data/reviews";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type PageProps = {
  params: { id: string };
};

function sourceLabel(source: string) {
  switch (source) {
    case "yandex":
      return "Яндекс";
    case "2gis":
      return "2ГИС";
    case "google":
      return "Google";
    case "site":
    default:
      return "Сайт OnlyVet";
  }
}

export default function ReviewPage({ params }: PageProps) {
  const review = reviews.find((r) => r.id === params.id);
  if (!review) {
    notFound();
  }

  const doctor = review.doctorId
    ? doctors.find((d) => d.id === review.doctorId)
    : undefined;
  const service = review.serviceId
    ? services.find((s) => s.id === review.serviceId)
    : undefined;

  const dt = new Date(review.date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/reviews" className="hover:text-onlyvet-coral">
              Отзывы
            </Link>{" "}
            / <span className="text-slate-700">Отзыв #{review.id}</span>
          </nav>

          {/* Заголовок */}
          <section className="space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold">
              Отзыв владельца {review.clientName}
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              История обращения {review.petName || "пациента"} в формате
              онлайн-консультации. Ниже — полный текст отзыва и контекст:
              какой врач, услуга и источник.
            </p>
          </section>

          {/* Основной блок: карточка + мета-информация */}
          <section className="grid gap-4 md:grid-cols-[1.6fr,1fr] items-start">
            {/* Полный отзыв */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
              {/* Используем ту же карточку, но без обрезки текста */}
              <ReviewCard review={review} truncate={false} />
            </div>

            {/* Дополнительная информация / CTA */}
            <aside className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 text-[13px] text-slate-700 space-y-2">
                <div className="text-[12px] text-slate-500 mb-1">
                  Кратко о контексте
                </div>
                <p>
                  Оценка:{" "}
                  <span className="font-semibold text-slate-900">
                    {review.rating} / 5
                  </span>
                </p>
                <p>
                  Дата отзыва:{" "}
                  <span className="font-semibold text-slate-900">{dt}</span>
                </p>
                <p>
                  Источник:{" "}
                  <span className="font-semibold text-slate-900">
                    {sourceLabel(review.source)}
                  </span>
                </p>
                {doctor && (
                  <p>
                    Врач:{" "}
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="text-onlyvet-coral hover:underline"
                    >
                      {doctor.name}
                    </Link>
                  </p>
                )}
                {service && (
                  <p>
                    Услуга:{" "}
                    <Link
                      href={`/services/${service.id}`}
                      className="text-onlyvet-coral hover:underline"
                    >
                      {service.name}
                    </Link>
                  </p>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 text-[13px] text-slate-700 space-y-3">
                <div className="font-semibold text-[14px]">
                  Хотите похожий формат помощи?
                </div>
                <p className="text-[13px] text-slate-600">
                  Если вы узнали себя в этом случае или ситуация чем-то
                  похожа, можно оформить заявку на онлайн-консультацию. В форме
                  вы сможете указать врача и услугу, если это важно.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={
                      service
                        ? `/booking?serviceId=${service.id}${
                            doctor ? `&doctorId=${doctor.id}` : ""
                          }`
                        : doctor
                        ? `/booking?doctorId=${doctor.id}`
                        : "/booking"
                    }
                    className="px-4 py-2 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_30px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
                  >
                    Записаться на консультацию
                  </Link>
                  <Link
                    href="/reviews"
                    className="px-4 py-2 rounded-full border border-slate-300 text-[13px] text-onlyvet-navy hover:bg-slate-50 transition"
                  >
                    Все отзывы
                  </Link>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Предварительная генерация статических маршрутов для существующих отзывов
export function generateStaticParams() {
  return reviews.map((r) => ({ id: r.id }));
}
