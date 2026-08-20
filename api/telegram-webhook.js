import { saveTelegramChatIdToDb } from './_lib/db.js';
import { getTelegramBotToken, sendTelegramMessage } from './_lib/telegram.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const message = req.body?.message || req.body?.edited_message;
    const chatId = message?.chat?.id;
    if (chatId == null) {
      res.status(200).json({ ok: true });
      return;
    }

    const normalized = String(chatId);
    await saveTelegramChatIdToDb(normalized);

    const text = String(message?.text || '').trim().toLowerCase();
    if (text === '/start' || text.startsWith('/start ') || text === '/id') {
      await sendTelegramMessage(
        getTelegramBotToken(),
        normalized,
        '✅ Сповіщення з кавʼярні підключено до цього чату.',
      );
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({ ok: true });
  }
}
