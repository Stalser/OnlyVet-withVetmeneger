// lib/vetmanagerClient.ts
// Клиент для Vetmanager REST API. Использовать ТОЛЬКО на сервере (API routes / server components).

const VETM_DOMAIN = process.env.VETM_DOMAIN; // например: https://onlyvet.vetmanager.ru
const VETM_API_KEY = process.env.VETM_API_KEY; // REST API key из настроек Vetmanager

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

  const text = await res.text();
  let json: VetmResponse<T>;

  try {
    json = JSON.parse(text) as VetmResponse<T>;
  } catch {
    console.error("[Vetmanager] invalid JSON:", text);
    throw new Error(`Vetmanager invalid JSON: ${text}`);
  }

  if (!res.ok) {
    console.error("[Vetmanager] HTTP error", res.status, json);
    throw new Error(
      `Vetmanager HTTP ${res.status}: ${json.message || "unknown error"}`
    );
  }

  if (!json.success) {
    console.error("[Vetmanager] API not success:", json);
    throw new Error(`Vetmanager API error: ${json.message || "unknown"}`);
  }

  return json;
}

/* ===========
   Типы
   =========== */

export interface VetmClient {
  id: number;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  cell_phone?: string;
  email?: string;
  [key: string]: any;
}

export interface VetmPet {
  id: number;
  alias: string;
  owner_id: number;
  birthday?: string;
  sex?: string;
  [key: string]: any;
}

/* ===========
   Вспомогательные
   =========== */

function normalizePhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits;
}

/**
 * Для записи в Vetmanager: делаем вид "7" + 10 цифр, если это РФ.
 */
function normalizePhoneForVetmanager(raw: string): string {
  const digits = normalizePhoneDigits(raw);

  // 10 цифр → считаем локальным номером РФ
  if (digits.length === 10) {
    return "7" + digits;
  }

  // 11 цифр, начинается с 7 или 8 → приводим к 7XXXXXXXXXX
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return "7" + digits.slice(1);
  }

  // всё остальное — что есть
  return digits;
}

/* ===========
   Поиск клиента
   =========== */

/**
 * Ищем клиента по телефону и/или email.
 * Если найден — возвращаем первого.
 * Если нет — null.
 */
export async function searchClient(
  opts: { phone?: string; email?: string }
): Promise<VetmClient | null> {
  const filters: any[] = [];

  if (opts.phone) {
    const ph = normalizePhoneForVetmanager(opts.phone);
    if (ph) {
      filters.push({
        property: "cell_phone",
        value: ph,
        operator: "=",
      });
    }
  }

  if (opts.email) {
    const em = opts.email.trim();
    if (em) {
      filters.push({
        property: "email",
        value: em,
        operator: "=",
      });
    }
  }

  if (filters.length === 0) {
    return null;
  }

  const filterParam = encodeURIComponent(JSON.stringify(filters));

  const resp = await vetmFetch<{
    totalCount: number;
    client: VetmClient[];
  }>(`client?filter=${filterParam}`);

  const list =
    (resp.data as any)?.client ||
    (resp.data as any)?.data ||
    (resp.data as any);

  if (!Array.isArray(list) || list.length === 0) return null;

  return list[0] as VetmClient;
}

/* ===========
   Создание клиента
   =========== */

export async function createClient(opts: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}): Promise<VetmClient> {
  const body: any = {
    last_name: opts.lastName || "",
    first_name: opts.firstName || "",
    middle_name: opts.middleName || "",
    email: opts.email || "",
    status: "ACTIVE",
  };

  if (opts.phone) {
    body.cell_phone = normalizePhoneForVetmanager(opts.phone);
  }

  const resp = await vetmFetch<{
    totalCount: number;
    client: VetmClient[];
  }>("client", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const list =
    (resp.data as any)?.client ||
    (resp.data as any)?.data ||
    (resp.data as any);

  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("Vetmanager: пустой ответ при создании клиента");
  }

  const client = list[0] as VetmClient;
  console.log("[Vetmanager] createClient CREATED", {
    id: client.id,
    last_name: client.last_name,
    first_name: client.first_name,
    cell_phone: client.cell_phone,
    email: client.email,
  });

  return client;
}

/* ===========
   Найти или создать (основная точка входа)
   =========== */

export async function findOrCreateClient(opts: {
  phone?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}): Promise<VetmClient> {
  // 1. Пытаемся найти
  try {
    const existing = await searchClient({
      phone: opts.phone,
      email: opts.email,
    });

    if (existing) {
      console.log("[Vetmanager] findOrCreateClient FOUND", {
        id: existing.id,
        cell_phone: existing.cell_phone,
        email: existing.email,
      });
      return existing;
    }
  } catch (e) {
    console.warn("[Vetmanager] searchClient error, продолжаем с create:", e);
  }

  // 2. Не нашли — создаём
  const created = await createClient({
    firstName: opts.firstName,
    middleName: opts.middleName,
    lastName: opts.lastName,
    phone: opts.phone,
    email: opts.email,
  });

  return created;
}

/* ===========
   Питомцы
   =========== */

/**
 * Список питомцев по ID клиента.
 */
export async function getPetsByClientId(clientId: number): Promise<VetmPet[]> {
  const filterParam = encodeURIComponent(
    JSON.stringify([
      {
        property: "owner_id",
        value: clientId,
        operator: "=",
      },
    ])
  );

  const resp = await vetmFetch<{ totalCount: number; pet: VetmPet[] }>(
    `pet?filter=${filterParam}`
  );

  const list =
    (resp.data as any)?.pet ||
    (resp.data as any)?.data ||
    (resp.data as any);

  if (!Array.isArray(list)) return [];

  return list as VetmPet[];
}

/**
 * Питомец по ID — для страницы /account/pets/[id].
 */
export async function getPetById(id: number): Promise<VetmPet | null> {
  const resp = await vetmFetch<{ pet: VetmPet[] | VetmPet }>(`pet/${id}`);

  const data = resp.data as any;
  if (!data) return null;

  if (Array.isArray(data.pet) && data.pet.length > 0) {
    return data.pet[0] as VetmPet;
  }

  if (data.pet && !Array.isArray(data.pet)) {
    return data.pet as VetmPet;
  }

  return null;
}
