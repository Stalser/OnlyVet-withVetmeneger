// lib/vetmanagerClient.ts
// Клиент для Vetmanager REST API. Использовать ТОЛЬКО на сервере (API routes / server components).

const VETM_DOMAIN = process.env.VETM_DOMAIN;        // например: https://onlyvet.vetmanager.ru
const VETM_API_KEY = process.env.VETM_API_KEY;      // REST API key из настроек Vetmanager

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
   Вспомогательные функции
   =========== */

/**
 * Нормализация телефона:
 *  - оставляем только цифры
 *  - 8XXXXXXXXXX → 7XXXXXXXXXX для РФ
 *  - результат: строка только из цифр (например "79829138405")
 */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("8")) {
    return "7" + digits.slice(1);
  }

  return digits;
}

/* ===========
   Клиенты
   =========== */

/**
 * Поиск клиента по телефону.
 * Если Vetmanager настроен по-другому, property в фильтре можно будет поменять.
 */
export async function searchClientByPhone(
  phone: string
): Promise<VetmClient | null> {
  const digits = normalizePhone(phone);

  const filter = encodeURIComponent(
    JSON.stringify([
      {
        property: "cell_phone", // при необходимости можем поменять на "phone" или другой field из доки
        value: digits,
        operator: "=",
      },
    ])
  );

  const resp = await vetmFetch<{ totalCount: number; data: VetmClient[] }>(
    `client?filter=${filter}`
  ).catch((err) => {
    console.error("[Vetmanager] searchClientByPhone error:", err);
    return null;
  });

  if (!resp || !resp.success || !resp.data) return null;

  const list = (resp.data as any).data || (resp.data as any);
  if (!Array.isArray(list) || list.length === 0) return null;

  return list[0] as VetmClient;
}

/**
 * Создание клиента в Vetmanager.
 * Вызывается при регистрации, если клиента с таким телефоном ещё нет.
 */
export async function createClient(opts: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone: string;
  email?: string;
}): Promise<VetmClient> {
  const body = {
    first_name: opts.firstName || "",
    middle_name: opts.middleName || "",
    last_name: opts.lastName || "",
    cell_phone: normalizePhone(opts.phone),
    email: opts.email || "",
    status: "TEMPORARY", // временный статус, пока нет визитов/счётов
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

/**
 * Найти или создать клиента по телефону.
 * Логика анти-дубликатов: сначала ищем, если нет — создаём.
 */
export async function findOrCreateClientByPhone(opts: {
  phone: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
}): Promise<VetmClient> {
  const existing = await searchClientByPhone(opts.phone);
  if (existing) return existing;

  return await createClient(opts);
}

/* ===========
   Питомцы
   =========== */

/**
 * Получить список питомцев по ID клиента Vetmanager.
 */
export async function getPetsByClientId(clientId: number): Promise<VetmPet[]> {
  const filter = encodeURIComponent(
    JSON.stringify([{ property: "owner_id", value: clientId, operator: "=" }])
  );

  const resp = await vetmFetch<{ data: VetmPet[] }>(`pet?filter=${filter}`);
  if (!resp.success || !resp.data) return [];

  const list = (resp.data as any).data || (resp.data as any);
  return Array.isArray(list) ? (list as VetmPet[]) : [];
}

/**
 * Получить питомца по ID.
 */
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

/**
 * Получить персональную ссылку на личный кабинет Vetmanager по ID клиента.
 * Пока мы её только получаем, но не показываем пользователю.
 */
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
