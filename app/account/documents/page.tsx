// app/account/documents/page.tsx

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/AccountNav";

type ClientDocument = {
  id: string;
  category:
    | "contract"
    | "act"
    | "application"
    | "invoice"
    | "receipt"
    | "other";
  title: string;
  date: string;
  description?: string;
};

const demoClientDocs: ClientDocument[] = [
  {
    id: "c1",
    category: "contract",
    title: "Договор на оказание услуг онлайн-консультаций",
    date: "2025-01-10",
  },
  {
    id: "c2",
    category: "invoice",
    title: "Счёт за консультацию от 10.01.2025",
    date: "2025-01-10",
  },
  {
    id: "c3",
    category: "receipt",
    title: "Кассовый чек №12345",
    date: "2025-01-10",
  },
  {
    id: "c4",
    category: "application",
    title: "Заявление на сопровождение хронического пациента",
    date: "2025-02-01",
  },
];

export default function AccountDocumentsPage() {
  const contracts = demoClientDocs.filter((d) => d.category === "contract");
  const acts = demoClientDocs.filter((d) => d.category === "act");
  const applications = demoClientDocs.filter(
    (d) => d.category === "application"
  );
  const invoices = demoClientDocs.filter((d) => d.category === "invoice");
  const receipts = demoClientDocs.filter((d) => d.category === "receipt");
  const other = demoClientDocs.filter((d) => d.category === "other");

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-slate-50/70">
        <div className="container mx-auto max-w-5xl px-4 space-y-5">
          <div className="space-y-3">
            <nav className="text-[12px] text-slate-500 mb-1">
              <Link href="/" className="hover:text-onlyvet-coral">
                Главная
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:text-onlyvet-coral">
                Личный кабинет
              </Link>{" "}
              / <span className="text-slate-700">Документы клиента</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-1">
                  Документы клиента
                </h1>
                <p className="text-[13px] text-slate-600 max-w-2xl">
                  Здесь будут храниться ваши договоры, акты, заявления, счета,
                  чеки и другие документы, связанные с онлайн-консультациями.
                  Сейчас отображаются демонстрационные данные.
                </p>
              </div>
              <AccountNav />
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2 items-start">
            <div className="space-y-3">
              <ClientDocsBlock
                title="Договоры"
                docs={contracts}
                emptyText="Договоры пока не загружены."
              />
              <ClientDocsBlock
                title="Акты"
                docs={acts}
                emptyText="Акты пока не добавлены."
              />
              <ClientDocsBlock
                title="Заявления"
                docs={applications}
                emptyText="Заявления пока не добавлены."
              />
            </div>
            <div className="space-y-3">
              <ClientDocsBlock
                title="Счета"
                docs={invoices}
                emptyText="Счета пока не выставлялись."
              />
              <ClientDocsBlock
                title="Чеки"
                docs={receipts}
                emptyText="Чеки пока не добавлены."
              />
              <ClientDocsBlock
                title="Прочее"
                docs={other}
                emptyText="Прочие документы пока не добавлены."
              />
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 md:p-6 text-[13px] text-slate-700">
            <h2 className="text-[15px] font-semibold mb-2">
              Загрузка документов (будет позже)
            </h2>
            <p className="mb-2">
              В дальнейшем вы сможете загружать сюда документы самостоятельно:
              договоры, акты, заявления, подтверждения оплаты. Также сюда смогут
              выгружаться документы из Vetmanager автоматически.
            </p>
            <p className="text-[11px] text-slate-500">
              В демо-версии загрузка файлов недоступна. Сейчас важна структура и
              логика отображения.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ClientDocsBlock({
  title,
  docs,
  emptyText,
}: {
  title: string;
  docs: ClientDocument[];
  emptyText: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4">
      <div className="text-[13px] font-semibold mb-2">{title}</div>
      {docs.length === 0 ? (
        <p className="text-[12px] text-slate-500">{emptyText}</p>
      ) : (
        <ul className="space-y-1 text-[12px] text-slate-700">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex justify-between gap-2 border-b border-slate-100 py-1 last:border-b-0"
            >
              <div className="flex-1">
                <div className="font-medium">{d.title}</div>
                {d.description && (
                  <div className="text-[11px] text-slate-600">
                    {d.description}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-slate-500 whitespace-nowrap">
                {new Date(d.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
