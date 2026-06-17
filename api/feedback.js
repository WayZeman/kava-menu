export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
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
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await telegramResponse.json();
    if (!data.ok) {
      res.status(502).json({ ok: false, error: 'telegram_error' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, error: 'telegram_error' });
  }
}
