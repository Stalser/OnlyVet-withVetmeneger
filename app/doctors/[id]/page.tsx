// app/doctors/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

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

  const { initials, name, role, servicesShort, servicesFull, tags, experienceLabel } =
    doctor!;

  const firstName = name.split(" ")[0] ?? "врачу";

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          {/* Хлебные крошки */}
          <nav className="text-[12px] text-slate-500">
            <Link href="/" className="hover:text-onlyvet-coral">
              Главная
            </Link>{" "}
            /{" "}
            <Link href="/doctors" className="hover:text-onlyvet-coral">
              Врачи
            </Link>{" "}
            / <span className="text-slate-700">{name}</span>
          </nav>

          {/* Шапка врача */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr] items-start">
            {/* Основной блок про врача */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy flex items-center justify-center text-white text-2xl font-semibold">
                  {initials}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-semibold mb-1">
                    {name}
                  </h1>
                  <p className="text-[13px] text-slate-600">{role}</p>
                  <p className="text-[12px] text-slate-500 mt-1">
                    {experienceLabel}
                  </p>
                </div>
              </div>

              <div className="text-[13px] text-slate-700">
                <span className="font-medium text-slate-800">
                  Фокус работы:&nbsp;
                </span>
                {servicesShort}
              </div>

            </div>

            {/* Боковой блок записи */}
            <aside className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 flex flex-col gap-3">
              <h2 className="text-[15px] font-semibold">
                Записаться к {firstName}
              </h2>
              <p className="text-[13px] text-slate-600">
                Оставьте контакты и кратко опишите ситуацию — администратор
                подберёт ближайшее доступное время и уточнит детали.
              </p>

              {/* Псевдо-расписание (заглушка под Vetmanager) */}
              <div className="bg-onlyvet-bg rounded-2xl border border-dashed border-slate-300 p-3 text-[12px] text-slate-600 space-y-1">
                <div className="font-medium text-slate-700 mb-1">
                  Ближайшие слоты (онлайн)
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-white border border-slate-200">
                    Сегодня · 18:30
                  </span>
                  <span className="px-2 py-1 rounded-full bg-white border border-slate-200">
                    Завтра · 11:00
                  </span>
                  <span className="px-2 py-1 rounded-full bg-white border border-slate-200">
                    Завтра · 19:00
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  В реальной системе здесь будут показываться слоты из
                  расписания Vetmanager.
                </p>
              </div>

              <button
                type="button"
                className="mt-1 w-full px-4 py-2.5 rounded-full bg-onlyvet-coral text-white text-[13px] font-medium shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
              >
                Записаться к {firstName}
              </button>

              <p className="text-[11px] text-slate-500">
                В экстренных состояниях (угроза жизни, тяжёлое состояние,
                судороги, одышка и т.п.) необходимо обращаться в ближайшую
                круглосуточную клинику. Онлайн-консультация не заменяет очный
                осмотр.
              </p>
            </aside>
          </section>

          {/* Подробное описание работы врача */}
          <section className="grid gap-6 md:grid-cols-[1.4fr,1fr] items-start">
            {/* С какими запросами работает */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-[15px] font-semibold mb-2">
                  С какими запросами обычно обращаются
                </h2>
                <div className="text-[13px] text-slate-700 leading-relaxed">
                  {doctor.servicesFull && doctor.servicesFull.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {doctor.servicesFull.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Информация будет дополнена. Врач работает с широким
                      спектром терапевтических и диагностических задач.
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
                  предоставленные исследования, задаёт уточняющие вопросы и
                  формирует картину заболевания. Важный акцент делается на
                  безопасность, реалистичность и понятность плана для владельца.
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed mt-2">
                  По итогам вы получаете структурированное заключение, список
                  первоочередных шагов и варианты дальнейших действий в
                  зависимости от ответа организма на лечение.
                </p>
              </div>
            </div>

            {/* Теги + место под образование/кейсы */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold mb-2">
                  Ключевые компетенции
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-[2px] rounded-full text-[11px] bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-slate-600">
                  Эти теги отражают темы, с которыми врачу чаще всего
                  обращаются. Они не ограничивают его компетенции, но помогают
                  быстрее сориентироваться.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold mb-2">
                  Образование и опыт (будет заполнено)
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  Здесь в дальнейшем можно будет разместить информацию об
                  образовании, дополнительных курсах, конференциях и опыте
                  работы врача. Сейчас это служебная заглушка, чтобы задать
                  структуру страницы.
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

export function generateStaticParams() {
  return doctors.map((doctor) => ({
    id: doctor.id,
  }));
}
