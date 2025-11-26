import type { Review } from "@/data/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-2 min-h-[150px]">
      <div className="flex items-center justify-between text-[13px]">
        <div>
          <div className="font-medium">{review.author}</div>
          <div className="text-[12px] text-slate-500">{review.pet}</div>
        </div>
        <div className="text-[12px] text-onlyvet-coral">{review.rating}</div>
      </div>
      <div className="text-[13px] text-slate-600">{review.text}</div>
    </article>
  );
}
