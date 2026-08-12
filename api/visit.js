import { getDeviceLabel, registerVisitNotice } from './_lib/db.js';
import {
  buildDeviceBindHint,
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

  const config = getTelegramConfig();
  if (!config) {
    res.status(200).json({ ok: true, notified: false, reason: 'not_configured' });
    return;
  }

  const isStandalone = req.body?.standalone === true || req.body?.standalone === 'true';
  const source = isStandalone ? 'Застосунок (PWA)' : 'Браузер';
  const heading = await getDeviceHeading(deviceId, { visit: true });
  const label = await getDeviceLabel(deviceId);

  const lines = [
    heading,
    '',
    `📲 ${source}`,
    `🕐 ${formatKyivDateTime()}`,
  ];

  if (!label) {
    lines.push('', buildDeviceBindHint(deviceId));
  } else {
    lines.push('', `🆔 \`${formatDeviceRef(deviceId)}\``);
  }

  try {
    const sent = await sendTelegramMessage(config.token, config.chatId, lines.join('\n'));
    res.status(200).json({ ok: true, notified: sent, reason: sent ? 'sent' : 'telegram_error' });
  } catch {
    res.status(200).json({ ok: true, notified: false, reason: 'telegram_error' });
  }
}
