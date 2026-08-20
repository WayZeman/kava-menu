import { checkVisitNoticeCooldown, recordVisitNotice } from './_lib/db.js';
import { getTelegramConfig, sendTelegramMessage, buildVisitMessage } from './_lib/telegram.js';

const VISIT_COOLDOWN_MINUTES = 5;

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
    notice = await checkVisitNoticeCooldown(deviceId, VISIT_COOLDOWN_MINUTES);
  } catch {
    notice = { shouldNotify: true, reason: 'db_error' };
  }

  if (!notice.shouldNotify) {
    res.status(200).json({
      ok: true,
      notified: false,
      reason: notice.reason,
      retryAfterSec: notice.retryAfterSec || null,
    });
    return;
  }

  const config = await getTelegramConfig();
  if (!config) {
    res.status(200).json({ ok: true, notified: false, reason: 'not_configured' });
    return;
  }

  try {
    const sent = await sendTelegramMessage(config.token, config.chatId, buildVisitMessage());
    if (sent) {
      try {
        await recordVisitNotice(deviceId);
      } catch {
        // telegram already sent
      }
    }
    res.status(200).json({ ok: true, notified: sent, reason: sent ? 'sent' : 'telegram_error' });
  } catch {
    res.status(200).json({ ok: true, notified: false, reason: 'telegram_error' });
  }
}
