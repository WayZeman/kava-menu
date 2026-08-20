import { getFullMenuFromDb, getFreeCoffeeBalance, simulateLoyaltyCycle } from './db.js';
import {
  ensureMonthlyPassInDrinks,
  expandMonthlyPassIncomeLines,
  isMonthlyPassId,
  countMonthlyPassStatsDrinks,
} from './monthly-pass.js';

function buildMenuMaps(menu) {
  const drinks = new Map();
  const extras = new Map();
  const services = new Map();

  for (const item of ensureMonthlyPassInDrinks(menu?.drinks || [])) drinks.set(item.id, item);
  for (const item of menu?.extras || []) extras.set(item.id, item);
  for (const item of menu?.services || []) services.set(item.id, item);

  return { drinks, extras, services };
}

function resolveMenuItem(maps, raw) {
  const id = String(raw?.id || '').trim();
  const category = String(raw?.category || '').trim();

  if (category === 'extra' || maps.extras.has(id)) {
    const item = maps.extras.get(id);
    if (!item) return null;
    return { ...item, category: 'extra' };
  }

  if (category === 'service' || maps.services.has(id)) {
    const item = maps.services.get(id);
    if (!item) return null;
    return { ...item, category: 'service' };
  }

  const drink = maps.drinks.get(id);
  if (!drink) return null;
  return { ...drink, category: 'drink' };
}

export async function validateAndPriceOrder({ items, deviceId, provider = 'bank' }) {
  const menu = await getFullMenuFromDb();
  if (!menu?.drinks?.length) return { ok: false, error: 'menu_unavailable' };

  const maps = buildMenuMaps(menu);
  const lines = [];
  let loyaltyDrinkQty = 0;

  for (const raw of items || []) {
    const qty = Number(raw?.qty);
    if (!Number.isFinite(qty) || qty <= 0 || qty > 99) {
      return { ok: false, error: 'invalid_item' };
    }

    const menuItem = resolveMenuItem(maps, raw);
    if (!menuItem) return { ok: false, error: 'unknown_item' };

    if (menuItem.category === 'extra') {
      const stock = Number(menuItem.stock || 0);
      if (stock > 0 && qty > stock) return { ok: false, error: 'insufficient_stock' };
    }

    // Monthly pass is paid once and expands to 33 drinks in stats,
    // but must not advance the free-coffee loyalty cycle.
    if (menuItem.category === 'drink' && !isMonthlyPassId(menuItem.id)) {
      loyaltyDrinkQty += qty;
    }

    lines.push({
      id: menuItem.id,
      name: menuItem.name,
      amount: menuItem.amount,
      qty,
      category: menuItem.category,
      freeQty: 0,
    });
  }

  if (!lines.length) return { ok: false, error: 'invalid_items' };

  let freeDrinks = 0;
  let stamps = 0;

  if (deviceId && loyaltyDrinkQty > 0) {
    const balance = await getFreeCoffeeBalance(deviceId);
    const simulation = simulateLoyaltyCycle(balance?.stamps || 0, loyaltyDrinkQty, balance?.cycle || 10);
    freeDrinks = simulation.freeDrinks;
    stamps = simulation.stamps;

    let unitIndex = 0;
    for (const line of lines) {
      if (line.category !== 'drink' || isMonthlyPassId(line.id)) continue;
      let freeQty = 0;
      for (let step = 0; step < line.qty; step += 1) {
        if (simulation.units[unitIndex] === 'free') freeQty += 1;
        unitIndex += 1;
      }
      line.freeQty = freeQty;
    }
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount * line.qty, 0);
  const freeValue = lines.reduce((sum, line) => sum + line.freeQty * line.amount, 0);
  const paidTotal = Math.max(0, subtotal - freeValue);
  const statsDrinkQty = loyaltyDrinkQty + countMonthlyPassStatsDrinks(lines);
  const incomeItems = expandMonthlyPassIncomeLines(lines);

  if (provider === 'free' && paidTotal > 0) {
    return { ok: false, error: 'payment_required' };
  }

  return {
    ok: true,
    lines,
    incomeItems,
    subtotal,
    freeValue,
    paidTotal,
    freeDrinks,
    drinkQty: loyaltyDrinkQty,
    statsDrinkQty,
    nextStamps: stamps,
  };
}
