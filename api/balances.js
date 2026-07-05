const MONO_JAR_SHORT_ID = process.env.MONO_JAR_SHORT_ID || '4znkD4kdM5';
const PRIVAT_SEND_HASH = process.env.PRIVAT_SEND_HASH || 'jzbnv';
const PRIVAT_ENVELOPE_CARD = process.env.PRIVAT_ENVELOPE_CARD || '5168752152633551';

function randomPc() {
  return Math.random().toString(36).slice(2, 16);
}

function formatPrivatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function parsePrivatAmount(value) {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(String(value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(amount) ? amount : null;
}

async function fetchMonobankBalance() {
  try {
    const response = await fetch('https://send.monobank.ua/api/handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        c: 'hello',
        clientId: MONO_JAR_SHORT_ID,
        Pc: randomPc(),
      }),
    });

    if (!response.ok) {
      return { ok: false, provider: 'mono', error: 'fetch_failed' };
    }

    const data = await response.json();
    const kopecks = Number(data.jarAmount);
    if (!Number.isFinite(kopecks)) {
      return { ok: false, provider: 'mono', error: 'invalid_response' };
    }

    return {
      ok: true,
      provider: 'mono',
      amount: kopecks / 100,
      label: data.name || 'Банка Monobank',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return { ok: false, provider: 'mono', error: 'network_error' };
  }
}

async function fetchPrivatAutoclientBalance() {
  const id = process.env.PRIVAT24_AUTOCLIENT_ID;
  const token = process.env.PRIVAT24_AUTOCLIENT_TOKEN;
  const iban = process.env.PRIVAT_ENVELOPE_IBAN;
  const card = PRIVAT_ENVELOPE_CARD;

  if (!id || !token) return null;

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 2);

  const payload = {
    startDate: formatPrivatDate(start),
    endDate: formatPrivatDate(end),
  };

  if (iban) payload.acc = iban;

  try {
    const response = await fetch('https://acp.privatbank.ua/api/statements/interim/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf8',
        id,
        token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, provider: 'privat', error: 'fetch_failed' };
    }

    const data = await response.json();
    const balances = Array.isArray(data?.balances)
      ? data.balances
      : Array.isArray(data?.data?.balances)
        ? data.data.balances
        : [];

    if (!balances.length) {
      return { ok: false, provider: 'privat', error: 'empty_response' };
    }

    let row = balances[0];
    if (!iban && card) {
      const tail = card.slice(-4);
      const matched = balances.find((item) => {
        const haystack = [
          item.card,
          item.cardNum,
          item.acc,
          item.nameACC,
          item.name,
        ].map((part) => String(part || '')).join(' ');
        return haystack.includes(card) || haystack.includes(tail);
      });
      if (matched) row = matched;
    }

    const amount = parsePrivatAmount(
      row.balanceOut ?? row.balance ?? row.BALANCEOUT ?? row.balanceOutEq,
    );

    if (amount === null) {
      return { ok: false, provider: 'privat', error: 'parse_failed' };
    }

    return {
      ok: true,
      provider: 'privat',
      amount,
      label: row.nameACC || 'Конверт Приват24',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return { ok: false, provider: 'privat', error: 'network_error' };
  }
}

async function fetchPrivatSendBalance() {
  try {
    const response = await fetch(`https://www.privat24.ua/api/send/${PRIVAT_SEND_HASH}`, {
      headers: {
        Accept: 'application/json',
        Referer: `https://www.privat24.ua/send/${PRIVAT_SEND_HASH}`,
        'User-Agent': 'Mozilla/5.0 (compatible; KavaMenu/1.0)',
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return null;
    }

    const amount = parsePrivatAmount(data.balance ?? data.amount ?? data.sum);
    if (amount === null) {
      return {
        ok: false,
        provider: 'privat',
        error: data.message || 'unavailable',
      };
    }

    return {
      ok: true,
      provider: 'privat',
      amount,
      label: data.title || data.name || 'Конверт Приват24',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fetchPrivatBalance() {
  const autoclient = await fetchPrivatAutoclientBalance();
  if (autoclient) return autoclient;

  const send = await fetchPrivatSendBalance();
  if (send) return send;

  return { ok: false, provider: 'privat', error: 'unavailable' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const [mono, privat] = await Promise.all([
    fetchMonobankBalance(),
    fetchPrivatBalance(),
  ]);

  res.status(200).json({ ok: true, mono, privat });
}
