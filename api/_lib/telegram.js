import { getTelegramChatIdFromDb } from './db.js';

/** Notifications bot: @barigacofe_bot */
const BARIGACOFE_BOT_TOKEN = '8994978328:AAF8Nwk4ZVviJ_KEq4LC16HmSTq7Q6cOykw';

export function getTelegramBotToken() {
  return BARIGACOFE_BOT_TOKEN;
}

export async function getTelegramConfig() {
  const token = BARIGACOFE_BOT_TOKEN;
  let chatId = '';

  try {
    chatId = (await getTelegramChatIdFromDb()) || '';
  } catch {
    chatId = '';
  }

  if (!chatId) {
    chatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();
  }

  if (!token || !chatId) return null;
  return { token, chatId };
}

export async function sendTelegramMessage(token, chatId, text) {
  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const data = await telegramResponse.json();
  return Boolean(data.ok);
}

export const VISIT_MESSAGE = 'Хтось планує замовити каву';

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

function formatReceiptLine(line) {
  const lineTotal = line.amount * line.qty - line.freeQty * line.amount;
  if (line.freeQty > 0 && lineTotal === 0) {
    return `• ${line.name} × ${line.qty} — безкоштовно`;
  }
  if (line.freeQty > 0) {
    return `• ${line.name} × ${line.qty} — ${lineTotal} грн (−${line.freeQty})`;
  }
  return `• ${line.name} × ${line.qty} — ${lineTotal} грн`;
}

export function buildOrderReceiptMessage({ lines = [], paidTotal = 0, provider = '', freeClaimed = 0 } = {}) {
  const telegramLines = lines.map(formatReceiptLine);
  const freeLine = freeClaimed > 0 ? `Безкоштовно: ${freeClaimed} кав` : null;

  return [
    '🧾 Чек замовлення',
    '',
    ...telegramLines,
    '',
    `Разом: ${paidTotal} грн`,
    freeLine,
    `Оплата: ${provider}`,
    `🕐 ${formatKyivDateTime()}`,
  ].filter(Boolean).join('\n');
}

export function buildFreeCoffeeReceiptMessage({ lines = [] } = {}) {
  const telegramLines = lines.map((line) => {
    if (line.freeQty > 0) {
      return `• ${line.name} × ${line.qty} — безкоштовно`;
    }
    return `• ${line.name} × ${line.qty} — ${line.amount * line.qty} грн`;
  });

  return [
    '☕ Безкоштовна кава',
    '',
    'Клієнт отримав 10-ту каву в подарунок:',
    '',
    ...telegramLines,
    '',
    `🕐 ${formatKyivDateTime()}`,
  ].join('\n');
}
