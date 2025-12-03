// app/booking/BookingModeCards.tsx
"use client";

type BookingMode = "short" | "full";

type BookingModeCardsProps = {
  kind: BookingMode;
  onChangeKind: (kind: BookingMode) => void;
  onTelegramClick: () => void;
};

export function BookingModeCards({
  kind,
  onChangeKind,
  onTelegramClick,
}: BookingModeCardsProps) {
  return (
    <section className="mb-5">
      <div className="grid md:grid-cols-3 gap-3">
        {/* Краткая */}
        <button
          type="button"
          onClick={() => onChangeKind("short")}
          aria-pressed={kind === "short"}
          className={cnCard(
            kind === "short",
            "border-emerald-200",
            "hover:border-emerald-300"
          )}
        >
          <div className="text-[12px] uppercase tracking-[0.12em] text-emerald-700">
            Краткая заявка
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900">
            Только контакты и коротко суть проблемы.
          </div>
          <p className="mt-1 text-[12px] text-slate-600">
            Остальное администратор уточнит при созвоне и поможет
            оформить полную заявку.
          </p>
          <p className="mt-3 text-[11px] text-emerald-800 bg-emerald-50 rounded-2xl px-3 py-2">
            Рекомендуется как первый шаг, если вы не хотите сразу
            заполнять большую форму.
          </p>
        </button>

        {/* Подробная */}
        <button
          type="button"
          onClick={() => onChangeKind("full")}
          aria-pressed={kind === "full"}
          className={cnCard(
            kind === "full",
            "border-emerald-200",
            "hover:border-emerald-300"
          )}
        >
          <div className="text-[12px] uppercase tracking-[0.12em] text-emerald-700">
            Подробная онлайн-заявка
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900">
            Полное описание ситуации, выбор услуги и врача, удобная дата и
            время — всё в одной форме.
          </div>
          <p className="mt-1 text-[12px] text-slate-600">
            Для сложных и неясных случаев, когда важно учесть все детали.
          </p>
          <p className="mt-3 text-[11px] text-emerald-800 bg-emerald-50 rounded-2xl px-3 py-2">
            Оптимально, если вы готовы сразу приложить анализы и хотите
            получить максимально развернутый ответ.
          </p>
        </button>

        {/* Telegram — всегда голубая, не имеет состояния «выбрано» */}
        <button
          type="button"
          onClick={onTelegramClick}
          className="
            flex flex-col items-start rounded-3xl border border-sky-200 
            bg-sky-50 px-4 py-4 md:px-5 md:py-5 
            shadow-sm hover:shadow-[0_18px_40px_rgba(56,189,248,0.35)]
            transition-transform transition-shadow duration-150
            hover:-translate-y-[1px]
          "
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
              <img
                src="/img/free-icon-telegram-2111646.svg"
                alt="Telegram"
                className="w-4 h-4"
              />
            </div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-sky-800">
              Написать в Telegram
            </div>
          </div>
          <div className="mt-2 text-[13px] font-semibold text-slate-900">
            Можно сразу написать администратору, отправить анализы и
            задать вопросы по формату.
          </div>
          <p className="mt-1 text-[12px] text-slate-700">
            Подходит, если удобнее общаться в мессенджере.
          </p>
        </button>
      </div>

      <div className="mt-3 text-[12px] text-slate-600">
        Предпочитаете запись по телефону?{" "}
        <a href="tel:+79000000000" className="text-onlyvet-coral">
          Позвонить +7 900 000-00-00.
        </a>
      </div>
    </section>
  );
}

// утилита для карточек (краткая/подробная)
function cnCard(active: boolean, activeBorder: string, hoverBorder: string) {
  return [
    "rounded-3xl border px-4 py-4 md:px-5 md:py-5 text-left cursor-pointer",
    "transition-transform transition-shadow duration-150",
    "flex flex-col justify-between",
    active
      ? `bg-emerald-50 ${activeBorder} shadow-[0_18px_40px_rgba(15,23,42,0.08)] -translate-y-[1px]`
      : `bg-white border-slate-200 hover:${hoverBorder} hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]`,
  ].join(" ");
}
