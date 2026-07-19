import { getSessionUser, userIdentityKey } from './auth-lib.js';
import { getFreeCoffeeBalance } from './db.js';

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
  const queryDeviceId = String(req.query?.deviceId || '').trim();
  const deviceId = session ? userIdentityKey(session.id) : queryDeviceId;

  if (!deviceId || deviceId.length > 120) {
    res.status(400).json({ ok: false, error: 'invalid_device' });
    return;
  }

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
