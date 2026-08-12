import { getFreeCoffeeBalance } from './_lib/db.js';

function normalizeDeviceId(value) {
  const id = String(value || '').trim();
  if (!id || id.length > 120) return null;
  return id;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const deviceId = normalizeDeviceId(req.query?.deviceId);
  if (!deviceId) {
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
