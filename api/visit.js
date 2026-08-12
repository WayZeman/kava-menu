import { registerVisitNotice } from './_lib/db.js';

function formatVisitDate() {
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
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const deviceId = normalizeDeviceId(req.body?.deviceId);
  if (!deviceId) {
    res.status(400).json({ ok: false, error: 'invalid_device' });
    return;
  }

  let notice = { shouldNotify: true, reason: 'no_db' };
  try {
    notice = await registerVisitNotice(deviceId, 30);
  } catch {
    notice = { shouldNotify: true, reason: 'db_error' };
  }

  if (!notice.shouldNotify) {
    res.status(200).json({ ok: true, notified: false, reason: notice.reason });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(200).json({ ok: true, notified: false, reason: 'not_configured' });
    return;
  }

  const isStandalone = req.body?.standalone === true || req.body?.standalone === 'true';
  const source = isStandalone ? 'Застосунок (PWA)' : 'Браузер';

  const text = [
    '👋 Хтось зайшов на сайт',
    '',
    `📲 ${source}`,
    `🕐 ${formatVisitDate()}`,
  ].join('\n');

  try {
    const sent = await sendTelegramMessage(token, chatId, text);
    res.status(200).json({ ok: true, notified: sent, reason: sent ? 'sent' : 'telegram_error' });
  } catch {
    res.status(200).json({ ok: true, notified: false, reason: 'telegram_error' });
  }
}
