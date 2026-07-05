import {
  deleteTransaction,
  insertExpense,
  insertIncome,
  listTransactions,
  updateTransaction,
} from './db.js';

function normalizeIncome(body) {
  const label = String(body?.label || '').trim();
  const amount = Number(body?.amount);
  const id = String(body?.id || '').trim() || null;

  if (!label || label.length > 120) return null;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return null;

  return { id, label, amount, source: 'cash', provider: 'cash' };
}

function normalizeExpense(body) {
  const label = String(body?.label || '').trim();
  const amount = Number(body?.amount);
  const id = String(body?.id || '').trim() || null;

  if (!label || label.length > 120) return null;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return null;

  return { id, label, amount };
}

function normalizeOrder(body) {
  const items = body?.items;
  if (!Array.isArray(items) || !items.length || items.length > 30) return null;

  const lines = [];
  let total = 0;

  for (const item of items) {
    const name = String(item?.name || '').trim();
    const qty = Number(item?.qty);
    const amount = Number(item?.amount);

    if (!name || !Number.isFinite(qty) || qty <= 0 || qty > 99) return null;
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;

    total += amount * qty;
    lines.push({
      id: String(item?.id || '').trim() || null,
      name,
      qty,
      amount,
    });
  }

  const parsedTotal = Number(body?.total);
  if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
    total = parsedTotal;
  }

  const label = lines.map((item) => `${item.name} × ${item.qty}`).join(', ');

  return {
    label,
    amount: total,
    source: 'order',
    provider: String(body?.provider || '').trim() || 'bank',
    items: lines,
  };
}

function normalizeUpdate(body) {
  const id = String(body?.id || '').trim();
  const label = body?.label !== undefined ? String(body.label).trim() : undefined;
  const amount = body?.amount !== undefined ? Number(body.amount) : undefined;

  if (!id) return null;
  if (label !== undefined && (!label || label.length > 120)) return null;
  if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0 || amount > 10000000)) {
    return null;
  }
  if (label === undefined && amount === undefined) return null;

  return { id, label, amount };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const data = await listTransactions();
    res.status(200).json({ ok: true, ...data });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const type = String(req.body?.type || '').trim();

  if (type === 'income' || type === 'cash') {
    const income = normalizeIncome(req.body);
    if (!income) {
      res.status(400).json({ ok: false, error: 'invalid_income' });
      return;
    }

    const result = await insertIncome(income);
    if (!result?.record) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json({ ok: true, income: result.record });
    return;
  }

  if (type === 'order') {
    const order = normalizeOrder(req.body);
    if (!order) {
      res.status(400).json({ ok: false, error: 'invalid_order' });
      return;
    }

    const result = await insertIncome(order);
    if (!result?.record) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json({ ok: true, income: result.record });
    return;
  }

  if (type === 'expense') {
    const expense = normalizeExpense(req.body);
    if (!expense) {
      res.status(400).json({ ok: false, error: 'invalid_expense' });
      return;
    }

    const saved = await insertExpense(expense);
    if (!saved) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json({ ok: true, expense: saved });
    return;
  }

  if (type === 'update') {
    const payload = normalizeUpdate(req.body);
    if (!payload) {
      res.status(400).json({ ok: false, error: 'invalid_update' });
      return;
    }

    const saved = await updateTransaction(payload);
    if (!saved) {
      res.status(404).json({ ok: false, error: 'not_found' });
      return;
    }

    res.status(200).json({ ok: true, transaction: saved });
    return;
  }

  if (type === 'delete' || type === 'delete_expense') {
    const id = String(req.body?.id || '').trim();
    if (!id) {
      res.status(400).json({ ok: false, error: 'invalid_id' });
      return;
    }

    const removed = await deleteTransaction(id);
    if (!removed) {
      res.status(404).json({ ok: false, error: 'not_found' });
      return;
    }

    res.status(200).json({ ok: true });
    return;
  }

  res.status(400).json({ ok: false, error: 'invalid_type' });
}
