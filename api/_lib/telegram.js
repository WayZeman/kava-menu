export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
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

export function buildOrderMessage({ lines = [], paidTotal = 0, provider = '' } = {}) {
  const head = `${paidTotal} · ${providerCode(provider)}`;
  const items = lines.map(formatOrderLine);
  return [head, ...items].join('\n');
}

export function buildFreeCoffeeMessage({ lines = [] } = {}) {
  const items = lines.map(formatOrderLine);
  return ['free', ...items].join('\n');
}
