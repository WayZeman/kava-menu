import * as jose from 'jose';

const ADMIN_COOKIE = 'kava_admin';
const ADMIN_HOURS = 12;

function getAdminSecret() {
  const secret = process.env.STATS_PASSWORD || process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function getStatsPassword() {
  return String(process.env.STATS_PASSWORD || '').trim() || null;
}

export function verifyStatsPassword(password) {
  const expected = getStatsPassword();
  if (!expected) return false;
  return String(password || '').trim() === expected;
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

export async function createAdminToken() {
  const secret = getAdminSecret();
  if (!secret) throw new Error('missing_stats_password');

  return new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_HOURS}h`)
    .sign(secret);
}

export async function verifyAdminToken(token) {
  const secret = getAdminSecret();
  if (!secret || !token) return false;

  try {
    const { payload } = await jose.jwtVerify(token, secret, { algorithms: ['HS256'] });
    return payload?.role === 'admin';
  } catch {
    return false;
  }
}

export function readAdminToken(req) {
  const cookies = parseCookies(req.headers?.cookie || req.headers?.Cookie);
  return cookies[ADMIN_COOKIE] || null;
}

export async function isAdminRequest(req) {
  return verifyAdminToken(readAdminToken(req));
}

export function buildAdminCookie(token, { clear = false } = {}) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const parts = [
    `${ADMIN_COOKIE}=${clear ? '' : encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (clear) parts.push('Max-Age=0');
  else parts.push(`Max-Age=${ADMIN_HOURS * 60 * 60}`);

  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function setAdminCookie(res, token) {
  res.setHeader('Set-Cookie', buildAdminCookie(token));
}

export function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', buildAdminCookie('', { clear: true }));
}

export async function requireAdmin(req, res) {
  if (await isAdminRequest(req)) return true;
  res.status(401).json({ ok: false, error: 'admin_required' });
  return false;
}
