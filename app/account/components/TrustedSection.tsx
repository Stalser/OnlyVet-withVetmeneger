"use client";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type AccountTab = "consultations" | "pets" | "trusted" | "notifications" | "profile";

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

// Демонстрационные данные — позже заменим на Supabase/Vetmanager
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

export default function TrustedSection({ user }: { user: SupabaseUser }) {
  const meta = (user.user_metadata || {}) as any;
  const fullNameFromMeta =
    meta.full_name ||
    [meta.last_name, meta.first_name].filter(Boolean).join(" ");

  const currentUserName =
    (fullNameFromMeta && fullNameFromMeta.trim().length > 0
      ? fullNameFromMeta
      : user.email) || "Пользователь";

  const trustedPeople = mockTrustedPeople;
  const trustedForMe = mockTrustedForMe;

  const isOwner = true; // позже можно будет вычислять по ролям
  const isAlsoTrusted = trustedForMe.length > 0;

  return (
    <section className="space-y-4 md:space-y-5">
      {/* Общая шапка */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-2">
          Доверенные лица
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl mb-2">
          Здесь видно, кому вы доверили доступ к информации о питомцах и
          консультациях, а также для кого вы сами являетесь доверенным лицом.
        </p>
        <p className="text-[12px] text-slate-500 max-w-2xl">
          <span className="font-medium">Важно:</span> у каждого доверенного лица
          может быть свой уровень доступа (просмотр, участие в консультациях,
          оплата) и список питомцев, к которым этот доступ относится.
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
                владельцев. Это значит, что вы можете участвовать в
                консультациях их питомцев в рамках выданных прав.
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
              • <span className="font-medium">Доверитель</span> — основной
              владелец аккаунта и питомцев.
            </li>
            <li>
              • <span className="font-medium">Доверенное лицо</span> — человек
              или организация, которым доверитель разрешил доступ к части
              информации.
            </li>
            <li>
              • Доступ можно выдавать ко всем питомцам или к выбранным.
            </li>
            <li>
              • Уровни доступа: просмотр, участие в консультациях, оплата
              услуг.
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

        {trustedPeople.length === 0 ? (
          <p className="text-[12px] text-slate-500">
            Пока у вас нет доверенных лиц. Вы можете выдать доступ, если кто-то
            помогает вам с лечением питомца (например, родственник или куратор
            фонда).
          </p>
        ) : (
          <div className="space-y-3 text-[13px]">
            {trustedPeople.map((person) => (
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

        {trustedForMe.length === 0 ? (
          <p className="text-[12px] text-slate-500">
            Сейчас вы не являетесь доверенным лицом ни у одного владельца в
            системе.
          </p>
        ) : (
          <div className="space-y-3 text-[13px]">
            {trustedForMe.map((item) => (
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
