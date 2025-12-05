"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

type ConsultationStatus = "new" | "in_progress" | "done" | "cancelled";

type ConsultationRow = {
  id: string;
  pet_id: string | null;
  status: ConsultationStatus;
  service_id: string | null;
  planned_at: string | null;
  complaint: string | null;
  created_at: string;
};

type NormalizedConsultation = {
  id: string;
  petName: string | null;
  serviceName: string;
  dateLabel: string;
  status: ConsultationStatus;
  complaint?: string | null;
};

function normalizeConsultation(row: ConsultationRow): NormalizedConsultation {
  const rawDate = row.planned_at || row.created_at;
  const d = new Date(rawDate);

  const dateLabel = d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let serviceName = "Онлайн-консультация";
  if (row.service_id) {
    serviceName = row.service_id; // позже заменим на lookup по услугам
  }

  return {
    id: row.id,
    petName: null, // динамическая привязка к pets добавится позже
    serviceName,
    dateLabel,
    status: row.status,
    complaint: row.complaint,
  };
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
      cancelled: {
        label: "Отменена",
        className: "bg-slate-50 text-slate-600 border-slate-200",
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

export default function ConsultationsSection() {
  const supabase = getSupabaseClient();

  const [items, setItems] = useState<NormalizedConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Берём текущего пользователя
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (authError || !user) {
          setError("Не удалось определить пользователя.");
          setItems([]);
          return;
        }

        // Грузим консультации этого владельца
        const { data, error } = await supabase
          .from("consultations")
          .select(
            "id, pet_id, status, service_id, planned_at, complaint, created_at"
          )
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (error) {
          console.error("[Consultations] Supabase error:", error);
          setError("Не удалось загрузить список консультаций.");
          setItems([]);
          return;
        }

        const rows = (data || []) as ConsultationRow[];
        const normalized = rows.map(normalizeConsultation);
        setItems(normalized);
      } catch (err) {
        console.error("[Consultations] unexpected error:", err);
        if (!cancelled) {
          setError("Техническая ошибка при загрузке консультаций.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши консультации
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            Ниже — список ваших заявок и онлайн-консультаций в OnlyVet. В
            дальнейшем здесь будут данные, синхронизированные с Vetmanager.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-onlyvet-coral text-white shadow-[0_8px_20px_rgba(247,118,92,0.5)] hover:brightness-105 transition"
        >
          Новая консультация
        </Link>
      </div>

      {loading ? (
        <p className="text-[12px] text-slate-500">
          Загружаем список консультаций…
        </p>
      ) : error ? (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2">
          {error}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[12px] text-slate-500">
          У вас пока нет консультаций. Вы можете оставить первую заявку через
          форму записи.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 text-[13px]">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3"
            >
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">
                  {c.serviceName}
                </div>
                {c.petName && (
                  <div className="text-slate-600">
                    Питомец:{" "}
                    <span className="font-medium">{c.petName}</span>
                  </div>
                )}
                <div className="text-[12px] text-slate-500">
                  Дата и время: {c.dateLabel}
                </div>
                {c.complaint && (
                  <div className="text-[12px] text-slate-600 line-clamp-2">
                    Жалобы: {c.complaint}
                  </div>
                )}
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
      )}
    </section>
  );
}
