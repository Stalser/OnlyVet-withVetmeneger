// lib/vetmanagerClient.ts (фрагмент)

// ...

export async function createClient(opts: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone: string;
  email?: string;
}): Promise<VetmClient> {
  const digits = opts.phone.replace(/\D/g, "");

  const body = {
    first_name: opts.firstName || "",
    middle_name: opts.middleName || "",        // <<< отчество
    last_name: opts.lastName || "",
    cell_phone: digits,                         // только цифры
    email: opts.email || "",
    status: "TEMPORARY",
  };

  const resp = await vetmFetch<{ client: VetmClient }>("client", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!resp.success || !resp.data) {
    throw new Error("Не удалось создать клиента в Vetmanager");
  }

  const client = (resp.data as any).client || (resp.data as any);
  return client as VetmClient;
}
