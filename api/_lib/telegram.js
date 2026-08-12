import { getDeviceLabel } from './db.js';

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}

export function formatKyivDateTime(value = new Date()) {
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value instanceof Date ? value : new Date(value));
}

export function formatDeviceRef(deviceId) {
  const id = String(deviceId || '').trim();
  if (!id) return '—';
  return id.length <= 24 ? id : `${id.slice(0, 22)}…`;
}

export async function sendTelegramMessage(token, chatId, text, { parseMode = 'Markdown' } = {}) {
  const payload = {
    chat_id: chatId,
    text,
  };
  if (parseMode) payload.parse_mode = parseMode;

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await telegramResponse.json();
  return Boolean(data.ok);
}

export async function getDeviceHeading(deviceId, { visit = false, order = false, free = false } = {}) {
  const label = await getDeviceLabel(deviceId);
  if (label) {
    if (visit) return `👋 ${label} зайшов на сайт`;
    if (order) return `🧾 ${label} замовляє`;
    if (free) return `☕ ${label} отримує безкоштовну каву`;
    return label;
  }

  if (visit) return '👋 Хтось зайшов на сайт';
  if (order) return '🧾 Чек замовлення';
  if (free) return '☕ Безкоштовна кава';
  return 'Клієнт';
}

export function buildDeviceBindHint(deviceId) {
  const id = String(deviceId || '').trim();
  if (!id) return '';
  return [
    `🆔 \`${id}\``,
    `Прив'язати: /id ${id} Ім'я`,
  ].join('\n');
}
