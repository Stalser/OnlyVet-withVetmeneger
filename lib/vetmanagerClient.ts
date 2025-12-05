// lib/vetmanagerClient.ts
// Клиент для Vetmanager REST API. Использовать ТОЛЬКО на сервере (API routes / server components).

const VETM_DOMAIN = process.env.VETM_DOMAIN;        // например: https://onlyvet.vetmanager.ru
const VETM_API_KEY = process.env.VETM_API_KEY;      // REST API key из настроек Vetmanager

// Временные логи, чтобы убедиться, что env подхватились (видно в логах билда / сервера)
console.log("[Vetmanager] VETM_DOMAIN:", VETM_DOMAIN);
console.log("[Vetmanager] VETM_API_KEY exists:", !!VETM_API_KEY);

if (!VETM_DOMAIN || !VETM_API_KEY) {
  console.warn("[Vetmanager] VETM_DOMAIN или VETM_API_KEY не заданы в env.");
}

type VetmResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

async function vetmFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<VetmResponse<T>> {
  if (!VETM_DOMAIN || !VETM_API_KEY) {
    throw new Error(
      "Vetmanager API не сконфигурирован (нет VETM_DOMAIN или VETM_API_KEY)."
    );
  }

  const url = `${VETM_DOMAIN}/rest/api/${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-REST-API-KEY": VETM_API_KEY,
      "X-REST-TIME-ZONE": "Europe/Moscow",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Vetmanager] HTTP error", res.status, text);
    throw new Error(`Vetmanager API error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as VetmResponse<T>;
  if (!json.success) {
    console.error("[Vetmanager] API response not success", json);
  }
  return json;
}

/* ===========
   Типы
   =========== */

export interface VetmClient {
  id: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  cell_phone?: string;
  home_phone?: string;
  work_phone?: string;
  email?: string;
  status?: string;
}

export interface VetmPet {
  id: number;
  alias: string; // кличка
  owner_id: number;
  birthday?: string;
  sex?: string;
}

/* ===========
   Клиенты
   =========== */

// Поиск клиента по телефону (по докам можно подправить фильтр при необходимости)
export async function searchClientByPhone(
  phone: string
): Promise<VetmClient | null> {
  const digits = phone.replace(/\D/g, "");

  const filter = encodeURIComponent(
    JSON.stringify([
      {
        property: "phone",
        value: digits,
        operator: "=", // при необходимости поменяем по докам
      },
    ])
  );

  const resp = await vetmFetch<{ totalCount: number; data: VetmClient[] }>(
    `client?filter=${filter}`
  );

  if (!resp.success || !resp.data) return null;
  const list = (resp.data as any).data || (resp.data as any);
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0] as VetmClient;
}

// Создание клиента
export async function createClient(opts: {
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
}): Promise<VetmClient> {
  const body = {
    first_name: opts.firstName || "",
    last_name: opts.lastName || "",
    cell_phone: opts.phone.replace(/\D/g, ""),
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

// Найти или создать клиента по телефону
export async function findOrCreateClientByPhone(opts: {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}: Promise<VetmClient> {
  const existing = await searchClientByPhone(opts.phone).catch(() => null);
  if (existing) return existing;
  return await createClient(opts);
}

/* ===========
   Питомцы
   =========== */

export async function getPetsByClientId(clientId: number): Promise<VetmPet[]> {
  const filter = encodeURIComponent(
    JSON.stringify([{ property: "owner_id", value: clientId, operator: "=" }])
  );

  const resp = await vetmFetch<{ data: VetmPet[] }>(`pet?filter=${filter}`);
  if (!resp.success || !resp.data) return [];
  const list = (resp.data as any).data || (resp.data as any);
  return Array.isArray(list) ? (list as VetmPet[]) : [];
}

// Получить питомца по ID
export async function getPetById(id: number): Promise<VetmPet | null> {
  const resp = await vetmFetch<{ pet: VetmPet }>(`pet/${id}`);
  if (!resp.success || !resp.data) return null;
  const pet = (resp.data as any).pet || (resp.data as any);
  if (!pet) return null;
  return pet as VetmPet;
}

/* ===========
   VmLink — личный кабинет Vetmanager
   =========== */

export async function getPersonalAccountLinkByClientId(
  clientId: number
): Promise<string | null> {
  if (!VETM_DOMAIN || !VETM_API_KEY) return null;

  const url = `${VETM_DOMAIN}/rest/api/VmLink/personalAccountLinkByClientId/${clientId}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-REST-API-KEY": VETM_API_KEY,
      "X-REST-TIME-ZONE": "Europe/Moscow",
    },
  });

  if (!res.ok) {
    console.error("[Vetmanager] VmLink error", res.status);
    return null;
  }

  const json = (await res.json()) as {
    success: boolean;
    data?: {
      vetmanagerLink?: { personal_link?: string };
    };
  };

  if (!json.success || !json.data?.vetmanagerLink?.personal_link) return null;
  return json.data.vetmanagerLink.personal_link;
}
