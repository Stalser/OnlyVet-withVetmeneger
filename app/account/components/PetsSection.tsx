// app/account/components/PetsSection.tsx
"use client";

/**
 * ВРЕМЕННЫЙ вариант секции "Питомцы".
 *
 * ВАЖНО:
 *  - НИКУДА не ходит (ни в Vetmanager, ни в Supabase),
 *  - Просто показывает информативный текст,
 *  - Никаких запросов, ошибок и дублей клиентов.
 *
 * Как только будет готова стабильная интеграция с Vetmanager,
 * сюда вернём реальную загрузку питомцев.
 */

export default function PetsSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 md:p-5 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-semibold">
            Ваши питомцы
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xl">
            В этом разделе будут отображаться питомцы из вашей карты клиента в
            клинике: имя, вид, возраст и основная медицинская информация.
            Список будет синхронизироваться с данными врачей в Vetmanager.
          </p>
        </div>
      </div>

      {/* Информационный блок вместо реальной загрузки */}
      <div className="bg-onlyvet-bg border border-dashed border-slate-300 rounded-2xl px-4 py-4 text-[12px] text-slate-700 space-y-2">
        <p className="font-medium text-slate-800">
          Связка с клиникой ещё настраивается.
        </p>
        <p>
          Сейчас этот раздел работает в демонстрационном режиме. Как только
          интеграция с медицинской системой клиники будет включена, здесь
          автоматически появятся ваши питомцы из карты клиента.
        </p>
        <p className="text-[11px] text-slate-500">
          Если вам нужно уточнить информацию по питомцу или добавить новые
          данные уже сейчас — просто напишите администратору клиники, как
          обычно.
        </p>
      </div>
    </section>
  );
}
