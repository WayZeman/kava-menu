import {
  clearSessionCookie,
  firstNameFrom,
  getSessionUser,
} from '../auth-lib.js';
import { getUserById } from '../db.js';

export default async function handler(req, res) {
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
