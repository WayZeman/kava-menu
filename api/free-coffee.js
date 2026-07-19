import { getSessionUser, userIdentityKey } from './_lib/auth.js';
import { getFreeCoffeeBalance } from './_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const session = await getSessionUser(req);
  if (!session) {
    res.status(401).json({ ok: false, error: 'auth_required' });
    return;
  }

  const deviceId = userIdentityKey(session.id);

  try {
    const balance = await getFreeCoffeeBalance(deviceId);
    if (!balance) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }

    res.status(200).json({ ok: true, ...balance });
  } catch {
    res.status(502).json({ ok: false, error: 'free_coffee_failed' });
  }
}
