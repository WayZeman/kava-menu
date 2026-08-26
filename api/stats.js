import {
  createAdminToken,
  clearAdminCookie,
  requireAdmin,
  setAdminCookie,
  verifyStatsPassword,
} from './_lib/admin.js';
import {
  deleteMonthlySubscriptionByOrderId,
  deleteTransaction,
  insertExpense,
  insertIncome,
  listMonthlySubscriptions,
  listTransactions,
  restoreOrderedExtraStock,
  updateTransaction,
} from './_lib/db.js';

function normalizeIncome(body) {
  const label = String(body?.label || '').trim();
  const amount = Number(body?.amount);
  const id = String(body?.id || '').trim() || null;
  const category = String(body?.category || 'drinks').trim();

  if (!label || label.length > 120) return null;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return null;

  const source = category === 'extras'
    ? 'cash-extras'
    : category === 'services'
      ? 'cash-services'
      : category === 'youtube'
        ? 'cash-youtube'
        : 'cash-drinks';

  return { id, label, amount, source, provider: 'cash' };
}

function normalizeExpense(body) {
  const label = String(body?.label || '').trim();
  const amount = Number(body?.amount);
  const id = String(body?.id || '').trim() || null;
  const category = String(body?.category || 'drinks').trim();

  if (!label || label.length > 120) return null;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return null;

  return { id, label, amount, category };
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
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const type = String(req.body?.type || '').trim();

    if (type === 'login') {
      const password = String(req.body?.password || '').trim();
      if (!verifyStatsPassword(password)) {
        res.status(401).json({ ok: false, error: 'invalid_password' });
        return;
      }

      try {
        const token = await createAdminToken();
        setAdminCookie(res, token);
        res.status(200).json({ ok: true });
      } catch {
        res.status(503).json({ ok: false, error: 'admin_misconfigured' });
      }
      return;
    }

    if (type === 'logout') {
      clearAdminCookie(res);
      res.status(200).json({ ok: true });
      return;
    }

    if (!(await requireAdmin(req, res))) return;

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

      try {
        await deleteMonthlySubscriptionByOrderId(id);
      } catch {
        // optional cleanup
      }

      if (
        req.body?.restoreStock === true
        && removed.kind === 'income'
        && Array.isArray(removed.items)
        && removed.items.length
      ) {
        try {
          await restoreOrderedExtraStock(removed.items);
        } catch {
          // do not fail delete if stock restore fails
        }
      }

      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ ok: false, error: 'invalid_type' });
    return;
  }

  if (req.method === 'GET') {
    if (!(await requireAdmin(req, res))) return;
    const data = await listTransactions();
    let subscriptions = [];
    try {
      subscriptions = await listMonthlySubscriptions({ activeOnly: false });
    } catch {
      subscriptions = [];
    }
    res.status(200).json({ ok: true, ...data, subscriptions });
    return;
  }

  res.status(405).send('Method not allowed');
}
