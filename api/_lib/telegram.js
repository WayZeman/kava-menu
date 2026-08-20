import { getTelegramChatIdFromDb } from './db.js';

/** Notifications bot: @barigacofe_bot */
const BARIGACOFE_BOT_TOKEN = '8994978328:AAF8Nwk4ZVviJ_KEq4LC16HmSTq7Q6cOykw';

const BRAND = 'Кавове меню';
const DIVIDER = '────────────';

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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatMoney(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '0 грн';
  return `${Math.round(value)} грн`;
}

function formatQty(qty) {
  const value = Math.max(0, Math.round(Number(qty) || 0));
  return String(value);
}

export async function sendTelegramMessage(token, chatId, text) {
  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const data = await telegramResponse.json();
  return Boolean(data.ok);
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

function messageFooter(when = new Date()) {
  return `<i>${escapeHtml(formatKyivDateTime(when))}</i>`;
}

function formatReceiptLine(line) {
  const name = escapeHtml(line?.name || 'Позиція');
  const qty = formatQty(line?.qty);
  const freeQty = Math.max(0, Math.round(Number(line?.freeQty) || 0));
  const amount = Number(line?.amount) || 0;
  const lineTotal = amount * Number(line?.qty || 0) - freeQty * amount;

  if (freeQty > 0 && lineTotal === 0) {
    return `• <b>${name}</b> × ${qty}\n  <i>подарунок</i>`;
  }
  if (freeQty > 0) {
    return `• <b>${name}</b> × ${qty}\n  ${escapeHtml(formatMoney(lineTotal))} <i>(−${freeQty} у подарунок)</i>`;
  }
  return `• <b>${name}</b> × ${qty}\n  ${escapeHtml(formatMoney(lineTotal))}`;
}

export function buildVisitMessage(when = new Date()) {
  return [
    `<b>👁 Відвідування</b>`,
    BRAND,
    DIVIDER,
    'Клієнт відкрив меню.',
    '',
    messageFooter(when),
  ].join('\n');
}

/** @deprecated use buildVisitMessage() */
export const VISIT_MESSAGE = buildVisitMessage();

export function buildOrderReceiptMessage({
  lines = [],
  paidTotal = 0,
  provider = '',
  freeClaimed = 0,
  when = new Date(),
} = {}) {
  const telegramLines = lines.map(formatReceiptLine);
  const total = Math.max(0, Math.round(Number(paidTotal) || 0));
  const freeCount = Math.max(0, Math.round(Number(freeClaimed) || 0));
  const isFreeOrder = total === 0 && freeCount > 0;

  const title = isFreeOrder ? '🎁 Подарункове замовлення' : '🧾 Нове замовлення';
  const totalLine = isFreeOrder
    ? '<b>Разом:</b> безкоштовно'
    : `<b>Разом:</b> ${escapeHtml(formatMoney(total))}`;

  return [
    `<b>${title}</b>`,
    BRAND,
    DIVIDER,
    telegramLines.length ? telegramLines.join('\n') : '• Без позицій',
    DIVIDER,
    totalLine,
    freeCount > 0 && !isFreeOrder
      ? `<b>Подарунок:</b> ${freeCount} ${freeCount === 1 ? 'кава' : 'кави'}`
      : null,
    provider ? `<b>Оплата:</b> ${escapeHtml(provider)}` : null,
    '',
    messageFooter(when),
  ].filter((line) => line != null && line !== false).join('\n');
}

export function buildFreeCoffeeReceiptMessage({ lines = [], when = new Date() } = {}) {
  const telegramLines = lines.map((line) => {
    const name = escapeHtml(line?.name || 'Кава');
    const qty = formatQty(line?.qty);
    const freeQty = Math.max(0, Math.round(Number(line?.freeQty) || 0));
    if (freeQty > 0) {
      return `• <b>${name}</b> × ${qty}\n  <i>10-та кава · подарунок</i>`;
    }
    const amount = Number(line?.amount) || 0;
    return `• <b>${name}</b> × ${qty}\n  ${escapeHtml(formatMoney(amount * Number(line?.qty || 0)))}`;
  });

  return [
    '<b>🎁 Програма лояльності</b>',
    BRAND,
    DIVIDER,
    'Клієнт отримав 10-ту каву безкоштовно.',
    '',
    telegramLines.length ? telegramLines.join('\n') : '• Кава × 1',
    '',
    messageFooter(when),
  ].join('\n');
}

export function buildFeedbackMessage(message, when = new Date()) {
  const body = escapeHtml(String(message || '').trim());
  return [
    '<b>💬 Відгук клієнта</b>',
    BRAND,
    DIVIDER,
    body,
    '',
    messageFooter(when),
  ].join('\n');
}

export function buildBotConnectedMessage(when = new Date()) {
  return [
    '<b>✅ Сповіщення підключено</b>',
    BRAND,
    DIVIDER,
    'Цей чат отримуватиме:',
    '• відвідування меню',
    '• нові замовлення',
    '• подарункові кави',
    '• відгуки клієнтів',
    '',
    messageFooter(when),
  ].join('\n');
}
