"use client";

type ContactErrors = {
  lastNameError: boolean;
  firstNameError: boolean;
  middleNameError: boolean;
  phoneError: boolean;
  emailError: boolean;
};

type BookingContactSectionProps = {
  lastName: string;
  firstName: string;
  middleName: string;
  noMiddleName: boolean;
  phone: string;
  email: string;
  telegram: string;

  setLastName: (v: string) => void;
  setFirstName: (v: string) => void;
  setMiddleName: (v: string) => void;
  setNoMiddleName: (v: boolean) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setTelegram: (v: string) => void;

  errors: ContactErrors;
};

export function BookingContactSection({
  lastName,
  firstName,
  middleName,
  noMiddleName,
  phone,
  email,
  telegram,

  setLastName,
  setFirstName,
  setMiddleName,
  setNoMiddleName,
  setPhone,
  setEmail,
  setTelegram,

  errors,
}: BookingContactSectionProps) {
  const {
    lastNameError,
    firstNameError,
    middleNameError,
    phoneError,
    emailError,
  } = errors;

  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">Контактные данные</h2>

      {/* Фамилия / Имя / Отчество */}
      <div className="grid md:grid-cols-3 gap-3">
        {/* Фамилия */}
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Фамилия<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
              lastNameError
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
            placeholder="Иванов"
          />
          {lastNameError && (
            <p className="mt-1 text-[11px] text-rose-600">
              Укажите фамилию.
            </p>
          )}
        </div>

        {/* Имя */}
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Имя<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
              firstNameError
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
            placeholder="Иван"
          />
          {firstNameError && (
            <p className="mt-1 text-[11px] text-rose-600">Укажите имя.</p>
          )}
        </div>

        {/* Отчество */}
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Отчество
            {!noMiddleName && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            disabled={noMiddleName}
            className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
              noMiddleName
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : middleNameError
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
            placeholder={noMiddleName ? "Не указано" : "Иванович"}
          />
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
            <input
              type="checkbox"
              id="no-middle-name"
              checked={noMiddleName}
              onChange={(e) => setNoMiddleName(e.target.checked)}
              className="rounded border-slate-300"
            />
            <label
              htmlFor="no-middle-name"
              className="select-none cursor-pointer"
            >
              Нет отчества
            </label>
          </div>
          {middleNameError && !noMiddleName && (
            <p className="mt-1 text-[11px] text-rose-600">
              Укажите отчество или отметьте «Нет отчества».
            </p>
          )}
        </div>
      </div>

      {/* Телефон / Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Номер телефона<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
              phoneError
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
            placeholder="+7 ..."
          />
          {phoneError && (
            <p className="mt-1 text-[11px] text-rose-600">
              Укажите номер телефона.
            </p>
          )}
        </div>

        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
              emailError
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-onlyvet-teal/40"
            }`}
            placeholder="example@mail.ru"
          />
          {emailError && (
            <p className="mt-1 text-[11px] text-rose-600">
              Email обязателен.
            </p>
          )}
        </div>
      </div>

      {/* Telegram */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Логин Telegram
          </label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            placeholder="@username (необязательно)"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            При наличии нам проще общаться через Telegram.
          </p>
        </div>
      </div>
    </section>
  );
}
