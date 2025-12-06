// app/account/components/ProfileSection.tsx
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

type Props = {
  currentUserName: string;
  currentUserEmail: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  last_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  phone: string | null;
  telegram: string | null;
};

export default function ProfileSection({
  currentUserName,
  currentUserEmail,
}: Props) {
  const supabase = getSupabaseClient();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // ФИО раздельно
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [noMiddleName, setNoMiddleName] = useState<boolean>(false);

  // Контакты
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>(currentUserEmail || "");
  const [telegram, setTelegram] = useState<string>("");

  // Статус сохранения
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Технический: id пользователя
  const [userId, setUserId] = useState<string | null>(null);

  // ===== Загрузка профиля из Supabase =====
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // 1. Текущий пользователь
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (userError) {
          console.error("[Profile] getUser error:", userError);
          return;
        }
        if (!user) {
          console.warn("[Profile] no auth user");
          return;
        }

        setUserId(user.id);

        const meta = (user.user_metadata || {}) as any;

        // 2. Берём профиль из public.profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, email, full_name, last_name, first_name, middle_name, phone, telegram"
          )
          .eq("id", user.id)
          .maybeSingle<ProfileRow>();

        if (profileError) {
          console.error("[Profile] load profile error:", profileError);
        }

        // 3. ФИО / контакты — приоритет у profiles, fallback к meta / user
        const last =
          profile?.last_name ??
          meta.last_name ??
          (profile?.full_name || "").split(" ")[0] ??
          "";
        const first =
          profile?.first_name ??
          meta.first_name ??
          (profile?.full_name || "").split(" ")[1] ??
          "";
        const middle =
          profile?.middle_name ??
          meta.middle_name ??
          (profile?.full_name || "").split(" ")[2] ??
          "";

        setLastName(last);
        setFirstName(first);
        setMiddleName(middle);
        setNoMiddleName(!middle);

        const phoneFromProfile = profile?.phone ?? meta.phone ?? "";
        setPhone(phoneFromProfile || "");

        const tg = profile?.telegram ?? meta.telegram ?? "";
        setTelegram(tg || "");

        const emailFromProfile = profile?.email ?? user.email ?? "";
        setEmail(emailFromProfile);

        // Аватар — только из мета
        if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
      } catch (err) {
        if (!cancelled) {
          console.error("[Profile] unexpected load error:", err);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // ===== Аватар =====
  const displayName =
    [lastName, firstName, !noMiddleName && middleName]
      .filter(Boolean)
      .join(" ") || currentUserName || currentUserEmail || "Пользователь";

  const initialLetter =
    displayName.trim().charAt(0).toUpperCase() || "U";

  const handleAvatarChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarError(null);

    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAvatarError("Не удалось определить пользователя.");
        setAvatarLoading(false);
        return;
      }

      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setAvatarError(uploadError.message || "Не удалось загрузить файл.");
        setAvatarLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (updateError) {
        setAvatarError(
          updateError.message || "Не удалось сохранить ссылку на аватар."
        );
        setAvatarLoading(false);
        return;
      }

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error("[Profile] avatar upload error:", err);
      setAvatarError("Техническая ошибка при загрузке аватара.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // ===== Сохранение профиля =====
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (!userId) {
        setSaveError("Не удалось определить пользователя.");
        setSaving(false);
        return;
      }

      const fullName = [lastName, firstName, !noMiddleName && middleName]
        .filter(Boolean)
        .join(" ");

      const phoneTrimmed = phone.trim() || null;
      const telegramTrimmed = telegram.trim() || null;

      // 1. Обновляем public.profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          last_name: lastName || null,
          first_name: firstName || null,
          middle_name: noMiddleName ? null : middleName || null,
          phone: phoneTrimmed,
          telegram: telegramTrimmed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        console.error("[Profile] update profiles error:", profileError);
        setSaveError("Не удалось сохранить изменения в профиле.");
        setSaving(false);
        return;
      }

      // 2. Обновляем user_metadata в auth (но НЕ email)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || null,
          last_name: lastName || null,
          first_name: firstName || null,
          middle_name: noMiddleName ? null : middleName || null,
          phone: phoneTrimmed,
          telegram: telegramTrimmed,
        },
      });

      if (authError) {
        console.error("[Profile] update auth user error:", authError);
        setSaveError("Не удалось обновить данные аккаунта.");
        setSaving(false);
        return;
      }

      setSaveSuccess("Изменения сохранены.");
      // сбросим сообщение через пару секунд
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error("[Profile] save error:", err);
      setSaveError("Техническая ошибка при сохранении профиля.");
    } finally {
      setSaving(false);
    }
  };

  // ===== Рендер =====
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div>
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-1">
          Профиль
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl">
          Здесь можно изменить контактные данные, фото профиля и базовые
          настройки аккаунта. ФИО хранится раздельно, телефон — в удобном
          формате, чтобы потом связать это с Vetmanager.
        </p>
      </div>

      {/* Аватар */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center text-[20px] font-semibold text-slate-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initialLetter
            )}
          </div>
          <div className="space-y-1 text-[12px] text-slate-600">
            <div className="font-medium text-slate-800">Фото профиля</div>
            <p>
              Это фото будет отображаться в шапке и в карточках консультаций.
              Рекомендуемый размер: 400×400px.
            </p>
            {avatarError && (
              <p className="text-[11px] text-rose-600">{avatarError}</p>
            )}
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 text-[12px]">
          <label className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 cursor-pointer hover:bg-slate-50 transition">
            {avatarLoading ? "Загружаем..." : "Загрузить новое фото"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={avatarLoading}
            />
          </label>
        </div>
      </div>

      {/* Раздельное ФИО + контакты */}
      <div className="pt-3 border-t border-slate-100 mt-2 space-y-3 text-[13px]">
        {/* ФИО */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Фамилия
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            />
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Имя
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            />
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Отчество
            </label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              disabled={noMiddleName}
              className={`w-full rounded-xl border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 ${
                noMiddleName
                  ? "border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-300 focus:ring-onlyvet-teal/40"
              }`}
              placeholder={noMiddleName ? "Не указано" : "Игоревич"}
            />
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
              <input
                type="checkbox"
                id="no-middle-name-profile"
                checked={noMiddleName}
                onChange={(e) => setNoMiddleName(e.target.checked)}
                className="rounded border-slate-300"
              />
              <label
                htmlFor="no-middle-name-profile"
                className="select-none cursor-pointer"
              >
                Нет отчества
              </label>
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
              placeholder="+7 ..."
            />
          </div>

          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] bg-slate-50 text-slate-500"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Изменение email пока выполняется через поддержку, чтобы не
              ломать подтверждённый доступ к аккаунту.
            </p>
          </div>
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-[12px] text-slate-600 mb-1">
            Telegram
          </label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-onlyvet-teal/40"
            placeholder="@username"
          />
        </div>
      </div>

      {/* Статус сохранения */}
      {saveError && (
        <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
          {saveSuccess}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-[12px]">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`
            px-4 py-2 rounded-full font-medium
            ${
              saving
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-onlyvet-coral text-white shadow-[0_10px_26px_rgba(247,118,92,0.45)] hover:brightness-105 transition"
            }
          `}
        >
          {saving ? "Сохраняем..." : "Сохранить изменения"}
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
