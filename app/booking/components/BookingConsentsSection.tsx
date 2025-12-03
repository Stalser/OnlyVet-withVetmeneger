"use client";

import Link from "next/link";

type BookingConsentsSectionProps = {
  consentPersonalData: boolean;
  consentOffer: boolean;
  consentRules: boolean;
  setConsentPersonalData: (v: boolean) => void;
  setConsentOffer: (v: boolean) => void;
  setConsentRules: (v: boolean) => void;
  consentsError: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

export function BookingConsentsSection({
  consentPersonalData,
  consentOffer,
  consentRules,
  setConsentPersonalData,
  setConsentOffer,
  setConsentRules,
  consentsError,
  isValid,
  isSubmitting,
}: BookingConsentsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">
        Согласия и завершение заявки
      </h2>

      <div className="space-y-2 text-[12px] text-slate-600">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consentPersonalData}
            onChange={(e) => setConsentPersonalData(e.target.checked)}
            className="mt-[2px]"
          />
          <span>
            Я даю{" "}
            <Link
              href="/docs/privacy"
              className="text-onlyvet-coral underline-offset-2 hover:underline"
            >
              согласие на обработку персональных данных
            </Link>{" "}
            в соответствии с Политикой обработки ПДн.
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consentOffer}
            onChange={(e) => setConsentOffer(e.target.checked)}
            className="mt-[2px]"
          />
          <span>
            Я подтверждаю, что, нажимая кнопку «Записаться», заключаю договор
            в соответствии с{" "}
            <Link
              href="/docs/offer"
              className="text-onlyvet-coral underline-offset-2 hover:underline"
            >
              публичной офертой
            </Link>{" "}
            сервиса OnlyVet.
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consentRules}
            onChange={(e) => setConsentRules(e.target.checked)}
            className="mt-[2px]"
          />
          <span>
            Я ознакомлен(а) и согласен(на) с{" "}
            <Link
              href="/docs/rules"
              className="text-onlyvet-coral underline-offset-2 hover:underline"
            >
              правилами онлайн-клиники
            </Link>
            .
          </span>
        </label>

        {consentsError && (
          <p className="text-[11px] text-rose-600">
            Для отправки заявки необходимо отметить все согласия.
          </p>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`
            w-full px-4 py-2.5 rounded-full text-[13px] font-medium
            ${
              !isValid || isSubmitting
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-onlyvet-coral text-white shadow-[0_12px_32px_rgba(247,118,92,0.6)] hover:brightness-105 transition"
            }
          `}
        >
          {isSubmitting
            ? "Отправляем заявку..."
            : "Записаться на консультацию"}
        </button>
        <p className="mt-2 text-[11px] text-slate-500">
          Нажимая «Записаться», вы подтверждаете корректность указанных данных.
          После обработки заявки с вами свяжется администратор.
        </p>
      </div>
    </section>
  );
}
