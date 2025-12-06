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
  status?: string;
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

// ========== клиент: поиск и создание ==========

/**
 * Поиск клиента по телефону в Vetmanager (поле cell_phone).
 */
export async function searchClientByPhone(
  phoneDigits: string
): Promise<VetmClient | null> {
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
  if (!Array.isArray(list) || list.length === 0) return null;

  return list[0];
}

/**
 * Создание клиента в Vetmanager.
 */
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
 * Найти или создать клиента по телефону.
 */
export async function findOrCreateClientByPhone(opts: {
  phone: string;
  lastName: string;
  firstName?: string;
  middleName?: string;
  email?: string;
}): Promise<VetmClient> {
  const phoneDigits = normalizePhoneForVetm(opts.phone);

  const existing = await searchClientByPhone(phoneDigits);
  if (existing) return existing;

  const created = await createClient({
    lastName: opts.lastName,
    firstName: opts.firstName,
    middleName: opts.middleName,
    email: opts.email,
    phoneDigits,
  });

  return created;
}

// Для совместимости
export const findOrCreateClient = findOrCreateClientByPhone;

// ========== питомцы (пока на будущее) ==========

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
