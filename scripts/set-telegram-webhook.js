#!/usr/bin/env node

const token = process.env.TELEGRAM_BOT_TOKEN;
const siteUrl = process.env.SITE_URL || 'https://kava-menu.vercel.app';

if (!token) {
  console.error('Set TELEGRAM_BOT_TOKEN in the environment.');
  process.exit(1);
}

const webhookUrl = `${siteUrl.replace(/\/$/, '')}/api/telegram-webhook`;

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: webhookUrl }),
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));

if (!data.ok) process.exit(1);
