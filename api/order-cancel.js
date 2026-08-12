import { cancelPendingOrder } from './_lib/db.js';

function normalizeDeviceId(value) {
  const id = String(value || '').trim();
  if (!id || id.length > 120) return null;
  return id;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const orderId = String(req.body?.id || '').trim();
  const deviceId = normalizeDeviceId(req.body?.deviceId);

  if (!orderId || !deviceId || orderId.length > 120) {
    res.status(400).json({ ok: false, error: 'invalid_request' });
    return;
  }

  try {
    const removed = await cancelPendingOrder({ orderId, deviceId });
    if (!removed) {
      res.status(404).json({ ok: false, error: 'not_found' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, error: 'cancel_failed' });
  }
}
