import { clearSessionCookie } from '../auth-lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
