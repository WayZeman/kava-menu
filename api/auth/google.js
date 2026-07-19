import {
  createSessionToken,
  firstNameFrom,
  setSessionCookie,
  userIdentityKey,
  verifyGoogleIdToken,
} from '../auth-lib.js';
import { getFreeCoffeeBalance, mergeDeviceIntoUser, upsertGoogleUser } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const credential = req.body?.credential;
  const deviceId = String(req.body?.deviceId || '').trim();

  const googleUser = await verifyGoogleIdToken(credential);
  if (!googleUser) {
    res.status(401).json({ ok: false, error: 'invalid_google_token' });
    return;
  }

  let user;
  try {
    user = await upsertGoogleUser(googleUser);
  } catch {
    user = null;
  }

  if (!user) {
    res.status(503).json({ ok: false, error: 'db_unavailable' });
    return;
  }

  if (deviceId) {
    try {
      await mergeDeviceIntoUser(deviceId, user.id);
    } catch {
      // merge is best-effort
    }
  }

  let token;
  try {
    token = await createSessionToken(user);
  } catch {
    res.status(503).json({ ok: false, error: 'auth_misconfigured' });
    return;
  }

  setSessionCookie(res, token);

  const identity = userIdentityKey(user.id);
  let loyalty = null;
  try {
    loyalty = await getFreeCoffeeBalance(identity);
  } catch {
    loyalty = null;
  }

  res.status(200).json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      firstName: firstNameFrom(user.name, user.email),
      email: user.email,
      picture: user.picture,
    },
    identity,
    freeCoffee: loyalty,
  });
}
