import { getTelegramConfig, sendTelegramMessage } from './_lib/telegram.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const config = getTelegramConfig();
  if (!config) {
    res.status(503).json({ ok: false, error: 'not_configured' });
    return;
  }

  const message = String(req.body?.message || '').trim();
  if (!message || message.length > 1000) {
    res.status(400).json({ ok: false, error: 'invalid_message' });
    return;
  }

  const text = `☕ Відгук з кавового меню:\n\n${message}`;

  try {
    const sent = await sendTelegramMessage(config.token, config.chatId, text);
    if (!sent) {
      res.status(502).json({ ok: false, error: 'telegram_error' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, error: 'telegram_error' });
  }
}
