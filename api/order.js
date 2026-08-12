import {
  applyOrderedExtraStock,
  buildOrderLabel,
  claimFreeCoffee,
  insertIncome,
  logDeviceCoffee,
} from './_lib/db.js';
import { validateAndPriceOrder } from './_lib/order-pricing.js';

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

function normalizeDeviceId(value) {
  const id = String(value || '').trim();
  if (!id || id.length > 120) return null;
  return id;
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

  const deviceId = normalizeDeviceId(req.body?.deviceId);
  if (!deviceId) {
    res.status(400).json({ ok: false, error: 'invalid_device' });
    return;
  }

  const providerRaw = String(req.body?.provider || '').trim() || 'bank';
  const provider = providerLabel(providerRaw);

  let pricing;
  try {
    pricing = await validateAndPriceOrder({ items, deviceId, provider: providerRaw });
  } catch {
    res.status(503).json({ ok: false, error: 'pricing_failed' });
    return;
  }

  if (!pricing.ok) {
    res.status(400).json({ ok: false, error: pricing.error || 'invalid_order' });
    return;
  }

  const orderId = String(req.body?.id || '').trim() || null;
  const orderRecord = {
    id: orderId,
    label: buildOrderLabel(pricing.lines),
    amount: pricing.paidTotal,
    source: 'order',
    provider: providerRaw,
    items: pricing.lines,
  };

  let saved = null;
  let isNewOrder = false;
  try {
    const result = await insertIncome(orderRecord);
    saved = result?.record || null;
    isNewOrder = Boolean(result?.isNew);
  } catch {
    saved = null;
  }

  if (!saved) {
    res.status(503).json({ ok: false, error: 'db_unavailable' });
    return;
  }

  let freeCoffee = null;
  if (isNewOrder && pricing.drinkQty > 0) {
    try {
      freeCoffee = await claimFreeCoffee({
        deviceId,
        orderId: saved.id,
        drinkQty: pricing.drinkQty,
      });
    } catch {
      freeCoffee = null;
    }

    try {
      const forSelf = req.body?.forSelf !== false && req.body?.forSelf !== 'false';
      await logDeviceCoffee({
        deviceId,
        orderId: saved.id,
        drinkQty: pricing.drinkQty,
        forSelf,
      });
    } catch {
      // personal stats are optional
    }
  }

  if (isNewOrder) {
    try {
      await applyOrderedExtraStock(pricing.lines);
    } catch {
      // do not fail the order if stock sync fails
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (isNewOrder && token && chatId) {
    const telegramLines = pricing.lines.map((line) => {
      const lineTotal = line.amount * line.qty - line.freeQty * line.amount;
      if (line.freeQty > 0 && lineTotal === 0) {
        return `• ${line.name} × ${line.qty} — безкоштовно`;
      }
      if (line.freeQty > 0) {
        return `• ${line.name} × ${line.qty} — ${lineTotal} грн (−${line.freeQty})`;
      }
      return `• ${line.name} × ${line.qty} — ${lineTotal} грн`;
    });

    const freeLine = freeCoffee?.claimed
      ? `Безкоштовно: ${freeCoffee.claimed} кав`
      : null;

    const text = [
      '🧾 Чек замовлення',
      '',
      ...telegramLines,
      '',
      `Разом: ${pricing.paidTotal} грн`,
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

  res.status(200).json({
    ok: true,
    income: saved,
    freeCoffee,
    pricing: {
      paidTotal: pricing.paidTotal,
      freeDrinks: pricing.freeDrinks,
      drinkQty: pricing.drinkQty,
    },
  });
}
