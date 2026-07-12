import { neon } from '@neondatabase/serverless';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function serializeItems(items) {
  if (!items) return null;
  return JSON.stringify(items);
}

function mapRow(row) {
  let items = row.items || null;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch {
      items = null;
    }
  }
  if (!Array.isArray(items)) items = null;

  return {
    id: row.id,
    kind: row.kind,
    label: row.label,
    amount: Number(row.amount),
    source: row.source || null,
    provider: row.provider || null,
    items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTransactions() {
  const sql = getSql();
  if (!sql) return { incomes: [], expenses: [] };

  const rows = await sql`
    SELECT id, kind, label, amount, source, provider, items, created_at, updated_at
    FROM transactions
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const incomes = [];
  const expenses = [];

  rows.forEach((row) => {
    const item = mapRow(row);
    if (item.kind === 'income') incomes.push(item);
    else expenses.push(item);
  });

  return { incomes, expenses };
}

export async function insertIncome({
  id,
  label,
  amount,
  source = 'order',
  provider = null,
  items = null,
}) {
  const sql = getSql();
  if (!sql) return null;

  if (id) {
    const existing = await sql`
      SELECT id, kind, label, amount, source, provider, items, created_at, updated_at
      FROM transactions
      WHERE id = ${id}
      LIMIT 1
    `;
    if (existing[0]) return { record: mapRow(existing[0]), isNew: false };
  }

  const recent = await sql`
    SELECT id, kind, label, amount, source, provider, items, created_at, updated_at
    FROM transactions
    WHERE kind = 'income'
      AND label = ${label}
      AND amount = ${amount}
      AND created_at > NOW() - INTERVAL '5 seconds'
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (recent[0]) return { record: mapRow(recent[0]), isNew: false };

  const txnId = id || makeId('income');
  const rows = await sql`
    INSERT INTO transactions (id, kind, label, amount, source, provider, items)
    VALUES (
      ${txnId},
      'income',
      ${label},
      ${amount},
      ${source},
      ${provider},
      ${serializeItems(items)}
    )
    RETURNING id, kind, label, amount, source, provider, items, created_at, updated_at
  `;

  return { record: mapRow(rows[0]), isNew: true };
}

export async function insertExpense({ id, label, amount, category = 'drinks' }) {
  const sql = getSql();
  if (!sql) return null;

  const safeCategory = ['drinks', 'extras', 'services', 'youtube'].includes(category) ? category : 'drinks';
  const source = `expense-${safeCategory}`;

  if (id) {
    const existing = await sql`
      SELECT id, kind, label, amount, source, provider, items, created_at, updated_at
      FROM transactions
      WHERE id = ${id}
      LIMIT 1
    `;
    if (existing[0]) return mapRow(existing[0]);
  }

  const recent = await sql`
    SELECT id, kind, label, amount, source, provider, items, created_at, updated_at
    FROM transactions
    WHERE kind = 'expense'
      AND label = ${label}
      AND amount = ${amount}
      AND created_at > NOW() - INTERVAL '5 seconds'
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (recent[0]) return mapRow(recent[0]);

  const txnId = id || makeId('expense');
  const rows = await sql`
    INSERT INTO transactions (id, kind, label, amount, source, provider, items)
    VALUES (${txnId}, 'expense', ${label}, ${amount}, ${source}, NULL, NULL)
    RETURNING id, kind, label, amount, source, provider, items, created_at, updated_at
  `;

  return mapRow(rows[0]);
}

export async function updateTransaction({ id, label, amount }) {
  const sql = getSql();
  if (!sql) return null;

  const rows = await sql`
    UPDATE transactions
    SET
      label = COALESCE(${label ?? null}, label),
      amount = COALESCE(${amount ?? null}, amount),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, kind, label, amount, source, provider, items, created_at, updated_at
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function deleteTransaction(id) {
  const sql = getSql();
  if (!sql) return false;

  const rows = await sql`
    DELETE FROM transactions
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}

export async function upsertTransaction({
  id,
  kind,
  label,
  amount,
  source = null,
  provider = null,
  items = null,
  createdAt = null,
}) {
  const sql = getSql();
  if (!sql) return null;

  const rows = await sql`
    INSERT INTO transactions (id, kind, label, amount, source, provider, items, created_at, updated_at)
    VALUES (
      ${id},
      ${kind},
      ${label},
      ${amount},
      ${source},
      ${provider},
      ${serializeItems(items)},
      COALESCE(${createdAt}::timestamptz, NOW()),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label,
      amount = EXCLUDED.amount,
      source = EXCLUDED.source,
      provider = EXCLUDED.provider,
      items = EXCLUDED.items,
      updated_at = NOW()
    RETURNING id, kind, label, amount, source, provider, items, created_at, updated_at
  `;

  return mapRow(rows[0]);
}

export async function syncTransactions({ incomes = [], expenses = [] }) {
  const sql = getSql();
  if (!sql) return { synced: 0 };

  let synced = 0;

  for (const item of incomes) {
    const id = String(item?.id || '').trim();
    const label = String(item?.label || '').trim();
    const amount = Number(item?.amount);
    if (!id || !label || !Number.isFinite(amount) || amount <= 0) continue;

    await upsertTransaction({
      id,
      kind: 'income',
      label,
      amount,
      source: item.source || (Array.isArray(item.items) && item.items.length ? 'order' : 'cash'),
      provider: item.provider || null,
      items: item.items || null,
      createdAt: item.createdAt || null,
    });
    synced += 1;
  }

  for (const item of expenses) {
    const id = String(item?.id || '').trim();
    const label = String(item?.label || '').trim();
    const amount = Number(item?.amount);
    if (!id || !label || !Number.isFinite(amount) || amount <= 0) continue;

    await upsertTransaction({
      id,
      kind: 'expense',
      label,
      amount,
      source: item.source || 'manual',
      provider: null,
      items: null,
      createdAt: item.createdAt || null,
    });
    synced += 1;
  }

  return { synced };
}

export function buildOrderLabel(items) {
  if (!Array.isArray(items) || !items.length) return 'Замовлення';
  return items.map((item) => `${item.name} × ${item.qty}`).join(', ');
}

let menuTableReady = false;

async function ensureMenuTable(sql) {
  if (menuTableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  menuTableReady = true;
}

function normalizeMenuDrinks(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const name = String(item?.name || '').trim();
      const amount = Number(item?.amount);
      const id = String(item?.id || '').trim();
      if (!name || !id || !Number.isFinite(amount) || amount <= 0) return null;
      return {
        id,
        name,
        amount: Math.round(amount),
        icon: String(item?.icon || 'generic').trim() || 'generic',
      };
    })
    .filter(Boolean);
}

export async function getMenuDrinksFromDb() {
  const sql = getSql();
  if (!sql) return null;

  await ensureMenuTable(sql);

  const rows = await sql`
    SELECT value, updated_at
    FROM app_config
    WHERE key = 'menu_drinks'
    LIMIT 1
  `;

  if (!rows[0]) return null;

  return {
    drinks: normalizeMenuDrinks(rows[0].value),
    updatedAt: rows[0].updated_at,
  };
}

export async function saveMenuDrinksToDb(drinks) {
  const sql = getSql();
  if (!sql) return null;

  const normalized = normalizeMenuDrinks(drinks);
  if (!normalized.length) return null;

  await ensureMenuTable(sql);

  const rows = await sql`
    INSERT INTO app_config (key, value, updated_at)
    VALUES ('menu_drinks', ${JSON.stringify(normalized)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW()
    RETURNING value, updated_at
  `;

  return {
    drinks: normalizeMenuDrinks(rows[0].value),
    updatedAt: rows[0].updated_at,
  };
}

function normalizeMenuExtras(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const name = String(item?.name || '').trim();
      const amount = Number(item?.amount);
      const stock = Number(item?.stock);
      const id = String(item?.id || '').trim();
      if (!name || !id || !Number.isFinite(amount) || amount <= 0) return null;
      return {
        id,
        name,
        amount: Math.round(amount),
        stock: Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0,
        icon: String(item?.icon || 'generic').trim() || 'generic',
      };
    })
    .filter(Boolean);
}

function normalizeMenuServices(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const name = String(item?.name || '').trim();
      const amount = Number(item?.amount);
      const id = String(item?.id || '').trim();
      if (!name || !id || !Number.isFinite(amount) || amount <= 0) return null;
      return {
        id,
        name,
        amount: Math.round(amount),
        icon: String(item?.icon || 'generic').trim() || 'generic',
      };
    })
    .filter(Boolean);
}

function normalizeMenuVisibility(value) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    drinks: raw.drinks !== false,
    extras: raw.extras !== false,
    services: raw.services !== false,
  };
}

export async function getFullMenuFromDb() {
  const sql = getSql();
  if (!sql) return null;

  await ensureMenuTable(sql);

  const rows = await sql`
    SELECT key, value, updated_at
    FROM app_config
    WHERE key IN ('menu_full', 'menu_drinks')
    ORDER BY CASE key WHEN 'menu_full' THEN 0 ELSE 1 END
    LIMIT 2
  `;

  const fullRow = rows.find((row) => row.key === 'menu_full');
  if (fullRow) {
    const value = fullRow.value || {};
    return {
      drinks: normalizeMenuDrinks(value.drinks),
      extras: normalizeMenuExtras(value.extras),
      services: normalizeMenuServices(value.services),
      visibility: normalizeMenuVisibility(value.visibility),
      updatedAt: fullRow.updated_at,
    };
  }

  const drinksRow = rows.find((row) => row.key === 'menu_drinks');
  if (!drinksRow) return null;

  return {
    drinks: normalizeMenuDrinks(drinksRow.value),
    extras: [],
    services: [],
    visibility: normalizeMenuVisibility(),
    updatedAt: drinksRow.updated_at,
  };
}

export async function saveFullMenuToDb({ drinks, extras, services, visibility }) {
  const sql = getSql();
  if (!sql) return null;

  const payload = {
    drinks: normalizeMenuDrinks(drinks),
    extras: normalizeMenuExtras(extras),
    services: normalizeMenuServices(services),
    visibility: normalizeMenuVisibility(visibility),
  };

  if (!payload.drinks.length) return null;

  await ensureMenuTable(sql);

  const rows = await sql`
    INSERT INTO app_config (key, value, updated_at)
    VALUES ('menu_full', ${JSON.stringify(payload)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW()
    RETURNING value, updated_at
  `;

  const value = rows[0].value || {};

  return {
    drinks: normalizeMenuDrinks(value.drinks),
    extras: normalizeMenuExtras(value.extras),
    services: normalizeMenuServices(value.services),
    visibility: normalizeMenuVisibility(value.visibility),
    updatedAt: rows[0].updated_at,
  };
}

const FREE_COFFEE_LIMIT = 10;
let freeCoffeeTableReady = false;

async function ensureFreeCoffeeTable(sql) {
  if (freeCoffeeTableReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS free_coffee (
      device_id TEXT PRIMARY KEY,
      used INTEGER NOT NULL DEFAULT 0,
      limit_count INTEGER NOT NULL DEFAULT 10,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS free_coffee_claims (
      order_id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  freeCoffeeTableReady = true;
}

function normalizeFreeCoffeeRow(row) {
  const limit = Number(row?.limit_count || FREE_COFFEE_LIMIT);
  const used = Math.max(0, Math.min(limit, Number(row?.used || 0)));
  return {
    deviceId: row?.device_id || null,
    used,
    limit,
    remaining: Math.max(0, limit - used),
  };
}

export async function getFreeCoffeeBalance(deviceId) {
  const sql = getSql();
  if (!sql) return null;

  const id = String(deviceId || '').trim();
  if (!id || id.length > 120) return null;

  await ensureFreeCoffeeTable(sql);

  const rows = await sql`
    SELECT device_id, used, limit_count, updated_at
    FROM free_coffee
    WHERE device_id = ${id}
    LIMIT 1
  `;

  if (!rows[0]) {
    return {
      deviceId: id,
      used: 0,
      limit: FREE_COFFEE_LIMIT,
      remaining: FREE_COFFEE_LIMIT,
    };
  }

  return normalizeFreeCoffeeRow(rows[0]);
}

export async function claimFreeCoffee({ deviceId, orderId, qty }) {
  const sql = getSql();
  if (!sql) return null;

  const id = String(deviceId || '').trim();
  const order = String(orderId || '').trim();
  const requested = Math.max(0, Math.round(Number(qty) || 0));

  if (!id || id.length > 120 || !order || order.length > 120 || requested <= 0) {
    return null;
  }

  await ensureFreeCoffeeTable(sql);

  const existingClaim = await sql`
    SELECT order_id, device_id, qty
    FROM free_coffee_claims
    WHERE order_id = ${order}
    LIMIT 1
  `;

  if (existingClaim[0]) {
    const balance = await getFreeCoffeeBalance(id);
    return {
      ...balance,
      claimed: Number(existingClaim[0].qty || 0),
      alreadyClaimed: true,
    };
  }

  const current = await getFreeCoffeeBalance(id);
  if (!current) return null;

  const claimed = Math.min(requested, current.remaining);
  if (claimed <= 0) {
    return {
      ...current,
      claimed: 0,
      alreadyClaimed: false,
    };
  }

  const nextUsed = current.used + claimed;

  await sql`
    INSERT INTO free_coffee (device_id, used, limit_count, updated_at)
    VALUES (${id}, ${nextUsed}, ${FREE_COFFEE_LIMIT}, NOW())
    ON CONFLICT (device_id) DO UPDATE SET
      used = ${nextUsed},
      updated_at = NOW()
  `;

  await sql`
    INSERT INTO free_coffee_claims (order_id, device_id, qty)
    VALUES (${order}, ${id}, ${claimed})
    ON CONFLICT (order_id) DO NOTHING
  `;

  return {
    deviceId: id,
    used: nextUsed,
    limit: FREE_COFFEE_LIMIT,
    remaining: Math.max(0, FREE_COFFEE_LIMIT - nextUsed),
    claimed,
    alreadyClaimed: false,
  };
}
