import { getDeviceCoffeeStats } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const deviceId = String(req.query?.deviceId || '').trim();
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
