export const MONTHLY_PASS = {
  id: 'monthly-pass',
  name: 'Абонемент на місяць',
  amount: 999,
  icon: 'monthly-pass',
};

export const MONTHLY_PASS_DRINK_QTY = 33;
export const MONTHLY_PASS_DAYS = 30;

export const MONTHLY_PASS_STATS_DRINK = {
  id: 'americano-milk',
  name: 'Американо з молоком',
  amount: 30,
};

export function isMonthlyPassId(id) {
  return String(id || '').trim() === MONTHLY_PASS.id;
}

export function ensureMonthlyPassInDrinks(drinks) {
  const list = Array.isArray(drinks) ? drinks.map((item) => ({ ...item })) : [];
  if (!list.some((item) => isMonthlyPassId(item?.id))) {
    list.push({ ...MONTHLY_PASS });
  }
  return list;
}

export function countMonthlyPassQty(lines = []) {
  return (lines || []).reduce((sum, line) => {
    if (!isMonthlyPassId(line?.id)) return sum;
    return sum + Math.max(0, Math.round(Number(line.qty) || 0));
  }, 0);
}

export function expandMonthlyPassIncomeLines(lines = []) {
  const result = [];

  for (const line of lines) {
    if (!isMonthlyPassId(line?.id)) {
      result.push(line);
      continue;
    }

    const passQty = Math.max(0, Math.round(Number(line.qty) || 0));
    if (passQty <= 0) continue;

    result.push({
      id: MONTHLY_PASS_STATS_DRINK.id,
      name: MONTHLY_PASS_STATS_DRINK.name,
      amount: MONTHLY_PASS_STATS_DRINK.amount,
      qty: MONTHLY_PASS_DRINK_QTY * passQty,
      category: 'drink',
      freeQty: 0,
      fromMonthlyPass: true,
    });
  }

  return result;
}

export function countMonthlyPassStatsDrinks(lines = []) {
  return countMonthlyPassQty(lines) * MONTHLY_PASS_DRINK_QTY;
}

export function normalizeSubscriberName(value, { max = 60 } = {}) {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  if (!text || text.length > max) return null;
  return text;
}

export function buildMonthlyPassExpiry(startsAt = new Date(), passQty = 1) {
  const start = startsAt instanceof Date ? new Date(startsAt.getTime()) : new Date(startsAt);
  const qty = Math.max(1, Math.round(Number(passQty) || 1));
  const expires = new Date(start.getTime());
  expires.setUTCDate(expires.getUTCDate() + (MONTHLY_PASS_DAYS * qty));
  return expires;
}
