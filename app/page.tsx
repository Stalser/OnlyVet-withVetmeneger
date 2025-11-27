{/* Соцсети */}
<section className="py-7">
  <div className="container mx-auto max-w-5xl px-4">
    <div className="flex items-baseline justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold">
          Мы в социальных сетях
        </h2>
        <p className="text-[13px] text-slate-600 max-w-xl">
          Спокойные, полезные и понятные материалы для владельцев животных:
          разбор анализов, разбор случаев, рекомендации по уходу.
        </p>
      </div>
    </div>
    <div className="grid gap-3 md:grid-cols-4">
      <a
        href="#"
        className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0077FF] text-white flex items-center justify-center text-xs font-semibold">
            VK
          </div>
          <div className="text-[13px] font-semibold">ВКонтакте</div>
        </div>
        <div className="text-[12px] text-slate-600">
          Новости OnlyVet, объяснения анализов и разборы клинических случаев.
        </div>
      </a>

      <a
        href="#"
        className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#27A7E7] text-white flex items-center justify-center text-xs font-semibold">
            TG
          </div>
          <div className="text-[13px] font-semibold">Telegram</div>
        </div>
        <div className="text-[12px] text-slate-600">
          Канал с разбором сложных пациентов и ответами на частые вопросы.
        </div>
      </a>

      <a
        href="#"
        className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E1306C] text-white flex items-center justify-center text-xs font-semibold">
            IG
          </div>
          <div className="text-[13px] font-semibold">Instagram*</div>
        </div>
        <div className="text-[12px] text-slate-600">
          Истории пациентов, визуальные подсказки и наглядные схемы для
          владельцев.
        </div>
      </a>

      <a
        href="#"
        className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-soft transition-shadow"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4731C] text-white flex items-center justify-center text-xs font-semibold">
            ОК
          </div>
          <div className="text-[13px] font-semibold">Одноклассники</div>
        </div>
        <div className="text-[12px] text-slate-600">
          Полезные советы и ответы в привычном для многих формате.
        </div>
      </a>
    </div>

    {/* Сноска про Instagram/Meta */}
    <p className="mt-2 text-[10px] text-slate-400 max-w-xl">
      * Instagram принадлежит компании Meta Platforms Inc., деятельность
      которой запрещена на территории Российской Федерации как
      экстремистская организация.
    </p>
  </div>
</section>
