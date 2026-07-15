import {
  applyOrderedExtraStock,
  buildOrderLabel,
  claimFreeCoffee,
  insertIncome,
  logDeviceCoffee,
} from './db.js';

function formatOrderDate() {
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

function providerLabel(provider) {
  if (provider === 'mono') return 'Monobank';
  if (provider === 'privat') return 'Приват24';
  if (provider === 'other') return 'Інші банки';
  if (provider === 'free') return 'Безкоштовно';
  return 'Банк';
}

function buildOrderRecord(body) {
  const items = body?.items;
  if (!Array.isArray(items) || !items.length) return null;

  const lines = [];
  let total = 0;

  for (const item of items) {
    const name = String(item?.name || '').trim();
    const qty = Number(item?.qty);
    const amount = Number(item?.amount);
    if (!name || !Number.isFinite(qty) || qty <= 0) continue;
    if (!Number.isFinite(amount) || amount < 0) continue;

    total += amount * qty;
    const category = String(item?.category || '').trim() || null;
    lines.push({
      id: String(item?.id || '').trim() || null,
      name,
      qty,
      amount,
      category,
      freeQty: Math.max(0, Math.min(qty, Math.round(Number(item?.freeQty) || 0))),
    });
  }

  if (!lines.length) return null;

  const parsedTotal = Number(body?.total);
  if (Number.isFinite(parsedTotal) && parsedTotal >= 0) {
    total = parsedTotal;
  }

  const id = String(body?.id || '').trim() || null;

  return {
    id,
    label: buildOrderLabel(lines),
    amount: total,
    source: 'order',
    provider: String(body?.provider || '').trim() || 'bank',
    items: lines,
  };
}

async function sendTelegramMessage(token, chatId, text) {
  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const data = await telegramResponse.json();
  return Boolean(data.ok);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const items = req.body?.items;
  if (!Array.isArray(items) || !items.length || items.length > 30) {
    res.status(400).json({ ok: false, error: 'invalid_items' });
    return;
  }

  const lines = [];
  let total = 0;

  for (const item of items) {
    const name = String(item?.name || '').trim();
    const qty = Number(item?.qty);
    const amount = Number(item?.amount);

    if (!name || !Number.isFinite(qty) || qty <= 0 || qty > 99) {
      res.status(400).json({ ok: false, error: 'invalid_item' });
      return;
    }

    if (!Number.isFinite(amount) || amount < 0 || amount > 100000) {
      res.status(400).json({ ok: false, error: 'invalid_item' });
      return;
    }

    const lineTotal = amount * qty;
    total += lineTotal;
    lines.push(`• ${name} × ${qty} — ${lineTotal} грн`);
  }

  const paidTotalRaw = Number(req.body?.total);
  const paidTotal = Number.isFinite(paidTotalRaw) && paidTotalRaw >= 0
    ? paidTotalRaw
    : total;

  const freeDrinksRaw = Number(req.body?.freeDrinks);
  const freeDrinks = Number.isFinite(freeDrinksRaw) && freeDrinksRaw > 0
    ? Math.round(freeDrinksRaw)
    : 0;
  const deviceId = String(req.body?.deviceId || '').trim();

  const providerRaw = String(req.body?.provider || '').trim() || 'bank';
  const provider = providerLabel(providerRaw);

  const orderRecord = buildOrderRecord({
    id: req.body?.id,
    items,
    total: paidTotal,
    provider: providerRaw,
  });

  let saved = null;
  let isNewOrder = false;
  if (orderRecord) {
    try {
      const result = await insertIncome(orderRecord);
      saved = result?.record || null;
      isNewOrder = Boolean(result?.isNew);
    } catch {
      saved = null;
    }
  }

  if (!saved) {
    res.status(503).json({ ok: false, error: 'db_unavailable' });
    return;
  }

  let freeCoffee = null;
  if (isNewOrder && deviceId) {
    const drinkCount = items.reduce((sum, item) => {
      if (String(item?.category || '').trim() !== 'drink') return sum;
      return sum + (Number(item?.qty) || 0);
    }, 0);

    if (drinkCount > 0) {
      try {
        freeCoffee = await claimFreeCoffee({
          deviceId,
          orderId: saved.id,
          drinkQty: drinkCount,
        });
      } catch {
        freeCoffee = null;
      }

      try {
        const forSelf = req.body?.forSelf !== false && req.body?.forSelf !== 'false';
        await logDeviceCoffee({
          deviceId,
          orderId: saved.id,
          drinkQty: drinkCount,
          forSelf,
        });
      } catch {
        // personal stats are optional
      }
    }
  }

  if (isNewOrder) {
    try {
      await applyOrderedExtraStock(orderRecord?.items || []);
    } catch {
      // do not fail the order if stock sync fails
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (isNewOrder && token && chatId) {
    const freeLine = freeCoffee?.claimed
      ? `Безкоштовно: ${freeCoffee.claimed} кав`
      : null;
    const text = [
      '🧾 Чек замовлення',
      '',
      ...lines,
      '',
      `Разом: ${paidTotal} грн`,
      freeLine,
      `Оплата: ${provider}`,
      `🕐 ${formatOrderDate()}`,
    ].filter(Boolean).join('\n');

    try {
      await sendTelegramMessage(token, chatId, text);
    } catch {
      // income is already saved; telegram is optional
    }
  }

  res.status(200).json({ ok: true, income: saved, freeCoffee });
}
