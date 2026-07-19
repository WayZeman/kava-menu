import { getGoogleClientId } from '../auth-lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const clientId = getGoogleClientId();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    clientId,
    enabled: Boolean(clientId),
  });
}
