// lib/vetmanagerClient.ts
// Клиент для Vetmanager REST API. Использовать ТОЛЬКО на сервере.

const VETM_DOMAIN = process.env.VETM_DOMAIN;        // https://onlyvet.vetmanager.ru
const VETM_API_KEY = process.env.VETM_API_KEY;      // API key из настроек Vetmanager

if (!VETM_DOMAIN || !VETM_API_KEY) {
  console.warn("[Vetmanager] VETM_DOMAIN или VETM_API_KEY не заданы в env.");
}

export type VetmResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export interface VetmClient {
  id: number;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  email?: string;
  cell_phone?: string;
  status?: string; // ACTIVE / DISABLED / ...
}

export interface VetmPet {
  id: number;
  alias: string;
  owner_id: number;
  birthday?: string;
  sex?: string;
}

// ========== базовый fetch ==========

async function vetmFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<VetmResponse<T>> {
  if (!VETM_DOMAIN || !VETM_API_KEY) {
    throw new Error("Vetmanager API не сконфигурирован (нет VETM_DOMAIN или VETM_API_KEY).");
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
    json = JSON.parse(text);
  } catch {
    console.error("[Vetmanager] invalid JSON:", text);
    throw new Error(`Vetmanager invalid JSON: ${text}`);
  }

  if (!res.ok) {
    console.error("[Vetmanager] HTTP error", res.status, json);
    throw new Error(json.message || `Vetmanager HTTP error ${res.status}`);
  }

  if (!json.success) {
    console.error("[Vetmanager] API error response:", json);
    throw new Error(json.message || "Vetmanager API returned success=false");
  }

  return json;
}

// ========== нормализация телефона ==========

/**
 * Нормализация телефона для Vetmanager:
 * - оставляем только цифры
 * - для РФ:
 *    8XXXXXXXXXX -> 7XXXXXXXXXX
 *    9XXXXXXXXX  -> 79XXXXXXXXX
 */
export function normalizePhoneForVetm(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("8")) {
    return "7" + digits.slice(1);
  }

  if (digits.length === 11 && digits.startsWith("7")) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith("9")) {
    return "7" + digits;
  }

  return digits;
}

// ========== поиск клиентов по телефону ==========

/**
 * Возвращает ВСЕХ клиентов с таким номером телефона (cell_phone),
 * вне зависимости от статуса.
 */
export async function searchClientsByPhone(
  phoneDigits: string
): Promise<VetmClient[]> {
  const filter = encodeURIComponent(
    JSON.stringify([
      {
        property: "cell_phone",
        value: phoneDigits,
        operator: "=",
      },
    ])
  );

  const resp = await vetmFetch<{
    totalCount: number;
    client: VetmClient[];
  }>(`client?filter=${filter}`);

  const list = resp.data?.client || [];
  return Array.isArray(list) ? list : [];
}

// ========== создание клиента ==========

export async function createClient(opts: {
  lastName: string;
  firstName?: string;
  middleName?: string;
  email?: string;
  phoneDigits: string;
}): Promise<VetmClient> {
  const body = {
    last_name: opts.lastName || "",
    first_name: opts.firstName || "",
    middle_name: opts.middleName || "",
    email: opts.email || "",
    cell_phone: opts.phoneDigits || "",
    status: "ACTIVE",
  };

  const resp = await vetmFetch<{
    totalCount: number;
    client: VetmClient[];
  }>("client", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const clients = resp.data?.client;
  if (!clients || !Array.isArray(clients) || clients.length === 0) {
    throw new Error("Vetmanager: пустой ответ при создании клиента");
  }

  return clients[0];
}

/**
 * Убедиться, что клиент ACTIVE.
 * Если DISABLED — аккуратно поднимаем статус через PUT /client/{id}.
 */
async function ensureClientActive(client: VetmClient): Promise<VetmClient> {
  const status = (client.status || "").toUpperCase();
  if (status === "ACTIVE") return client;

  try {
    const resp = await vetmFetch<{
      totalCount: number;
      client: VetmClient[];
    }>(`client/${client.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "ACTIVE" }),
    });

    const updated = resp.data?.client?.[0];
    if (updated) return updated;
  } catch (e) {
    console.warn("[Vetmanager] не удалось перевести клиента в ACTIVE:", client.id, e);
  }

  // если апдейт не удался — возвращаем исходного, но лог уже есть
  return client;
}

// ========== выбор "правильного" клиента среди кандидатов ==========

function normalizeStr(str?: string | null): string {
  return (str || "").trim().toLowerCase();
}

function pickBestClient(candidates: VetmClient[]): VetmClient | null {
  if (!candidates.length) return null;

  const active = candidates.filter(
    (c) => (c.status || "").toUpperCase() === "ACTIVE"
  );
  const source = active.length ? active : candidates;

  // Берём клиента с максимальным id (условно "самый новый")
  return source.reduce((best, c) => (c.id > best.id ? c : best), source[0]);
}

// ========== findOrCreateClientByPhone (НОВАЯ ЛОГИКА) ==========

/**
 * Найти или создать клиента по телефону.
 *
 * Алгоритм:
 * 1) Нормализуем телефон.
 * 2) Берём всех клиентов с таким cell_phone.
 * 3) Среди них:
 *    - сначала ищем по email (если есть),
 *    - если не нашли — по ФИО (фамилия+имя+отчество),
 *    - выбираем лучшего (ACTIVE > DISABLED, потом по id).
 * 4) Если ничего подходящего не нашли — создаём нового.
 */
export async function findOrCreateClientByPhone(opts: {
  phone: string;
  lastName: string;
  firstName?: string;
  middleName?: string;
  email?: string;
}): Promise<VetmClient> {
  const phoneDigits = normalizePhoneForVetm(opts.phone);

  // 1. Все клиенты с таким телефоном
  const all = await searchClientsByPhone(phoneDigits);

  // 2. Фильтр по email (если есть)
  let byEmail: VetmClient[] = [];
  if (opts.email) {
    const emailNorm = normalizeStr(opts.email);
    byEmail = all.filter(
      (c) => normalizeStr(c.email) === emailNorm
    );
  }

  // 3. Фильтр по ФИО
  const ln = normalizeStr(opts.lastName);
  const fn = normalizeStr(opts.firstName);
  const mn = normalizeStr(opts.middleName);

  const byName = all.filter(
    (c) =>
      normalizeStr(c.last_name) === ln &&
      normalizeStr(c.first_name) === fn &&
      normalizeStr(c.middle_name) === mn
  );

  // 4. Выбор приоритета: сначала по email, потом по ФИО
  let chosen: VetmClient | null = null;

  if (byEmail.length) {
    chosen = pickBestClient(byEmail);
  } else if (byName.length) {
    chosen = pickBestClient(byName);
  }

  // 5. Если нашёлся подходящий кандидат — используем его (и поднимаем в ACTIVE при необходимости)
  if (chosen) {
    const activeClient = await ensureClientActive(chosen);
    return activeClient;
  }

  // 6. Если клиентов по телефону много, но ни один не совпадает по email/ФИО — это телефон-дубликат.
  if (all.length > 0) {
    console.warn(
      "[Vetmanager] phone collision: ни один клиент по телефону не совпал по email/FIO. Создаём нового.",
      {
        phone: phoneDigits,
        totalCandidates: all.length,
      }
    );
  }

  // 7. Создаём нового клиента
  const created = await createClient({
    lastName: opts.lastName,
    firstName: opts.firstName,
    middleName: opts.middleName,
    email: opts.email,
    phoneDigits,
  });

  const activeCreated = await ensureClientActive(created);
  return activeCreated;
}

// Для совместимости, если где-то вдруг используется другое имя:
export const findOrCreateClient = findOrCreateClientByPhone;

// ========== питомцы (на будущее) ==========

export async function getPetsByClientId(clientId: number): Promise<VetmPet[]> {
  const filter = encodeURIComponent(
    JSON.stringify([{ property: "owner_id", value: clientId, operator: "=" }])
  );

  const resp = await vetmFetch<{ totalCount: number; pet: VetmPet[] }>(
    `pet?filter=${filter}`
  );

  const list = resp.data?.pet || [];
  return Array.isArray(list) ? list : [];
}

export async function getPetById(id: number): Promise<VetmPet | null> {
  const resp = await vetmFetch<{ totalCount: number; pet: VetmPet[] }>(
    `pet?filter=${encodeURIComponent(
      JSON.stringify([{ property: "id", value: id, operator: "=" }])
    )}`
  );

  const list = resp.data?.pet || [];
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0];
}
