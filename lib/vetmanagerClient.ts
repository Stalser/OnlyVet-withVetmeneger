// lib/vetmanagerClient.ts
//
// Клиент для Vetmanager REST API.
// Важно: использовать ТОЛЬКО на сервере (API routes / server actions), НИКОГДА не на клиенте,
// потому что здесь используется секретный API-ключ.

const VETM_DOMAIN = process.env.VETM_DOMAIN; // например: "https://example.vetmanager.cloud"
const VETM_API_KEY = process.env.VETM_API_KEY; // сервисный API-ключ из Vetmanager

if (!VETM_DOMAIN || !VETM_API_KEY) {
  // Лучше не падать в рантайме фронта, а явно сигнализировать в логах.
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
    throw new Error("Vetmanager API не сконфигурирован (нет DOMAIN или API_KEY).");
  }

  const url = `${VETM_DOMAIN}/rest/api/${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-REST-API-KEY": VETM_API_KEY,
      // опционально: временная зона клиники
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

/* =====================
   Типы для Client / Pet
   ===================== */

export interface VetmClient {
  id: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  cell_phone?: string; // основной телефон
  home_phone?: string;
  work_phone?: string;
  email?: string;
  status?: string;
  // и т. д. — можно дополнить по необходимости
}

export interface VetmPet {
  id: number;
  alias: string; // кличка
  owner_id: number;
  birthday?: string;
  sex?: string;
  // ...
}

/* =====================
   Клиенты (Client)
   ===================== */

// Поиск клиента по телефону.
// Документация: есть эндпоинт поиска по клиентам; в Postman колекции есть client/clientsSearchData
export async function searchClientByPhone(
  phone: string
): Promise<VetmClient | null> {
  // Важно: телефон нормализовать (убрать пробелы, +, скобки) — это лучше делать до вызова.
  const filter = encodeURIComponent(
    JSON.stringify([
      {
        property: "phone",
        value: phone.replace(/\D/g, ""),
        operator: "=", // в доках могут быть разные операторы, уточнить потом
      },
    ])
  );

  // Примерный путь; конкретный эндпоинт поиска можно взять из Postman коллекции Vetmanager.
  const resp = await vetmFetch<{ totalCount: number; data: VetmClient[] }>(
    `client?filter=${filter}`
  );

  if (!resp.success || !resp.data) return null;
  const list = resp.data.data || (resp.data as any); // зависит от структуры ответа
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0];
}

// Создание клиента
// Документация: POST /rest/api/client
export async function createClient(opts: {
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
}): Promise<VetmClient> {
  const body = {
    // структура зависит от модели Client в Vetmanager, это пример
    first_name: opts.firstName || "",
    last_name: opts.lastName || "",
    cell_phone: opts.phone.replace(/\D/g, ""),
    email: opts.email || "",
    status: "TEMPORARY", // можно использовать временный статус для заявок
  };

  const resp = await vetmFetch<{ client: VetmClient }>("client", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!resp.success || !resp.data) {
    throw new Error("Не удалось создать клиента в Vetmanager");
  }

  // В реальном ответе может быть другой формат — поправим, когда подключим настоящий API
  const client = (resp.data as any).client || (resp.data as any);
  return client;
}

// Найти или создать клиента по телефону (анти-дубликаты)
export async function findOrCreateClientByPhone(opts: {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<VetmClient> {
  const existing = await searchClientByPhone(opts.phone).catch(() => null);
  if (existing) {
    return existing;
  }
  return await createClient(opts);
}

/* =====================
   Питомцы (Pet)
   ===================== */

// Список питомцев клиента
export async function getPetsByClientId(clientId: number): Promise<VetmPet[]> {
  const filter = encodeURIComponent(
    JSON.stringify([{ property: "owner_id", value: clientId, operator: "=" }])
  );

  const resp = await vetmFetch<{ data: VetmPet[] }>(`pet?filter=${filter}`);
  if (!resp.success || !resp.data) return [];
  const list = (resp.data as any).data || (resp.data as any);
  return Array.isArray(list) ? list : [];
}

// Создать питомца
export async function createPet(opts: {
  clientId: number;
  alias: string;
  birthday?: string; // YYYY-MM-DD
  sex?: string;
}): Promise<VetmPet> {
  const body = {
    owner_id: opts.clientId,
    alias: opts.alias,
    birthday: opts.birthday,
    sex: opts.sex,
  };

  const resp = await vetmFetch<{ pet: VetmPet }>("pet", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!resp.success || !resp.data) {
    throw new Error("Не удалось создать питомца в Vetmanager");
  }

  const pet = (resp.data as any).pet || (resp.data as any);
  return pet;
}

/* =====================
   Личный кабинет Vetmanager (VmLink)
   Док: $domain/rest/api/VmLink/personalAccountLinkByClientId/$clientId
        $domain/rest/api/VmLink/personalAccountLinkByPhone/$clientPhone
   ===================== */

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
