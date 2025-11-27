// app/doctors/[id]/page.tsx

import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";

type PageProps = {
  params: { id: string };
};

export default function DoctorPage({ params }: PageProps) {
  const doctor = doctors.find((d) => d.id === params.id);

  if (!doctor) {
    notFound();
  }

  const {
    name,
    initials,
    role,
    servicesShort,
    servicesFull,
    tags,
    experienceLabel,
  } = doctor!;

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <div className="text-[12px] text-slate-500">
            <a href="/" className="hover:text-onlyvet-coral">
              Главная
            </a>{" "}
            /{" "}
            <a href="/doctors" className="hover:text-onlyvet-coral">
              Врачи
            </a>{" "}
            / <span className="text-slate-700">{name}</span>
          </div>

          {/* Верхний блок: фотография + краткая инфа + CTA */}
          <section className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
            {/* Левая часть */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3">
              <div className="flex gap-4 items-center mb-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white font-semibold text-xl">
                  {initials}
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-semibold">{name}</h1>
                  <p className="text-[13px] text-slate-600">{role}</p>
                  <p className="text-[12px] text-slate-500 mt-1">
                    {experienceLabel}
                  </p>
                </div>
              </div>

              <div className="text-[13px] text-slate-700">
                <span className="font-medium text-slate-800">Фокус врача: </span>
                {servicesShort}
              </div>

              <div className="flex flex-wrap gap-1 mt-1 mb-1">
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

            {/* Правая часть — блок записи */}
            <aside className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3">
              <h2 className="text-[15px] font-semibold">
                Записаться к {name.split(" ")[0]}
              </h2>
              <p className="text-[13px] text-slate-600">
                Оставьте заявку на онлайн-консультацию. Администратор подберёт
                ближайшее доступное время и поможет подготовиться к приёму.
              </p>
              <ul className="text-[12px] text-slate-600 list-disc pl-4 space-y-1">
                <li>Формат: онлайн-консультация.</li>
                <li>Перед приёмом вы можете загрузить анализы и исследования.</li>
                <li>После консультации — письменное заключение и план действий.</li>
              </ul>
              <button
                type="button"
                className="mt-2 w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
              >
                Записаться к врачу
              </button>
              <p className="text-[11px] text-slate-500">
                В экстренных состояниях (угроза жизни, тяжёлое состояние,
                судороги, одышка и т.п.) необходимо немедленно обращаться в
                ближайшую круглосуточную клинику.
              </p>
            </aside>
          </section>

          {/* Основная информация о враче */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-[15px] font-semibold mb-2">
                  С какими запросами обычно обращаются
                </h2>
                <div className="text-[13px] text-slate-700 leading-relaxed">
                  {servicesFull && servicesFull.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {servicesFull.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Врач работает с широким спектром терапевтических и
                      диагностических запросов. Полный перечень запросов будет
                      уточнён позднее.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-[15px] font-semibold mb-2">
                  Подход к консультации
                </h2>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  На приёме врач последовательно собирает анамнез, анализирует
                  предоставленные исследования, сопоставляет жалобы, данные
                  осмотра (если он был у оффлайн-врача) и историю лечения.
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed mt-2">
                  Основная цель — не просто выдать «волшебную таблетку», а
                  выстроить понятную диагностическую и лечебную тактику, которую
                  реально выполнить в ваших условиях.
                </p>
              </div>
            </div>

            {/* Правая колонка — место под образование/доп. инфу (заглушка) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold mb-2">
                  Образование и опыт (будет дополнено)
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  Здесь можно будет разместить информацию об образовании,
                  курсах, конференциях и ключевых этапах опыта врача. Пока
                  используется заглушка и структура страницы.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold mb-2">
                  Типичные случаи
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  В будущем здесь можно будет приводить примеры клинических
                  случаев (без персональных данных), чтобы показать, как врач
                  мыслит и решает задачи.
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

// Предварительная генерация путей для статики
export function generateStaticParams() {
  return doctors.map((doctor) => ({
    id: doctor.id,
  }));
}
