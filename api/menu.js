import { getFullMenuFromDb, saveFullMenuToDb } from './_lib/db.js';

const DEFAULT_DRINKS = [
  { id: 'espresso', name: 'Еспресо', amount: 20, icon: 'espresso' },
  { id: 'double-espresso', name: 'Подвійний еспресо', amount: 30, icon: 'double-espresso' },
  { id: 'americano', name: 'Американо', amount: 20, icon: 'americano' },
  { id: 'cappuccino', name: 'Капучино', amount: 35, icon: 'cappuccino' },
  { id: 'latte', name: 'Лате Макіато', amount: 40, icon: 'latte' },
  { id: 'iced-latte', name: 'Айс Лате', amount: 40, icon: 'iced-latte' },
];

const DEFAULT_SERVICES = [
  { id: 'haircut', name: 'Стрижка', amount: 250, icon: 'haircut' },
];

function normalizeDrink(raw) {
  const name = String(raw?.name || '').trim();
  const amount = Number(raw?.amount);
  const id = String(raw?.id || '').trim();
  if (!name || !id || !Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;

  return {
    id,
    name,
    amount: Math.round(amount),
    icon: String(raw?.icon || 'generic').trim() || 'generic',
  };
}

function normalizeExtra(raw) {
  const name = String(raw?.name || '').trim();
  const amount = Number(raw?.amount);
  const stock = Number(raw?.stock);
  const id = String(raw?.id || '').trim();
  if (!name || !id || !Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;

  return {
    id,
    name,
    amount: Math.round(amount),
    stock: Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0,
    icon: String(raw?.icon || 'generic').trim() || 'generic',
  };
}

function normalizeService(raw) {
  const name = String(raw?.name || '').trim();
  const amount = Number(raw?.amount);
  const id = String(raw?.id || '').trim();
  if (!name || !id || !Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;

  return {
    id,
    name,
    amount: Math.round(amount),
    icon: String(raw?.icon || 'generic').trim() || 'generic',
  };
}

function normalizeDrinks(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeDrink).filter(Boolean);
}

function normalizeExtras(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeExtra).filter(Boolean);
}

function normalizeServices(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeService).filter(Boolean);
}

function buildMenuResponse(stored) {
  const drinks = stored?.drinks?.length
    ? normalizeDrinks(stored.drinks)
    : DEFAULT_DRINKS;
  const extras = normalizeExtras(stored?.extras);
  const services = stored?.services?.length
    ? normalizeServices(stored.services)
    : DEFAULT_SERVICES;
  const visibility = stored?.visibility && typeof stored.visibility === 'object'
    ? {
      drinks: stored.visibility.drinks !== false,
      extras: stored.visibility.extras !== false,
      services: stored.visibility.services !== false,
    }
    : { drinks: true, extras: true, services: true };

  return {
    ok: true,
    drinks,
    extras,
    services,
    visibility,
    updatedAt: stored?.updatedAt || null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const stored = await getFullMenuFromDb();
    res.status(200).json(buildMenuResponse(stored));
    return;
  }

  if (req.method === 'POST') {
    const current = await getFullMenuFromDb();
    const drinks = req.body?.drinks !== undefined
      ? normalizeDrinks(req.body.drinks)
      : normalizeDrinks(current?.drinks);
    const extras = req.body?.extras !== undefined
      ? normalizeExtras(req.body.extras)
      : normalizeExtras(current?.extras);
    const services = req.body?.services !== undefined
      ? normalizeServices(req.body.services)
      : normalizeServices(current?.services?.length ? current.services : DEFAULT_SERVICES);

    const visibility = req.body?.visibility !== undefined
      ? req.body.visibility
      : current?.visibility;

    if (!drinks.length) {
      res.status(400).json({ ok: false, error: 'invalid_menu' });
      return;
    }

    const saved = await saveFullMenuToDb({ drinks, extras, services, visibility });
    if (!saved) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json(buildMenuResponse(saved));
    return;
  }

  res.status(405).send('Method not allowed');
}
