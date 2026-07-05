import { getMenuDrinksFromDb, saveMenuDrinksToDb } from './db.js';

const DEFAULT_DRINKS = [
  { id: 'espresso', name: 'Еспресо', amount: 20, icon: 'espresso' },
  { id: 'americano', name: 'Американо', amount: 20, icon: 'americano' },
  { id: 'americano-milk', name: 'Американо з молоком', amount: 30, icon: 'americano-milk' },
  { id: 'cappuccino', name: 'Капучино', amount: 35, icon: 'cappuccino' },
  { id: 'latte', name: 'Лате Макіато', amount: 40, icon: 'latte' },
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

function normalizeDrinks(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeDrink).filter(Boolean);
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
    const stored = await getMenuDrinksFromDb();
    const drinks = stored?.drinks?.length
      ? normalizeDrinks(stored.drinks)
      : DEFAULT_DRINKS;

    res.status(200).json({
      ok: true,
      drinks,
      updatedAt: stored?.updatedAt || null,
    });
    return;
  }

  if (req.method === 'POST') {
    const drinks = normalizeDrinks(req.body?.drinks);
    if (!drinks.length) {
      res.status(400).json({ ok: false, error: 'invalid_menu' });
      return;
    }

    const saved = await saveMenuDrinksToDb(drinks);
    if (!saved) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json({ ok: true, drinks: saved.drinks, updatedAt: saved.updatedAt });
    return;
  }

  res.status(405).send('Method not allowed');
}
