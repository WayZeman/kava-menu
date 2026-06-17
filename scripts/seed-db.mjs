import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const seedPath = new URL('../data/seed.json', import.meta.url);
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const sql = neon(url);

async function upsert(item, kind) {
  await sql`
    INSERT INTO transactions (id, kind, label, amount, source, provider, items, created_at, updated_at)
    VALUES (
      ${item.id},
      ${kind},
      ${item.label},
      ${item.amount},
      ${item.source || null},
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
}

let synced = 0;

for (const item of seed.incomes || []) {
  await upsert(item, 'income');
  synced += 1;
}

for (const item of seed.expenses || []) {
  await upsert(item, 'expense');
  synced += 1;
}

console.log(`Seeded ${synced} transactions`);
