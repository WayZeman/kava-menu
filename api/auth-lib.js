import * as jose from 'jose';

const SESSION_COOKIE = 'kava_session';
const SESSION_DAYS = 365;
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

let googleJwks = null;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function getGoogleClientId() {
  return String(process.env.GOOGLE_CLIENT_ID || '').trim() || null;
}

export function userIdentityKey(userId) {
  return `user:${String(userId)}`;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of String(header).split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

export function readSessionToken(req) {
  const cookies = parseCookies(req.headers?.cookie || req.headers?.Cookie);
  return cookies[SESSION_COOKIE] || null;
}

export async function createSessionToken(user) {
  const secret = getAuthSecret();
  if (!secret) throw new Error('missing_auth_secret');

  return new jose.SignJWT({
    sub: user.id,
    name: user.name || '',
    email: user.email || '',
    picture: user.picture || '',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);
}

export async function verifySessionToken(token) {
  const secret = getAuthSecret();
  if (!secret || !token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, secret, { algorithms: ['HS256'] });
    const id = String(payload.sub || '').trim();
    if (!id) return null;
    return {
      id,
      name: String(payload.name || '').trim() || null,
      email: String(payload.email || '').trim() || null,
      picture: String(payload.picture || '').trim() || null,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(req) {
  return verifySessionToken(readSessionToken(req));
}

export function buildSessionCookie(token, { clear = false } = {}) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const parts = [
    `${SESSION_COOKIE}=${clear ? '' : encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (clear) {
    parts.push('Max-Age=0');
  } else {
    parts.push(`Max-Age=${SESSION_DAYS * 24 * 60 * 60}`);
  }

  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', buildSessionCookie(token));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', buildSessionCookie('', { clear: true }));
}

function getGoogleJwks() {
  if (!googleJwks) {
    googleJwks = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
  }
  return googleJwks;
}

export async function verifyGoogleIdToken(credential) {
  const clientId = getGoogleClientId();
  const token = String(credential || '').trim();
  if (!clientId || !token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, getGoogleJwks(), {
      issuer: GOOGLE_ISSUERS,
      audience: clientId,
    });

    const googleSub = String(payload.sub || '').trim();
    if (!googleSub) return null;

    return {
      googleSub,
      email: String(payload.email || '').trim() || null,
      emailVerified: payload.email_verified === true || payload.email_verified === 'true',
      name: String(payload.name || payload.given_name || '').trim() || null,
      picture: String(payload.picture || '').trim() || null,
    };
  } catch {
    return null;
  }
}

export function firstNameFrom(name, email) {
  const full = String(name || '').trim();
  if (full) return full.split(/\s+/)[0];
  const mail = String(email || '').trim();
  if (mail.includes('@')) return mail.split('@')[0];
  return 'гостю';
}
