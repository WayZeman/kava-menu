import { buildOrderLabel, insertIncome } from './db.js';

function formatOrderDate() {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function providerLabel(provider) {
  if (provider === 'mono') return 'Monobank';
  if (provider === 'privat') return 'Приват24';
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
    if (!Number.isFinite(amount) || amount <= 0) continue;

    total += amount * qty;
    lines.push({ name, qty, amount });
  }

  if (!lines.length) return null;

  const parsedTotal = Number(body?.total);
  if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
    total = parsedTotal;
  }

  return {
    label: buildOrderLabel(lines),
    amount: total,
    source: 'order',
    provider: String(body?.provider || '').trim() || 'bank',
    items: lines,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(503).json({ ok: false, error: 'not_configured' });
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

    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
      res.status(400).json({ ok: false, error: 'invalid_item' });
      return;
    }

    const lineTotal = amount * qty;
    total += lineTotal;
    lines.push(`• ${name} × ${qty} — ${lineTotal} грн`);
  }

  const provider = providerLabel(String(req.body?.provider || ''));
  const text = [
    '🧾 Чек замовлення',
    '',
    ...lines,
    '',
    `Разом: ${total} грн`,
    `Оплата: ${provider}`,
    `🕐 ${formatOrderDate()}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await telegramResponse.json();
    if (!data.ok) {
      res.status(502).json({ ok: false, error: 'telegram_error' });
      return;
    }

    const orderRecord = buildOrderRecord({
      items,
      total,
      provider: String(req.body?.provider || '').trim() || 'bank',
    });

    if (orderRecord) {
      try {
        await insertIncome(orderRecord);
      } catch {
        // stats logging should not block payment notification
      }
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, error: 'telegram_error' });
  }
}
