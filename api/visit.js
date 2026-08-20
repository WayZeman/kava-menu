import { getTelegramConfig, sendTelegramMessage, VISIT_MESSAGE } from './_lib/telegram.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const config = await getTelegramConfig();
  if (!config) {
    res.status(200).json({ ok: true, notified: false, reason: 'not_configured' });
    return;
  }

  try {
    const sent = await sendTelegramMessage(config.token, config.chatId, VISIT_MESSAGE);
    res.status(200).json({ ok: true, notified: sent, reason: sent ? 'sent' : 'telegram_error' });
  } catch {
    res.status(200).json({ ok: true, notified: false, reason: 'telegram_error' });
  }
}
