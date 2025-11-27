// app/services/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services } from "@/data/services";

type PageProps = {
  params: { id: string };
};

export default function ServicePage({ params }: PageProps) {
  const service = services.find((s) => s.id === params.id);

  if (!service) {
    notFound();
  }

  const { name, shortDescription, fullDescription, category, priceLabel, tags } =
    service!;

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Хлебные крошки */}
          <div className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/services" className="hover:text-onlyvet-coral">
              Услуги
            </Link>{" "}
            / <span className="text-slate-700">{name}</span>
          </div>

          {/* Верх: название + правая колонка */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                {category === "консультация"
                  ? "Консультация"
                  : category === "второе мнение"
                  ? "Второе мнение"
                  : category === "диагностика"
                  ? "Диагностика"
                  : "Сопровождение"}
              </div>
              <h1 className="text-xl md:text-2xl font-semibold">{name}</h1>
              <p className="text-[13px] text-slate-600">{shortDescription}</p>

              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-[2px] rounded-full text-[11px] bg-slate-100 text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Блок записи / стоимости */}
            <aside className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 space-y-3">
              <h2 className="text-[15px] font-semibold">Записаться на услугу</h2>
              <p className="text-[13px] text-slate-600">
                Выберите удобное время, загрузите анализы и опишите запрос — мы
                подготовимся к консультации заранее.
              </p>
              <div className="text-[13px] font-medium text-onlyvet-navy">
                Стоимость: {priceLabel}
              </div>
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_32px_rgба(247,118,92,0.6)] hover:brightness-105 transition"
              >
                Записаться
              </button>
              <p className="text-[11px] text-slate-500">
                В экстренных состояниях необходимо немедленно обращаться в
                ближайшую круглосуточную клинику.
              </p>
            </aside>
          </section>

          {/* Подробное описание */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
                <h2 className="text-[15px] font-semibold mb-2">
                  Что входит в услугу
                </h2>
                <div className="space-y-2 text-[13px] text-slate-700 leading-relaxed">
                  {fullDescription.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Место под FAQ/заметки (заглушка) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5">
                <h3 className="text-[15px] font-semibold mb-2">
                  Подготовка к консультации
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  В дальнейшем здесь можно будет разместить чек-лист подготовки:
                  какие анализы и данные желательно иметь под рукой, как лучше
                  описать жалобы и историю заболевания.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// статические пути
export function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }));
}
