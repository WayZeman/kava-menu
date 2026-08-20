import { getTelegramChatIdFromDb } from './db.js';

/** Notifications bot: @barigacofe_bot */
const BARIGACOFE_BOT_TOKEN = '8994978328:AAF8Nwk4ZVviJ_KEq4LC16HmSTq7Q6cOykw';

const BRAND = 'Кавове меню';
const BRAND_HANDLE = '@barigacofe_bot';

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
  return String(Math.max(0, Math.round(Number(qty) || 0)));
}

function formatShortKyivTime(value = new Date()) {
  const parts = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(value instanceof Date ? value : new Date(value));

  const map = Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]));
  const day = map.day || '';
  const month = (map.month || '').replace('.', '');
  const hour = map.hour || '';
  const minute = map.minute || '';
  return `${day} ${month} · ${hour}:${minute}`;
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

function brandHeader(title) {
  return [
    `☕ <b>${escapeHtml(BRAND)}</b>`,
    title ? `<b>${title}</b>` : null,
  ].filter(Boolean).join('\n');
}

function metaLine(when = new Date()) {
  return `🕒 <i>${escapeHtml(formatShortKyivTime(when))}</i>`;
}

function formatReceiptLine(line) {
  const name = escapeHtml(line?.name || 'Позиція');
  const qty = formatQty(line?.qty);
  const freeQty = Math.max(0, Math.round(Number(line?.freeQty) || 0));
  const amount = Number(line?.amount) || 0;
  const lineTotal = amount * Number(line?.qty || 0) - freeQty * amount;

  if (freeQty > 0 && lineTotal === 0) {
    return `${name} ×${qty} — <i>подарунок</i>`;
  }
  if (freeQty > 0) {
    return `${name} ×${qty} — ${escapeHtml(formatMoney(lineTotal))} <i>(−${freeQty})</i>`;
  }
  return `${name} ×${qty} — ${escapeHtml(formatMoney(lineTotal))}`;
}

function wrapBlock(lines) {
  const body = (Array.isArray(lines) ? lines : [lines]).filter(Boolean).join('\n');
  return `<blockquote>${body}</blockquote>`;
}

export function buildVisitMessage(when = new Date()) {
  return [
    brandHeader('Клієнт у меню'),
    '<i>Відкрив онлайн-меню кавʼярні</i>',
    '',
    metaLine(when),
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
  const itemLines = lines.map(formatReceiptLine);
  const total = Math.max(0, Math.round(Number(paidTotal) || 0));
  const freeCount = Math.max(0, Math.round(Number(freeClaimed) || 0));
  const isFreeOrder = total === 0 && freeCount > 0;

  const title = isFreeOrder ? 'Подарункове замовлення' : 'Нове замовлення';
  const summary = isFreeOrder
    ? '💰 <b>До сплати:</b> безкоштовно'
    : `💰 <b>До сплати:</b> ${escapeHtml(formatMoney(total))}`;

  return [
    brandHeader(title),
    '',
    wrapBlock(itemLines.length ? itemLines : ['Без позицій']),
    '',
    summary,
    freeCount > 0 && !isFreeOrder
      ? `🎁 Подарунок: ${freeCount} ${freeCount === 1 ? 'кава' : 'кави'}`
      : null,
    provider ? `💳 ${escapeHtml(provider)}` : null,
    '',
    metaLine(when),
  ].filter((line) => line != null && line !== false).join('\n');
}

export function buildFreeCoffeeReceiptMessage({ lines = [], when = new Date() } = {}) {
  const itemLines = lines.map((line) => {
    const name = escapeHtml(line?.name || 'Кава');
    const qty = formatQty(line?.qty);
    const freeQty = Math.max(0, Math.round(Number(line?.freeQty) || 0));
    if (freeQty > 0) {
      return `${name} ×${qty} — <i>10-та кава</i>`;
    }
    const amount = Number(line?.amount) || 0;
    return `${name} ×${qty} — ${escapeHtml(formatMoney(amount * Number(line?.qty || 0)))}`;
  });

  return [
    brandHeader('10-та кава'),
    '<i>Клієнт отримав подарунок за лояльність</i>',
    '',
    wrapBlock(itemLines.length ? itemLines : ['Кава ×1 — подарунок']),
    '',
    metaLine(when),
  ].join('\n');
}

export function buildFeedbackMessage(message, when = new Date()) {
  const body = escapeHtml(String(message || '').trim());
  return [
    brandHeader('Відгук клієнта'),
    '',
    wrapBlock(body),
    '',
    metaLine(when),
  ].join('\n');
}

export function buildBotConnectedMessage(when = new Date()) {
  return [
    brandHeader('Сповіщення підключено'),
    `<i>${escapeHtml(BRAND_HANDLE)} · офіційний бот кавʼярні</i>`,
    '',
    wrapBlock([
      '👁 відвідування меню',
      '🧾 нові замовлення',
      '🎁 подарункові кави',
      '💬 відгуки клієнтів',
    ]),
    '',
    'Все готово — сповіщення будуть приходити сюди.',
    '',
    metaLine(when),
  ].join('\n');
}

export function buildBotStatusMessage({ chatId, when = new Date() } = {}) {
  return [
    brandHeader('Статус підключення'),
    `<i>${escapeHtml(BRAND_HANDLE)}</i>`,
    '',
    wrapBlock([
      'Статус: активний',
      chatId ? `Чат ID: ${escapeHtml(String(chatId))}` : 'Чат ID: невідомий',
    ]),
    '',
    'Цей чат отримує сповіщення кавʼярні.',
    '',
    metaLine(when),
  ].join('\n');
}
