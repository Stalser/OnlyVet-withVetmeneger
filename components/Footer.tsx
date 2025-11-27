export function Footer() {
  return (
    <footer className="mt-auto bg-onlyvet-navy text-white text-xs py-6">
      <div className="container mx-auto max-w-5xl px-4 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4">
          {/* Левая колонка — бренд и описание */}
          <div className="max-w-xs">
            <div className="text-[11px] tracking-[0.18em] uppercase text-slate-300 mb-1">
              ONLYVET
            </div>
            <div className="text-[13px]">
              Ветеринарная онлайн-клиника для тех, кому важны доказательная
              медицина, спокойное объяснение и понятный план лечения.
            </div>
          </div>

          {/* Средняя — навигация по документам */}
          <div>
            <div className="font-semibold text-[13px] mb-2">Документы</div>
            <ul className="space-y-1 text-[13px] text-slate-200">
              <li>
                <a href="/docs/rules">Правила онлайн-клиники</a>
              </li>
              <li>
                <a href="/docs/offer">Публичная оферта</a>
              </li>
              <li>
                <a href="/docs/privacy">Политика обработки ПДн</a>
              </li>
              <li>
                <a href="/docs/cookies">Политика использования cookies</a>
              </li>
            </ul>
          </div>

          {/* Правая — контакты и соцсети */}
          <div>
            <div className="font-semibold text-[13px] mb-2">Контакты</div>
            <div className="text-[13px] text-slate-200 space-y-1 mb-2">
              <div>Почта: support@onlyvet.ru</div>
              <div>Для сотрудничества: partners@onlyvet.ru</div>
            </div>
            <div className="font-semibold text-[13px] mb-1">
              Мы в социальных сетях
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a
                href="#"
                className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-100"
              >
                ВКонтакте
              </a>
              <a
                href="#"
                className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-100"
              >
                Telegram
              </a>
              <a
                href="#"
                className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-100"
              >
                Instagram*
              </a>
              <a
                href="#"
                className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-100"
              >
                Одноклассники
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 border-t border-slate-700 pt-3 text-[11px] text-slate-300">
          <div>© OnlyVet, 2025. Все права защищены.</div>
          <div className="text-right">
            Онлайн-консультации не заменяют очный прием. В экстренных
            ситуациях немедленно обращайтесь в ближайшую круглосуточную
            клинику.
          </div>
        </div>
      </div>
    </footer>
  );
}
