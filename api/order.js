import {
  applyOrderedExtraStock,
  buildOrderLabel,
  claimFreeCoffee,
  insertIncome,
  logDeviceCoffee,
} from './_lib/db.js';
import { validateAndPriceOrder } from './_lib/order-pricing.js';
import {
  buildOrderReceiptMessage,
  getTelegramConfig,
  sendTelegramMessage,
} from './_lib/telegram.js';

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
    items: pricing.incomeItems || pricing.lines,
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
  }

  if (isNewOrder && pricing.statsDrinkQty > 0) {
    try {
      const forSelf = req.body?.forSelf !== false && req.body?.forSelf !== 'false';
      await logDeviceCoffee({
        deviceId,
        orderId: saved.id,
        drinkQty: pricing.statsDrinkQty,
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

  const telegramConfig = await getTelegramConfig();

  if (isNewOrder && telegramConfig) {
    try {
      const text = buildOrderReceiptMessage({
        lines: pricing.lines,
        paidTotal: pricing.paidTotal,
        provider,
        freeClaimed: freeCoffee?.claimed || 0,
      });
      await sendTelegramMessage(telegramConfig.token, telegramConfig.chatId, text);
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
      statsDrinkQty: pricing.statsDrinkQty,
    },
  });
}
