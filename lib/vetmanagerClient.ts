// lib/vetmanagerClient.ts
// Клиент для Vetmanager REST API. Использовать ТОЛЬКО на сервере (API routes / server components).

const VETM_DOMAIN = process.env.VETM_DOMAIN;
const VETM_API_KEY = process.env.VETM_API_KEY;

if (!VETM_DOMAIN || !VETM_API_KEY) {
  console.warn(
    "[Vetmanager] VETM_DOMAIN или VETM_API_KEY не заданы в env. Интеграция с клиникой отключена."
  );
}

export interface VetmClient {
  id: number;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  cell_phone?: string;
  email?: string;
  status?: string;
}

interface VetmResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Внутренний помощник для запросов
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
    console.error("[Vetmanager] Не удалось разобрать JSON:", text);
    throw new Error(`Vetmanager: invalid JSON (${res.status})`);
  }

  if (!res.ok || !json.success) {
    console.error("[Vetmanager] HTTP/API error", res.status, json);
    throw new Error(
      `Vetmanager API error: HTTP ${res.status}, success=${json.success}, message=${json.message}`
    );
  }

  return json;
}

/**
 * Вспомогательная нормализация телефона для Vetmanager:
 * - берём только цифры;
 * - если 10 цифр → добавляем '7' спереди (делаем 11);
 * - если 11 цифр → оставляем как есть;
 * - всё остальное → кидаем ошибку.
 */
function normalizePhoneForVetmanager(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, "");

  if (digits.length === 10) {
    return "7" + digits;
  }

  if (digits.length === 11) {
    return digits;
  }

  throw new Error(
    `[Vetmanager] Некорректное количество цифр телефона для Vetmanager: "${rawDigits}" -> "${digits}"`
  );
}

/* ===========================================================================
   Поиск клиента по телефону
   =========================================================================== */

type ClientListPayload = {
  totalCount: number;
  client: VetmClient[];
};

/**
 * Ищем клиента по cell_phone.
 * ВАЖНО: property = "cell_phone" (в таблице client НЕТ колонки phone).
 */
async function searchClientByPhone(
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

  const resp = await vetmFetch<ClientListPayload>(`client?filter=${filter}`);

  const list = resp.data?.client || [];
  if (!Array.isArray(list) || list.length === 0) return null;

  return list[0];
}

/* ===========================================================================
   Создание клиента
   =========================================================================== */

async function createClient(opts: {
  phoneDigits: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  email?: string;
}): Promise<VetmClient> {
  const body: any = {
    last_name: opts.lastName || "",
    first_name: opts.firstName || "",
    middle_name: opts.middleName || "",
    cell_phone: opts.phoneDigits,
    email: opts.email || "",
    status: "ACTIVE",
  };

  const resp = await vetmFetch<ClientListPayload>("client", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const list = resp.data?.client || [];
  if (!Array.isArray(list) || list.length === 0) {
    console.error("[Vetmanager] createClient: пустой ответ", resp);
    throw new Error("Vetmanager: не удалось создать клиента (пустой ответ)");
  }

  const client = list[0];
  console.log("[Vetmanager] createClient -> CREATED", {
    id: client.id,
    last_name: client.last_name,
    first_name: client.first_name,
    cell_phone: client.cell_phone,
  });

  return client;
}

/* ===========================================================================
   Публичная функция: найти или создать клиента по телефону
   =========================================================================== */

export async function findOrCreateClientByPhone(opts: {
  phone: string; // может быть в любом виде: "+7 982..." / "7982..." / "982..."
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
}): Promise<VetmClient> {
  // 1. Нормализуем под Vetmanager (11 цифр, начинается с 7)
  const digits = opts.phone.replace(/\D/g, "");
  if (!digits) {
    throw new Error("[Vetmanager] findOrCreateClientByPhone: телефон пустой");
  }

  const vetmPhone = normalizePhoneForVetmanager(
    digits.length > 11 ? digits.slice(-11) : digits
  );

  // 2. Пытаемся найти по полному номеру
  const existing = await searchClientByPhone(vetmPhone);
  if (existing) {
    console.log("[Vetmanager] findOrCreateClientByPhone -> FOUND", {
      id: existing.id,
      cell_phone: existing.cell_phone,
    });
    return existing;
  }

  // 3. На всякий случай пробуем только по последним 10 цифрам (под старые записи)
  const last10 = vetmPhone.slice(-10);
  const existingAlt = await searchClientByPhone(last10).catch(() => null);
  if (existingAlt) {
    console.log("[Vetmanager] findOrCreateClientByPhone -> FOUND (alt)", {
      id: existingAlt.id,
      cell_phone: existingAlt.cell_phone,
    });
    return existingAlt;
  }

  // 4. Не нашли — создаём нового клиента
  const created = await createClient({
    phoneDigits: vetmPhone,
    lastName: opts.lastName,
    firstName: opts.firstName,
    middleName: opts.middleName,
    email: opts.email,
  });

  return created;
}
