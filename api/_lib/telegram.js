import { getDeviceLabel } from './db.js';

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}

export function formatDeviceRef(deviceId) {
  const id = String(deviceId || '').trim();
  if (!id) return '—';
  return id.length <= 20 ? id : `${id.slice(0, 18)}…`;
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

export async function getDeviceName(deviceId) {
  return getDeviceLabel(deviceId);
}

function formatOrderLine(line) {
  const qty = Number(line.qty) || 1;
  const name = String(line.name || 'Позиція').trim();
  const lineTotal = line.amount * qty - (line.freeQty || 0) * line.amount;
  if (line.freeQty > 0 && lineTotal === 0) return `${name}×${qty} free`;
  if (line.freeQty > 0) return `${name}×${qty} ${lineTotal}`;
  return `${name}×${qty} ${line.amount * qty}`;
}

function providerCode(provider) {
  const value = String(provider || '').toLowerCase();
  if (value.includes('mono')) return 'm';
  if (value.includes('privat')) return 'p';
  if (value.includes('free') || value.includes('безк')) return '0';
  if (value.includes('other') || value.includes('інш')) return 'c';
  return 'b';
}

export async function buildVisitMessage(deviceId, { standalone = false } = {}) {
  const label = await getDeviceLabel(deviceId);
  if (label) return label;

  const tail = standalone ? ' app' : '';
  return `?${tail}\n${deviceId}\n/id ${deviceId}`;
}

export async function buildOrderMessage(deviceId, { lines = [], paidTotal = 0, provider = '' } = {}) {
  const label = await getDeviceLabel(deviceId);
  const head = label
    ? `${label} · ${paidTotal} · ${providerCode(provider)}`
    : `${paidTotal} · ${providerCode(provider)}`;
  const items = lines.map(formatOrderLine);
  const parts = [head, ...items];
  if (!label) parts.push(deviceId, `/id ${deviceId}`);
  return parts.join('\n');
}

export async function buildFreeCoffeeMessage(deviceId, { lines = [] } = {}) {
  const label = await getDeviceLabel(deviceId);
  const head = label ? `${label} · free` : 'free';
  const items = lines.map(formatOrderLine);
  const parts = [head, ...items];
  if (!label) parts.push(deviceId, `/id ${deviceId}`);
  return parts.join('\n');
}
