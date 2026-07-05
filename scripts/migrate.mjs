import { chromium } from 'playwright-core';
import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnvFile(name) {
  const path = join(root, name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_]+)="?(.*)"?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

loadEnvFile('.env.development.local');
loadEnvFile('.env.production.local');

const browserProfiles = [
  join(process.env.HOME, 'Library/Application Support/Cursor/Partitions/cursor-browser'),
  join(process.env.HOME, 'Library/Application Support/Google/Chrome/Default'),
  join(process.env.HOME, 'Library/Application Support/Google/Chrome/Profile 1'),
].filter((path) => existsSync(path));

const origins = [
  'https://kava-menu.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'file://',
];

async function readStatsFromPage(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem('kava-business-stats');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
}

function normalizeData(raw) {
  if (!raw) return { incomes: [], expenses: [] };

  if (Array.isArray(raw.incomes) || Array.isArray(raw.expenses)) {
    return {
      incomes: Array.isArray(raw.incomes) ? raw.incomes : [],
      expenses: Array.isArray(raw.expenses) ? raw.expenses : [],
    };
  }

  const incomes = Array.isArray(raw.orders)
    ? raw.orders.map((order) => ({
        id: order.id || `income-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: (order.items || []).map((item) => `${item.name} × ${item.qty}`).join(', ') || 'Замовлення',
        amount: Number(order.total || 0),
        source: 'order',
        provider: order.provider || 'bank',
        items: order.items || [],
        createdAt: order.createdAt || new Date().toISOString(),
      }))
    : [];

  return {
    incomes,
    expenses: Array.isArray(raw.expenses) ? raw.expenses : [],
  };
}

async function extractFromBrowser() {
  let best = { incomes: [], expenses: [] };

  for (const profile of browserProfiles) {
    let browser;
    try {
      browser = await chromium.launchPersistentContext(profile, {
        headless: true,
        channel: 'chrome',
      });
    } catch {
      continue;
    }

    try {
      for (const origin of origins) {
        const page = await browser.newPage();
        try {
          const url = origin === 'file://' ? `file://${join(root, 'index.html')}` : origin;
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          const raw = await readStatsFromPage(page);
          const data = normalizeData(raw);
          const count = data.incomes.length + data.expenses.length;
          const bestCount = best.incomes.length + best.expenses.length;
          if (count > bestCount) best = data;
        } catch {
          // try next origin
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  }

  return best;
}

async function upsertToNeon(data) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');

  const sql = neon(url);
  let synced = 0;

  for (const item of data.incomes) {
    if (!item.id || !item.label || !item.amount) continue;
    await sql`
      INSERT INTO transactions (id, kind, label, amount, source, provider, items, created_at, updated_at)
      VALUES (
        ${item.id},
        'income',
        ${item.label},
        ${Number(item.amount)},
        ${item.source || 'cash'},
        ${item.provider || null},
        ${item.items || null},
        COALESCE(${item.createdAt}::timestamptz, NOW()),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        amount = EXCLUDED.amount,
        source = EXCLUDED.source,
        provider = EXCLUDED.provider,
        items = EXCLUDED.items,
        updated_at = NOW()
    `;
    synced += 1;
  }

  for (const item of data.expenses) {
    if (!item.id || !item.label || !item.amount) continue;
    await sql`
      INSERT INTO transactions (id, kind, label, amount, source, provider, items, created_at, updated_at)
      VALUES (
        ${item.id},
        'expense',
        ${item.label},
        ${Number(item.amount)},
        ${item.source || 'manual'},
        NULL,
        NULL,
        COALESCE(${item.createdAt}::timestamptz, NOW()),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        amount = EXCLUDED.amount,
        updated_at = NOW()
    `;
    synced += 1;
  }

  return synced;
}

const data = await extractFromBrowser();
const total = data.incomes.length + data.expenses.length;

if (!total) {
  console.error('No local stats found in browser storage.');
  process.exit(1);
}

const synced = await upsertToNeon(data);
console.log(`Migrated ${synced} records (${data.incomes.length} incomes, ${data.expenses.length} expenses)`);
