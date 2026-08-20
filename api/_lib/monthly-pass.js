export const MONTHLY_PASS = {
  id: 'monthly-pass',
  name: 'Абонемент на місяць',
  amount: 999,
  icon: 'monthly-pass',
};

export const MONTHLY_PASS_DRINK_QTY = 33;

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
  return (lines || []).reduce((sum, line) => {
    if (!isMonthlyPassId(line?.id)) return sum;
    const passQty = Math.max(0, Math.round(Number(line.qty) || 0));
    return sum + passQty * MONTHLY_PASS_DRINK_QTY;
  }, 0);
}
