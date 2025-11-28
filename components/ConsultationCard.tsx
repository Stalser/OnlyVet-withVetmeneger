// components/ConsultationCard.tsx

import Link from "next/link";

export type ConsultationStatus =
  | "pending"   // заявка отправлена
  | "in_review" // на рассмотрении
  | "scheduled" // запланирована
  | "done"      // проведена
  | "cancelled";

export type ConsultationCardProps = {
  id: string;
  createdAt: string;      // когда создана заявка
  petName: string;
  serviceName?: string;
  doctorName?: string;
  doctorId?: string;
  dateTime?: string;      // когда назначена консультация (если есть)
  status: ConsultationStatus;
  cancelReason?: string;
  isFollowUp?: boolean;   // повторная консультация по рекомендации врача
  showPetLink?: boolean;
  petId?: string;

  // колбэки — все опциональны, чтобы ничего не сломать
  onAddInfo?: () => void;
  onCancel?: () => void;
  onRequestReschedule?: () => void;
  onViewRecommendations?: () => void;
  onBookAgain?: () => void;
};

function statusMeta(status: ConsultationStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Заявка отправлена",
        description:
          "Заявка получена. Администратор проверит данные и свяжется с вами при необходимости.",
        className: "bg-slate-100 text-slate-700",
      };
    case "in_review":
      return {
        label: "Заявка на рассмотрении",
        description:
          "Регистратор и врач изучают предоставленные анализы и информацию.",
        className: "bg-amber-50 text-amber-700",
      };
    case "scheduled":
      return {
        label: "Консультация запланирована",
        description:
          "Дата и время консультации подтверждены. Мы дополнительно напомним о приёме.",
        className: "bg-teal-50 text-teal-700",
      };
    case "done":
      return {
        label: "Консультация проведена",
        description:
          "Приём завершён. Итоговые рекомендации и документы доступны в личном кабинете.",
        className: "bg-slate-100 text-slate-700",
      };
    case "cancelled":
      return {
        label: "Консультация отменена",
        description:
          "Консультация не состоится. При необходимости вы можете оформить новую заявку.",
        className: "bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: "Статус неизвестен",
        description: "",
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export function ConsultationCard(props: ConsultationCardProps) {
  const {
    id,
    createdAt,
    petName,
    serviceName,
    doctorName,
    doctorId,
    dateTime,
    status,
    cancelReason,
    isFollowUp,
    showPetLink = false,
    petId,
    onAddInfo,
    onCancel,
    onRequestReschedule,
    onViewRecommendations,
    onBookAgain,
  } = props;

  const meta = statusMeta(status);

  const createdLabel = new Date(createdAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const scheduledLabel =
    dateTime &&
    new Date(dateTime).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <article className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 flex flex-col gap-2 text-[13px]">
      {/* Верх: номер + статус */}
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-onlyvet-navy">
          Консультация #{id.toUpperCase()}
        </div>
        <span
          className={`px-2 py-[2px] rounded-full text-[11px] ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      {/* Основная информация */}
      <div className="text-[12px] text-slate-500">{createdLabel}</div>

      <div className="text-[12px] text-slate-600">
        Питомец:{" "}
        {showPetLink && petId ? (
          <Link
            href={`/account/pets/${petId}`}
            className="font-medium text-onlyvet-coral hover:underline"
          >
            {petName}
          </Link>
        ) : (
          <span className="font-medium">{petName}</span>
        )}
      </div>

      {serviceName && (
        <div className="text-[12px] text-slate-600">
          Услуга:{" "}
          <span className="font-medium">
            {serviceName}
            {isFollowUp && " (повторная консультация)"}
          </span>
        </div>
      )}

      {doctorName && (
        <div className="text-[12px] text-slate-600">
          Врач:{" "}
          {doctorId ? (
            <Link
              href={`/doctors/${doctorId}`}
              className="text-onlyvet-coral hover:underline"
            >
              {doctorName}
            </Link>
          ) : (
            <span className="font-medium">{doctorName}</span>
          )}
        </div>
      )}

      {scheduledLabel && (
        <div className="text-[12px] text-slate-600">
          Дата и время:{" "}
          <span className="font-medium">{scheduledLabel}</span>
        </div>
      )}

      {/* Описание статуса */}
      {meta.description && (
        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
          {meta.description}
        </p>
      )}

      {/* Причина отмены */}
      {status === "cancelled" && cancelReason && (
        <p className="mt-1 text-[11px] text-slate-500">
          Причина отмены: {cancelReason}
        </p>
      )}

      {/* Низ: действия */}
      <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
        {/* Заявка отправлена / на рассмотрении */}
        {(status === "pending" || status === "in_review") && (
          <>
            {onAddInfo && (
              <button
                type="button"
                onClick={onAddInfo}
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
              >
                Дополнить данные
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
              >
                Отменить заявку
              </button>
            )}
          </>
        )}

        {/* Запланирована */}
        {status === "scheduled" && (
          <>
            {onRequestReschedule && (
              <button
                type="button"
                onClick={onRequestReschedule}
                className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
              >
                Запросить перенос
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
              >
                Отменить консультацию
              </button>
            )}
          </>
        )}

        {/* Проведена */}
        {status === "done" && onViewRecommendations && (
          <button
            type="button"
            onClick={onViewRecommendations}
            className="px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
          >
            Посмотреть рекомендации
          </button>
        )}

        {/* Отменена */}
        {status === "cancelled" && onBookAgain && (
          <button
            type="button"
            onClick={onBookAgain}
            className="px-3 py-1.5 rounded-full bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
          >
            Записаться заново
          </button>
        )}
      </div>
    </article>
  );
}
