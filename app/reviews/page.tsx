import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";

export default function ReviewsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Отзывы владельцев
              </h1>
              <p className="text-[13px] text-slate-600 max-w-xl">
                Позже здесь можно будет фильтровать по типу случая, врачу и
                дате. Сейчас — примеры для структуры.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
