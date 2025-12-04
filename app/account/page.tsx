// app/account/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabaseClient";
// --------------------
// Типы и мок-данные
// --------------------

type AccountTab = "consultations" | "pets" | "trusted" | "notifications" | "profile";

type ConsultationStatus = "new" | "in_progress" | "done";

type MockConsultation = {
  id: string;
  petName: string;
  serviceName: string;
  date: string;
  status: ConsultationStatus;
};

type MockPet = {
  id: string;
  name: string;
  species: string;
  age: string;
  weight?: string;
};

type AccessLevel = "view" | "manage" | "finance";

type TrustedPerson = {
  id: string;
  name: string;
  contact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

type TrustedForMe = {
  id: string;
  ownerName: string;
  ownerContact: string;
  accessLevel: AccessLevel[];
  scope: "all_pets" | "selected_pets";
  petNames?: string[];
};

const mockConsultations: MockConsultation[] = [
  {
    id: "c1",
    petName: "Локи",
    serviceName: "Онлайн-консультация терапевта",
    date: "2024-12-01 19:00",
    status: "in_progress",
  },
  {
    id: "c2",
    petName: "Рекс",
    serviceName: "Второе мнение по анализам",
    date: "2024-11-20 14:00",
    status: "done",
  },
  {
    id: "c3",
    petName: "Локи",
    serviceName: "Разбор УЗИ и плана лечения",
    date: "2024-11-10 18:30",
    status: "done",
  },
];

// ID питомцев — те же, что и в app/account/pets/[id]/page.tsx
const mockPets: MockPet[] = [
  {
    id: "pet1",
    name: "Локи",
    species: "Кошка, шотландская",
    age: "2 года 6 месяцев",
    weight: "4.8 кг",
  },
  {
    id: "pet2",
    name: "Рекс",
    species: "Собака, метис",
    age: "6 лет",
    weight: "22 кг",
  },
];

const mockTrustedPeople: TrustedPerson[] = [
  {
    id: "t1",
    name: "Ольга Петрова",
    contact: "Телефон: +7 900 000-00-01",
    accessLevel: ["view", "manage"],
    scope: "all_pets",
  },
  {
    id: "t2",
    name: "Фонд «Хвосты и лапы»",
    contact: "Email: curator@tails.ru",
    accessLevel: ["view"],
    scope: "selected_pets",
    petNames: ["Рекс"],
  },
];

const mockTrustedForMe: TrustedForMe[] = [
  {
    id: "tm1",
    ownerName: "Анна Смирнова",
    ownerContact: "Телефон: +7 900 123-45-67",
    accessLevel: ["view", "manage"],
    scope: "selected_pets",
    petNames: ["Марта"],
  },
];

const mockNotificationSettings = {
  email: {
    address: "user@example.com",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: true,
    reminderEvents: false,
  },
  telegram: {
    connected: false,
    username: "",
    serviceEvents: true,
    medicalEvents: true,
    billingEvents: false,
    reminderEvents: false,
  },
};

// --------------------
// Страница
// --------------------

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>("consultations");

  const [currentUserName, setCurrentUserName] = useState<string>("Пользователь");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !data.user) {
        router.replace("/auth/login");
        return;
      }

      const user = data.user;
      const meta = (user.user_metadata || {}) as any;

      const fullNameFromMeta =
        meta.full_name ||
        [meta.last_name, meta.first_name].filter(Boolean).join(" ");

      setCurrentUserName(
        fullNameFromMeta && fullNameFromMeta.trim().length > 0
          ? fullNameFromMeta
          : user.email || "Пользователь"
      );
      setCurrentUserEmail(user.email || "");
      setCheckingAuth(false);
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Пока проверяем сессию — показываем простую «заглушку»
  if (checkingAuth) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-slate-50/70 py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <p className="text-[13px] text-slate-600">
              Загружаем личный кабинет...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/60">
        <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
          {/* Заголовок страницы */}
          <div className="mb-5 md:mb-6">
            <nav className="text-[11px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              / <span className="text-slate-700">Личный кабинет</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Личный кабинет
            </h1>
            <p className="text-[13px] text-slate-600 max-w-2xl">
              Аккаунт:{" "}
              <span className="font-medium">{currentUserName}</span>
              {currentUserEmail && (
                <> · <span className="text-slate-500">{currentUserEmail}</span></>
              )}
            </p>
          </div>

          {/* Навигация по вкладкам */}
          <div className="mb-5 border-b border-slate-200">
            <div className="flex flex-wrap gap-2 text-[12px] md:text-[13px]">
              <AccountTabButton
                tab="consultations"
                current={tab}
                setTab={setTab}
              >
                Консультации
              </AccountTabButton>
              <AccountTabButton tab="pets" current={tab} setTab={setTab}>
                Питомцы
              </AccountTabButton>
              <AccountTabButton tab="trusted" current={tab} setTab={setTab}>
                Доверенные лица
              </AccountTabButton>
              <AccountTabButton
                tab="notifications"
                current={tab}
                setTab={setTab}
              >
                Уведомления
              </AccountTabButton>
              <AccountTabButton tab="profile" current={tab} setTab={setTab}>
                Профиль
              </AccountTabButton>
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="space-y-4 md:space-y-5">
            {tab === "consultations" && <ConsultationsSection />}
            {tab === "pets" && <PetsSection />}
            {tab === "trusted" && (
              <TrustedSection
                currentUserName={currentUserName}
                trustedPeople={mockTrustedPeople}
                trustedForMe={mockTrustedForMe}
              />
            )}
            {tab === "notifications" && (
              <NotificationsSection settings={mockNotificationSettings} />
            )}
            {tab === "profile" && (
              <ProfileSection
                currentUserName={currentUserName}
                currentUserEmail={currentUserEmail}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --------------------
// Вкладки / вспомогательные компоненты
// --------------------

function AccountTabButton({
  tab,
  current,
  setTab,
  children,
}: {
  tab: AccountTab;
  current: AccountTab;
  setTab: (tab: AccountTab) => void;
  children: React.ReactNode;
}) {
  const isActive = tab === current;
  return (
    <button
      type="button"
      onClick={() => setTab(tab)}
      className={`
        relative px-3 py-1.5 rounded-full
        transition text-xs md:text-[13px]
        ${
          isActive
            ? "bg-white text-onlyvet-navy border border-slate-200 shadow-sm"
            : "text-slate-600 hover:text-onlyvet-navy hover:bg-white/70"
        }
      `}
    >
      {children}
    </button>
  );
}

// --- Консультации ---

function ConsultationsSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши консультации
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Ниже — список заявок и консультаций в OnlyVet. В реальной версии здесь
            будут данные из вашей истории обращений.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
        >
          Новая консультация
        </Link>
      </div>

      <div className="divide-y divide-slate-100 text-[13px]">
        {mockConsultations.map((c) => (
          <div
            key={c.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3"
          >
            <div className="space-y-0.5">
              <div className="font-medium text-slate-900">
                {c.serviceName}
              </div>
              <div className="text-slate-600">
                Питомец: <span className="font-medium">{c.petName}</span>
              </div>
              <div className="text-[12px] text-slate-500">
                Дата и время: {c.date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={c.status} />
              <Link
                href={`/account/consultations/${c.id}`}
                className="text-[12px] text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
              >
                Открыть карточку
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const map: Record<ConsultationStatus, { label: string; className: string }> =
    {
      new: {
        label: "Новая заявка",
        className: "bg-sky-50 text-sky-700 border-sky-200",
      },
      in_progress: {
        label: "В работе",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      done: {
        label: "Завершена",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    };

  const cfg = map[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// --- Питомцы ---

function PetsSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Для каждого питомца можно будет смотреть историю консультаций и документы.
            Пока здесь примерная структура на мок-данных.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 transition"
        >
          Добавить питомца
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {mockPets.map((pet) => (
          <div
            key={pet.id}
            className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 space-y-1 text-[13px]"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">{pet.name}</div>
              <span className="text-[11px] text-slate-500">
                ID: {pet.id.toUpperCase()}
              </span>
            </div>
            <div className="text-slate-700">{pet.species}</div>
            <div className="text-[12px] text-slate-600">
              Возраст: {pet.age}
              {pet.weight && <> · Вес: {pet.weight}</>}
            </div>
            <Link
              href={`/account/pets/${pet.id}`}
              className="mt-1 inline-flex text-[12px] text-onlyvet-navy hover:text-onlyvet-coral underline underline-offset-2"
            >
              Открыть карточку питомца
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Доверенные лица ---

function TrustedSection({
  currentUserName,
  trustedPeople,
  trustedForMe,
}: {
  currentUserName: string;
  trustedPeople: TrustedPerson[];
  trustedForMe: TrustedForMe[];
}) {
  const isOwner = true; // в реале — из auth/ролей
  const isAlsoTrusted = trustedForMe.length > 0;

  return (
    <section className="space-y-4 md:space-y-5">
      {/* Общая шапка */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-2">
          Доверенные лица
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl mb-2">
          Здесь видно, кому вы доверили доступ к информации о питомцах и консультациях,
          а также для кого вы сами являетесь доверенным лицом.
        </p>
        <p className="text-[12px] text-slate-500 max-w-2xl">
          <span className="font-medium">Важно:</span> у каждого доверенного лица
          может быть свой уровень доступа (просмотр, управление, оплата) и список питомцев,
          к которым этот доступ относится.
        </p>
      </div>

      {/* Статус текущего пользователя */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 text-[13px]">
          <h3 className="text-[14px] font-semibold mb-1">
            Ваш статус в системе
          </h3>
          <p className="text-slate-700 mb-2">
            Вы вошли как <span className="font-medium">{currentUserName}</span>.
          </p>
          <ul className="text-[12px] text-slate-600 space-y-1.5">
            {isOwner && (
              <li>
                • Вы являетесь{" "}
                <span className="font-medium">основным владельцем</span> для
                своих питомцев в OnlyVet.
              </li>
            )}
            {isAlsoTrusted && (
              <li>
                • Также вы указаны как{" "}
                <span className="font-medium">доверенное лицо</span> у других
                владельцев. Это значит, что вы можете участвовать в консультациях
                их питомцев в рамках выданных прав.
              </li>
            )}
            {!isAlsoTrusted && (
              <li>
                • Сейчас вы не указаны доверенным лицом ни у кого. При
                необходимости другой владелец может выдать вам доступ из своего
                личного кабинета.
              </li>
            )}
          </ul>
        </div>

        {/* Быстрая памятка */}
        <div className="bg-onlyvet-bg rounded-3xl border border-dashed border-slate-300 p-4 text-[12px] text-slate-700">
          <h3 className="text-[13px] font-semibold mb-2">
            Как работает система доверенных лиц
          </h3>
          <ul className="space-y-1.5">
            <li>
              • <span className="font-medium">Доверитель</span> — это
              основной владелец аккаунта и питомцев.
            </li>
            <li>
              • <span className="font-medium">Доверенное лицо</span> — человек,
              которому доверитель разрешил видеть и/или управлять частью
              информации.
            </li>
            <li>
              • Доступ можно выдать ко всем питомцам или только к выбранным.
            </li>
            <li>
              • Уровни доступа: просмотр, участие в консультациях, оплата услуг.
            </li>
          </ul>
        </div>
      </div>

      {/* Кому вы доверяете */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div>
            <h3 className="text-[14px] font-semibold mb-1">
              Кому вы доверяете доступ
            </h3>
            <p className="text-[12px] text-slate-600 max-w-xl">
              Эти люди или организации могут видеть данные о ваших питомцах и
              консультациях согласно указанному уровню доступа.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[12px] font-medium border border-slate-300 text-onlyvet-navy bg-white hover:bg-slate-50 transition"
          >
            Добавить доверенное лицо
          </button>
        </div>

        {mockTrustedPeople.length === 0 ? (
          <p className="text-[12px] text-slate-500">
            Пока у вас нет доверенных лиц. Вы можете выдать доступ, если кто-то
            помогает вам с лечением питомца (например, родственник или куратор
            фонда).
          </p>
        ) : (
          <div className="space-y-3 text-[13px]">
            {mockTrustedPeople.map((person) => (
              <div
                key={person.id}
                className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 md:p-3.5 flex flex-col gap-1.5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {person.name}
                    </div>
                    <div className="text-[12px] text-slate-600">
                      {person.contact}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {person.accessLevel.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
                      >
                        {accessLevelLabel(level)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Доступ:{" "}
                  {person.scope === "all_pets" ? (
                    <span>ко всем вашим питомцам</span>
                  ) : (
                    <>
                      к выбранным питомцам:{" "}
                      <span className="font-medium">
                        {person.petNames?.join(", ")}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] mt-1">
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                  >
                    Изменить доступ
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                  >
                    Отменить доверие
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Для кого вы доверенное лицо */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
        <h3 className="text-[14px] font-semibold mb-1">
          Где вы указаны как доверенное лицо
        </h3>
        <p className="text-[12px] text-slate-600 max-w-xl mb-3">
          Здесь показаны владельцы, которые выдали вам доступ к информации по
          своим питомцам. Это важно, чтобы вы всегда понимали, чьи данные вы
          просматриваете или редактируете.
        </p>

        {mockTrustedForMe.length === 0 ? (
          <p className="text-[12px] text-slate-500">
            Сейчас вы не являетесь доверенным лицом ни у одного владельца в
            системе.
          </p>
        ) : (
          <div className="space-y-3 text-[13px]">
            {mockTrustedForMe.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 md:p-3.5 flex flex-col gap-1.5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.ownerName}
                    </div>
                    <div className="text-[12px] text-slate-600">
                      {item.ownerContact}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {item.accessLevel.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
                      >
                        {accessLevelLabel(level)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[12px] text-slate-600">
                  Ваш доступ:{" "}
                  {item.scope === "all_pets" ? (
                    <span>ко всем питомцам этого владельца</span>
                  ) : (
                    <>
                      к питомцам:{" "}
                      <span className="font-medium">
                        {item.petNames?.join(", ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function accessLevelLabel(level: AccessLevel): string {
  switch (level) {
    case "view":
      return "Просмотр";
    case "manage":
      return "Участие в консультациях";
    case "finance":
      return "Оплата услуг";
    default:
      return level;
  }
}

// --- Уведомления ---

function NotificationsSection({
  settings,
}: {
  settings: typeof mockNotificationSettings;
}) {
  const { email, telegram } = settings;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div>
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-1">
          Настройки уведомлений
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl">
          Здесь вы сможете управлять тем, какие уведомления получать и по каким
          каналам. Сейчас данные демонстрационные.
        </p>
      </div>

      {/* Email */}
      <div className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 md:p-3.5 text-[13px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-slate-900">Email</div>
            <div className="text-[12px] text-slate-600">
              {email.address || "email не указан"}
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            Канал активен
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-2 text-[12px] text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={email.serviceEvents} readOnly />
            <span>Сервисные уведомления (заявки, время приёма)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={email.medicalEvents} readOnly />
            <span>Медицинские события (план лечения, заключения)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={email.billingEvents} readOnly />
            <span>Финансовые уведомления (счета, оплаты)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={email.reminderEvents} readOnly />
            <span>Напоминания (повторные анализы, контроль)</span>
          </label>
        </div>
      </div>

      {/* Telegram */}
      <div className="rounded-2xl border border-slate-200 bg-onlyvet-bg p-3 md:p-3.5 text-[13px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-slate-900">Telegram</div>
            <div className="text-[12px] text-slate-600">
              {telegram.connected
                ? `Подключён (@${telegram.username})`
                : "Не подключён"}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium border border-sky-300 bg-white text-sky-700 hover:bg-sky-50 transition"
          >
            Подключить Telegram
          </button>
        </div>
        <p className="text-[12px] text-slate-600 mb-2">
          В будущем вы сможете получать уведомления от OnlyVet через Telegram-бота.
        </p>
      </div>
    </section>
  );
}

// --- Профиль ---

function ProfileSection({
  currentUserName,
  currentUserEmail,
}: {
  currentUserName: string;
  currentUserEmail: string;
}) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div>
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-1">
          Профиль
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl">
          Здесь будут редактироваться ваши контактные данные, пароль и базовые
          настройки аккаунта. Сейчас данные частично берутся из Supabase, остальное — демонстрационные поля.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 text-[13px]">
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            ФИО
          </label>
          <input
            type="text"
            defaultValue={currentUserName}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
          />
        </div>
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            defaultValue="+7 900 000-00-00"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
          />
        </div>
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            defaultValue={currentUserEmail || "user@example.com"}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
          />
        </div>
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Telegram
          </label>
          <input
            type="text"
            defaultValue="@onlyvet_user"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[12px]">
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-onlyvet-coral text-white font-medium shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
        >
          Сохранить изменения
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
        >
          Изменить пароль
        </button>
      </div>
    </section>
  );
}
