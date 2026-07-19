import { getSessionUser, userIdentityKey } from './auth-lib.js';
import { getDeviceCoffeeStats } from './db.js';

export default async function handler(req, res) {
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
    const stats = await getDeviceCoffeeStats(deviceId);
    if (!stats) {
      res.status(503).json({ ok: false, error: 'db_unavailable' });
      return;
    }
    res.status(200).json({ ok: true, ...stats });
  } catch {
    res.status(502).json({ ok: false, error: 'my_coffee_failed' });
  }
}
