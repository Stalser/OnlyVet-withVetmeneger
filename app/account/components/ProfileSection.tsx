"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import PhoneInput from "@/components/PhoneInput";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type Props = {
  user: SupabaseUser;
};

export default function ProfileSection({ user }: Props) {
  const supabase = getSupabaseClient();

  const meta = (user.user_metadata || {}) as any;

  // Аватар
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    meta.avatar_url || null
  );
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // ФИО раздельно
  const [lastName, setLastName] = useState(meta.last_name || "");
  const [firstName, setFirstName] = useState(meta.first_name || "");
  const [middleName, setMiddleName] = useState(meta.middle_name || "");
  const [noMiddleName, setNoMiddleName] = useState<boolean>(
    !meta.middle_name && !meta.full_name
  );

  // Контакты
  const [phone, setPhone] = useState<string>(meta.phone || "");
  const [email, setEmail] = useState<string>(user.email || "");
  const [telegram, setTelegram] = useState<string>(meta.telegram || "");

  // Статусы
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Подтягиваем свежие данные пользователя из Supabase на всякий случай
  useEffect(() => {
    let cancelled = false;

    const refreshUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;

      const m = (data.user.user_metadata || {}) as any;

      if (m.avatar_url) setAvatarUrl(m.avatar_url);
      if (m.last_name) setLastName(m.last_name);
      if (m.first_name) setFirstName(m.first_name);
      if (m.middle_name) setMiddleName(m.middle_name);
      if (m.phone) setPhone(m.phone);
      if (m.telegram) setTelegram(m.telegram);
    };

    refreshUser();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const displayName =
    [lastName, firstName, !noMiddleName && middleName]
      .filter(Boolean)
      .join(" ") || user.email || "Пользователь";

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
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setAvatarError("Не удалось определить пользователя.");
        setAvatarLoading(false);
        return;
      }

      const authUser = userData.user;
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${authUser.id}/${Date.now()}.${ext}`;

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
      console.error(err);
      setAvatarError("Техническая ошибка при загрузке аватара.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const fullName = [lastName, firstName, !noMiddleName && middleName]
        .filter(Boolean)
        .join(" ");

      const { error } = await supabase.auth.updateUser({
        // email сознательно не меняем здесь,
        // во избежание сложностей с повторным подтверждением
        data: {
          full_name: fullName || null,
          last_name: lastName || null,
          first_name: firstName || null,
          middle_name: noMiddleName ? null : middleName || null,
          phone: phone || null,
          telegram: telegram || null,
        },
      });

      if (error) {
        setSaveError(
          error.message || "Не удалось сохранить изменения профиля."
        );
        return;
      }

      setSaveSuccess("Изменения сохранены.");
    } catch (err) {
      console.error(err);
      setSaveError("Техническая ошибка при сохранении профиля.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-4">
      <div>
        <h2 className="text-[15px] md:text-[16px] font-semibold mb-1">
          Профиль
        </h2>
        <p className="text-[12px] text-slate-600 max-w-2xl">
          Здесь можно изменить контактные данные, фото профиля и базовые
          настройки аккаунта. ФИО хранится раздельно, телефон — в международном
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

      {/* ФИО раздельно */}
      <div className="pt-3 border-t border-slate-100 mt-2 space-y-3 text-[13px]">
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
              placeholder={noMiddleName ? "Не указано" : "Иванович"}
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

        {/* Телефон */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <PhoneInput
              label="Телефон (международный формат)"
              value={phone}
              onChange={setPhone}
              required
            />
          </div>

          {/* Email — пока только отображение, без изменения в Supabase */}
          <div>
            <label className="block text-[12px] text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-[13px] bg-slate-50 text-slate-500"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Изменение email пока выполняется через поддержку, чтобы не
              ломать доступ к аккаунту и подтверждение входа.
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
