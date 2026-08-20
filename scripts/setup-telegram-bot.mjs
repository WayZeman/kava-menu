#!/usr/bin/env node
/**
 * Configure @barigacofe_bot profile: name, descriptions, commands, avatar.
 *
 * Usage:
 *   TELEGRAM_BOT_TOKEN=... node scripts/setup-telegram-bot.mjs
 *   node --env-file=.env.local scripts/setup-telegram-bot.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
  || '8994978328:AAF8Nwk4ZVviJ_KEq4LC16HmSTq7Q6cOykw';

const API = `https://api.telegram.org/bot${TOKEN}`;
const LOGO = resolve(process.cwd(), 'logos/telegram-bot.png');

async function call(method, body) {
  const response = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`${method}: ${data.description || 'failed'}`);
  }
  return data.result;
}

async function setProfilePhoto(filePath) {
  const bytes = readFileSync(filePath);
  const form = new FormData();
  form.append('photo', JSON.stringify({ type: 'static', photo: 'attach://file' }));
  form.append('file', new Blob([bytes], { type: 'image/png' }), 'telegram-bot.png');

  const response = await fetch(`${API}/setMyProfilePhoto`, {
    method: 'POST',
    body: form,
  });
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`setMyProfilePhoto: ${data.description || 'failed'}`);
  }
  return data.result;
}

const name = 'Кавове меню';
const shortDescription = 'Сповіщення кавʼярні: замовлення, візити, подарунки та відгуки клієнтів.';
const description = [
  'Офіційний бот кавʼярні «Кавове меню».',
  '',
  'Сюди приходять сповіщення про:',
  '• відвідування меню',
  '• нові замовлення та оплату',
  '• подарункові кави з програми лояльності',
  '• відгуки клієнтів',
  '',
  'Натисніть /start, щоб підключити цей чат до сповіщень.',
].join('\n');

await call('setMyName', { name });
await call('setMyShortDescription', { short_description: shortDescription });
await call('setMyDescription', { description });
await call('setMyCommands', {
  commands: [
    { command: 'start', description: 'Підключити сповіщення до цього чату' },
    { command: 'id', description: 'Показати статус підключення' },
  ],
});
await setProfilePhoto(LOGO);

console.log('Telegram bot profile configured:');
console.log(`- name: ${name}`);
console.log(`- username: @barigacofe_bot`);
console.log(`- avatar: ${LOGO}`);
