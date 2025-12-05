// app/account/components/NotificationsSection.tsx
"use client";

type NotificationSettings = {
  email: {
    address: string;
    serviceEvents: boolean;
    medicalEvents: boolean;
    billingEvents: boolean;
    reminderEvents: boolean;
  };
  telegram: {
    connected: boolean;
    username: string;
    serviceEvents: boolean;
    medicalEvents: boolean;
    billingEvents: boolean;
    reminderEvents: boolean;
  };
};

export default function NotificationsSection({
  settings,
}: {
  settings: NotificationSettings;
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
          каналам. Сейчас данные демонстрационные; позже они будут связаны с
          вашим профилем и Vetmanager.
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
          В дальнейшем вы сможете получать уведомления от OnlyVet через
          Telegram-бота (например, напоминания о повторных анализах).
        </p>

        <div className="grid md:grid-cols-2 gap-2 text-[12px] text-slate-700 opacity-70">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={telegram.serviceEvents}
              readOnly
            />
            <span>Сервисные уведомления</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={telegram.medicalEvents}
              readOnly
            />
            <span>Медицинские события</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={telegram.billingEvents}
              readOnly
            />
            <span>Финансовые уведомления</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={telegram.reminderEvents}
              readOnly
            />
            <span>Напоминания</span>
          </label>
        </div>
      </div>
    </section>
  );
}
