import { getSessionUser, userIdentityKey } from './_lib/auth.js';
import { getDeviceCoffeeStats } from './_lib/db.js';

export default async function handler(req, res) {
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
