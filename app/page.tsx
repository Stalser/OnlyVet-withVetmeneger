import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCard } from "@/components/ReviewCard";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { reviews } from "@/data/reviews";

export default function HomePage() {
  const mainDoctors = doctors.slice(0, 3);
  const mainServices = services.slice(0, 3);
  const mainReviews = reviews.slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-onlyvet-navy text-white py-10 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl px-4 grid md:grid-cols-[1.4fr,1.1fr] gap-10 items-center">
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-onlyvet-teal mb-3">
                Цифровая ветеринария OnlyVet
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-3">
                Экспертная помощь питомцу, когда ваша клиника — онлайн.
              </h1>
              <p className="text-sm md:text-base text-slate-200 mb-4 max-w-xl">
                Онлайн-консультации, второе мнение, разбор анализов и
                сопровождение сложных случаев — без поездок и суеты.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <button className="btn btn-primary px-4 py-2 rounded-full bg-onlyvet-coral text-xs font-medium shadow-[0_14px_36px_rgba(247,118,92,0.45)]">
                  Записаться на консультацию
                </button>
                <button className="px-4 py-2 rounded-full border border-slate-500 text-xs">
                  Войти в личный кабинет
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] text-slate-200">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Врачи с клиническим опытом
                </span>
                <span>Фокус на доказательной медицине</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[26px] bg-gradient-to-br from-onlyvet-teal to-onlyvet-navy p-1.5 shadow-hero">
                <div
                  className="rounded-[22px] min-h-[220px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.pexels.com/photos/6235249/pexels-photo-6235249.jpeg?auto=compress&cs=tinysrgb&w=1200')",
                  }}
                />
              </div>
              <div className="absolute -bottom-3 left-4 bg-slate-900/90 border border-slate-500 rounded-full px-3 py-1 text-[11px] text-slate-100">
                Спокойный онлайн-приём, где врач действительно читает ваши
                анализы.
              </div>
            </div>
          </div>
        </section>

        {/* Почему OnlyVet */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Почему OnlyVet
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  Клиника, где на первом месте — доказательная медицина,
                  спокойная коммуникация с владельцем и чёткий план лечения.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-4">
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Доказательная медицина
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Решения опираются на исследования, протоколы и опыт разбора
                    сложных случаев.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Онлайн без хаоса
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Чёткая структура приёма, документы и план в личном
                    кабинете.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Сложные пациенты
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Онкология, хронические заболевания, неясные диагнозы —
                    наша зона ответственности.
                  </div>
                </article>
                <article className="bg-onlyvet-bg rounded-2xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold mb-1">
                    Этика и прозрачность
                  </div>
                  <div className="text-[13px] text-slate-600">
                    Объясняем варианты, риски и прогноз без паники и лишнего
                    давления.
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Врачи */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Врачи OnlyVet
                </h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — несколько специалистов. Полный список с фильтрами
                  будет на странице «Все врачи».
                </p>
              </div>
              <a
                href="/doctors"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все врачи →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          </div>
        </section>

        {/* Услуги */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Услуги</h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — основные направления. Отдельная страница «Все
                  услуги» будет с фильтрами и подробным описанием.
                </p>
              </div>
              <a
                href="/services"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все услуги →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="py-7">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Отзывы</h2>
                <p className="text-[13px] text-slate-600 max-w-xl">
                  На главной — несколько свежих отзывов. Все истории будут на
                  отдельной странице.
                </p>
              </div>
              <a
                href="/reviews"
                className="text-[13px] text-onlyvet-coral whitespace-nowrap"
              >
                Все отзывы →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mainReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
