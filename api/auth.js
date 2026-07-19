import {
  clearSessionCookie,
  createSessionToken,
  firstNameFrom,
  getGoogleClientId,
  getSessionUser,
  setSessionCookie,
  userIdentityKey,
  verifyGoogleIdToken,
} from './_lib/auth.js';
import {
  getFreeCoffeeBalance,
  getUserById,
  mergeDeviceIntoUser,
  upsertGoogleUser,
} from './_lib/db.js';

function getAction(req) {
  const fromQuery = String(req.query?.action || '').trim().toLowerCase();
  if (fromQuery) return fromQuery;

  const url = String(req.url || '');
  if (url.includes('/auth/config')) return 'config';
  if (url.includes('/auth/google')) return 'google';
  if (url.includes('/auth/logout')) return 'logout';
  if (url.includes('/auth/me')) return 'me';
  return 'me';
}

async function handleConfig(req, res) {
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

async function handleMe(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  res.setHeader('Cache-Control', 'no-store');

  const session = await getSessionUser(req);
  if (!session) {
    res.status(200).json({ ok: true, user: null });
    return;
  }

  let user = null;
  try {
    user = await getUserById(session.id);
  } catch {
    user = null;
  }

  if (!user) {
    clearSessionCookie(res);
    res.status(200).json({ ok: true, user: null });
    return;
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
  });
}

async function handleGoogle(req, res) {
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

async function handleLogout(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}

export default async function handler(req, res) {
  const action = getAction(req);

  if (action === 'config') return handleConfig(req, res);
  if (action === 'google') return handleGoogle(req, res);
  if (action === 'logout') return handleLogout(req, res);
  return handleMe(req, res);
}
