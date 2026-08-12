import { resolveDeviceId, setDeviceLabel } from './_lib/db.js';
import { formatDeviceRef, getTelegramConfig, sendTelegramMessage } from './_lib/telegram.js';

function normalizeChatId(value) {
  return String(value || '').trim();
}

function isAllowedChat(chatId) {
  const expected = normalizeChatId(process.env.TELEGRAM_CHAT_ID);
  const incoming = normalizeChatId(chatId);
  if (!expected || !incoming) return false;
  return incoming === expected;
}

function parseIdCommand(text) {
  const raw = String(text || '').trim();
  const match = raw.match(/^\/id(?:@\w+)?\s+(\S+)\s+(.+)$/i);
  if (!match) return null;

  const deviceToken = match[1].trim();
  const name = match[2].trim();
  if (!deviceToken || !name || name.length > 60) return null;

  return { deviceToken, name };
}

async function reply(token, chatId, text) {
  await sendTelegramMessage(token, chatId, text);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      hint: 'Telegram webhook endpoint. Set with setWebhook to this URL.',
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const config = getTelegramConfig();
  if (!config) {
    res.status(503).json({ ok: false, error: 'not_configured' });
    return;
  }

  const message = req.body?.message;
  if (!message?.text || !message.chat?.id) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!isAllowedChat(message.chat.id)) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  const text = String(message.text).trim();

  if (/^\/(start|help)(@\w+)?$/i.test(text)) {
    await reply(config.token, message.chat.id, [
      '*Команди бота*',
      '',
      '/id `<device_id>` `<імʼя>` — привʼязати імʼя до пристрою',
      'Приклад:',
      '/id device-abc123 Євген',
      '',
      'Після цього візити та замовлення будуть з іменем.',
    ].join('\n'));
    res.status(200).json({ ok: true });
    return;
  }

  const parsed = parseIdCommand(text);
  if (!parsed) {
    if (/^\/id(?:@\w+)?/i.test(text)) {
      await reply(
        config.token,
        message.chat.id,
        'Формат: /id `<device_id>` `<імʼя>`\nПриклад: /id device-abc123 Євген',
      );
    }
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const deviceId = await resolveDeviceId(parsed.deviceToken);
    if (!deviceId) {
      await reply(
        config.token,
        message.chat.id,
        'Не знайшов пристрій за цим ID. Скопіюйте ID з повідомлення про візит.',
      );
      res.status(200).json({ ok: true });
      return;
    }

    const saved = await setDeviceLabel(deviceId, parsed.name);
    if (!saved) {
      await reply(config.token, message.chat.id, 'Не вдалося зберегти імʼя. Спробуйте ще.');
      res.status(200).json({ ok: true });
      return;
    }

    await reply(
      config.token,
      message.chat.id,
      [
        `✅ Привʼязано: *${saved.displayName}*`,
        `🆔 \`${formatDeviceRef(saved.deviceId)}\``,
      ].join('\n'),
    );
    res.status(200).json({ ok: true });
  } catch {
    await reply(config.token, message.chat.id, 'Помилка під час збереження. Спробуйте ще.');
    res.status(200).json({ ok: false });
  }
}
