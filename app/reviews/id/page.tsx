// app/reviews/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";

type PageProps = {
  params: { id: string };
};

export default function ReviewPage({ params }: PageProps) {
  const review = reviews.find((r) => r.id === params.id);

  if (!review) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-3xl px-4 space-y-5">
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/reviews" className="hover:text-onlyvet-coral">
              Отзывы
            </Link>{" "}
            / <span className="text-slate-700">{review!.clientName}</span>
          </nav>

          <h1 className="text-xl md:text-2xl font-semibold">
            Полный отзыв от {review!.clientName}
          </h1>

          <ReviewCard review={review!} truncate={false} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export function generateStaticParams() {
  return reviews.map((r) => ({ id: r.id }));
}
