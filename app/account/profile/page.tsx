// app/account/profile/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

export default function AccountProfilePage() {
  // Пока демо-данные. В будущем здесь будут реальные данные пользователя
  const user = {
    name: "Иванов Иван Иванович",
    phone: "+7 900 000-00-00",
    email: "user@example.com",
    telegram: "@ivanov",
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          {/* Хлебные крошки + заголовок */}
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              / <span className="text-slate-700">Настройки профиля</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Настройки профиля
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl">
                  Контактные данные, предпочитаемый способ связи и базовые
                  настройки уведомлений. Сейчас раздел работает в
                  демонстрационном режиме — данные не сохраняются в базу и
                  служат для иллюстрации.
                </p>
              </div>
              <AccountNav />
            </div>
          </div>

          {/* Контактные данные */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                Контактные данные
              </h2>
              <p className="text-[12px] text-slate-600">
                Эти данные используются для связи по поводу заявок и
                консультаций. В дальнейшем здесь можно будет редактировать их
                самостоятельно.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-[13px]">
              <div className="space-y-1">
                <div className="text-[12px] text-slate-500">ФИО</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {user.name}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-slate-500">Телефон</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {user.phone}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-slate-500">Email</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {user.email}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-slate-500">Telegram</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {user.telegram}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              В дальнейшем здесь появится возможность редактировать данные,
              задавать предпочтительный канал связи и подтверждать контакты.
            </p>
          </section>

          {/* Настройки уведомлений */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-1">
                Настройки уведомлений (демо)
              </h2>
              <p className="text-[12px] text-slate-600">
                Здесь в будущем можно будет управлять уведомлениями о заявках,
                напоминаниями о консультациях и сообщениями сервиса. Сейчас
                настройки носят демонстрационный характер и не сохраняются.
              </p>
            </div>

            <div className="space-y-2 text-[13px] text-slate-700">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-[2px]"
                />
                <span>
                  Уведомлять о подтверждении/изменении заявки на консультацию{" "}
                  <span className="text-slate-500">
                    (по email и, при наличии, в Telegram)
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-[2px]"
                />
                <span>
                  Напоминать о предстоящей онлайн-консультации{" "}
                  <span className="text-slate-500">
                    (за 24 часа и за 1 час до приёма)
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  readOnly
                  className="mt-[2px]"
                />
                <span>
                  Получать редкие обновления сервиса OnlyVet{" "}
                  <span className="text-slate-500">
                    (важные изменения, новые форматы работы)
                  </span>
                </span>
              </label>
            </div>

            <p className="text-[11px] text-slate-500">
              Фактические настройки уведомлений будут завязаны на реальные
              контакты и, при необходимости, интеграцию сVetmanager и
              мессенджерами. Сейчас раздел показывает предполагаемую
              структуру.
            </p>
          </section>

          {/* Блок про персональные данные */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[12px] text-slate-600 space-y-2">
            <div className="font-semibold text-[13px] text-slate-800">
              Персональные данные и безопасность
            </div>
            <p>
              Обработка персональных данных осуществляется в соответствии с{" "}
              <Link
                href="/docs/privacy"
                className="text-onlyvet-coral hover:underline"
              >
                политикой обработки персональных данных
              </Link>
              . При переходе к “боевому” режиму отдельное согласие будет
              оформляться при регистрации и оформлении заявок.
            </p>
            <p>
              Важно: в онлайн-формате мы стараемся собирать только те данные,
              которые действительно нужны для корректной связи и безопасной
              консультации.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
