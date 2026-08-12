import {
  buildOrderLabel,
  claimFreeCoffee,
  getFreeCoffeeBalance,
  insertIncome,
  logDeviceCoffee,
} from './_lib/db.js';
import { validateAndPriceOrder } from './_lib/order-pricing.js';
import {
  formatDeviceRef,
  formatKyivDateTime,
  getDeviceHeading,
  getTelegramConfig,
  sendTelegramMessage,
} from './_lib/telegram.js';

function normalizeDeviceId(value) {
  const id = String(value || '').trim();
  if (!id || id.length > 120) return null;
  return id;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

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

  let pricing;
  try {
    pricing = await validateAndPriceOrder({ items, deviceId, provider: 'free' });
  } catch {
    res.status(503).json({ ok: false, error: 'pricing_failed' });
    return;
  }

  if (!pricing.ok) {
    res.status(400).json({ ok: false, error: pricing.error || 'invalid_order' });
    return;
  }

  if (pricing.paidTotal > 0 || pricing.freeDrinks <= 0 || pricing.drinkQty <= 0) {
    res.status(400).json({ ok: false, error: 'not_eligible' });
    return;
  }

  const balance = await getFreeCoffeeBalance(deviceId);
  if (!balance || balance.stamps < balance.cycle - 1) {
    res.status(400).json({ ok: false, error: 'not_ready' });
    return;
  }

  const orderId = String(req.body?.id || '').trim() || `free-${Date.now()}`;

  let freeCoffee = null;
  try {
    freeCoffee = await claimFreeCoffee({
      deviceId,
      orderId,
      drinkQty: pricing.drinkQty,
    });
  } catch {
    res.status(503).json({ ok: false, error: 'claim_failed' });
    return;
  }

  if (!freeCoffee || !(Number(freeCoffee.claimed) > 0 || Number(freeCoffee.freeDrinks) > 0)) {
    res.status(400).json({ ok: false, error: 'claim_failed' });
    return;
  }

  try {
    await insertIncome({
      id: orderId,
      label: buildOrderLabel(pricing.lines),
      amount: 0,
      source: 'order',
      provider: 'free',
      items: pricing.lines,
    });
  } catch {
    // loyalty claim succeeded; income record is optional for free orders
  }

  try {
    const forSelf = req.body?.forSelf !== false && req.body?.forSelf !== 'false';
    await logDeviceCoffee({
      deviceId,
      orderId,
      drinkQty: pricing.drinkQty,
      forSelf,
    });
  } catch {
    // personal stats are optional
  }

  const telegramConfig = getTelegramConfig();

  if (telegramConfig) {
    const lines = pricing.lines.map((line) => {
      if (line.freeQty > 0) {
        return `• ${line.name} × ${line.qty} — безкоштовно`;
      }
      return `• ${line.name} × ${line.qty} — ${line.amount * line.qty} грн`;
    });

    const heading = await getDeviceHeading(deviceId, { free: true });

    const text = [
      heading,
      '',
      ...lines,
      '',
      `🆔 \`${formatDeviceRef(deviceId)}\``,
      `🕐 ${formatKyivDateTime()}`,
    ].join('\n');

    try {
      await sendTelegramMessage(telegramConfig.token, telegramConfig.chatId, text);
    } catch {
      // claim already saved
    }
  }

  res.status(200).json({
    ok: true,
    freeCoffee,
    pricing: {
      paidTotal: pricing.paidTotal,
      freeDrinks: pricing.freeDrinks,
      drinkQty: pricing.drinkQty,
    },
  });
}
