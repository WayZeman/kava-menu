const DEFAULT_CHANNELS = [
  'https://www.youtube.com/@КіноМить',
  'https://www.youtube.com/@LostChroniclesua',
];
const CACHE_MS = 5 * 60 * 1000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const cache = new Map();

function normalizeChannelUrl(input) {
  const raw = String(input || DEFAULT_CHANNELS[0]).trim();
  if (!raw) return DEFAULT_CHANNELS[0];

  if (raw.startsWith('@')) {
    return `https://www.youtube.com/${encodeURIComponent(raw)}`;
  }

  if (/^UC[\w-]{20,}$/i.test(raw)) {
    return `https://www.youtube.com/channel/${raw}`;
  }

  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    url.pathname = url.pathname
      .replace(/\/(shorts|videos|streams|playlists|featured|community|about)(\/.*)?$/, '')
      .replace(/\/$/, '');
    return url.toString();
  }

  return `https://www.youtube.com/${raw.replace(/^\//, '')}`;
}

function getChannelList() {
  if (process.env.YOUTUBE_CHANNEL_URLS) {
    return process.env.YOUTUBE_CHANNEL_URLS
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map(normalizeChannelUrl);
  }

  if (process.env.YOUTUBE_CHANNEL_URL) {
    return [normalizeChannelUrl(process.env.YOUTUBE_CHANNEL_URL)];
  }

  return DEFAULT_CHANNELS.map(normalizeChannelUrl);
}

function getCached(channelUrl) {
  const key = normalizeChannelUrl(channelUrl);
  const entry = cache.get(key);
  if (entry && Date.now() - entry.at < CACHE_MS) return entry.channel;
  return null;
}

function setCached(channelUrl, channel) {
  cache.set(normalizeChannelUrl(channelUrl), { channel, at: Date.now() });
}

function channelAboutUrl(channelUrl) {
  const url = new URL(normalizeChannelUrl(channelUrl));
  const path = url.pathname.replace(/\/about\/?$/, '').replace(/\/$/, '');
  url.pathname = `${path}/about`;
  return url.toString();
}

function findValue(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findValue(item, key);
      if (found) return found;
    }
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  for (const value of Object.values(obj)) {
    const found = findValue(value, key);
    if (found) return found;
  }
  return null;
}

function parseYoutubeCount(text) {
  if (!text) return 0;
  const raw = String(text).toLowerCase().replace(/\u00a0/g, ' ').trim();
  const numMatch = raw.match(/([\d\s]+(?:[.,]\d+)?)/);
  if (!numMatch) return 0;

  const num = Number.parseFloat(numMatch[1].replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(num)) return 0;

  if (raw.includes('млрд') || raw.includes('мільярд')) return Math.round(num * 1_000_000_000);
  if (raw.includes('млн') || raw.includes('мільйон')) return Math.round(num * 1_000_000);
  if (raw.includes('тис') || raw.includes('тисяч')) return Math.round(num * 1_000);
  return Math.round(num);
}

function extractTitle(data, aboutModel) {
  const pageTitle = findValue(data, 'pageTitle');
  if (typeof pageTitle === 'string' && pageTitle.trim()) return pageTitle.trim();

  const displayUrl = aboutModel?.displayCanonicalChannelUrl;
  if (typeof displayUrl === 'string' && displayUrl.includes('@')) {
    return decodeURIComponent(displayUrl.split('@').pop());
  }

  return 'YouTube';
}

function parseInitialData(html) {
  const match = html.match(/var ytInitialData = ({.+?});<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function buildChannelStats(aboutModel, data, channelUrl) {
  if (!aboutModel) return null;

  return {
    id: aboutModel.channelId || null,
    title: extractTitle(data, aboutModel),
    subscribers: parseYoutubeCount(aboutModel.subscriberCountText),
    views: parseYoutubeCount(aboutModel.viewCountText),
    videos: parseYoutubeCount(aboutModel.videoCountText),
    url: normalizeChannelUrl(channelUrl),
    updatedAt: new Date().toISOString(),
  };
}

async function fetchViaApi(apiKey, channelUrl) {
  const url = new URL(normalizeChannelUrl(channelUrl));
  const params = new URLSearchParams({
    part: 'statistics,snippet',
    key: apiKey,
  });

  const handleMatch = url.pathname.match(/\/@([^/]+)/);
  if (handleMatch) {
    params.set('forHandle', decodeURIComponent(handleMatch[1]));
  } else {
    const channelMatch = url.pathname.match(/\/channel\/([^/]+)/);
    if (!channelMatch) return null;
    params.set('id', channelMatch[1]);
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  if (!response.ok) return null;

  const payload = await response.json();
  const channel = payload?.items?.[0];
  if (!channel) return null;

  const stats = channel.statistics || {};
  return {
    id: channel.id,
    title: channel.snippet?.title || 'YouTube',
    subscribers: Number(stats.subscriberCount || 0),
    views: Number(stats.viewCount || 0),
    videos: Number(stats.videoCount || 0),
    url: normalizeChannelUrl(channelUrl),
    updatedAt: new Date().toISOString(),
  };
}

async function scrapeChannelStats(channelUrl) {
  const response = await fetch(channelAboutUrl(channelUrl), {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`youtube_page_${response.status}`);
  }

  const html = await response.text();
  const data = parseInitialData(html);
  if (!data) throw new Error('youtube_parse_failed');

  const aboutModel = findValue(data, 'aboutChannelViewModel');
  const channel = buildChannelStats(aboutModel, data, channelUrl);
  if (!channel) throw new Error('youtube_channel_not_found');
  return channel;
}

async function fetchChannelStats(channelUrl) {
  const normalized = normalizeChannelUrl(channelUrl);
  const cachedChannel = getCached(normalized);
  if (cachedChannel) return cachedChannel;

  const apiKey = process.env.YOUTUBE_API_KEY;
  let channel = apiKey ? await fetchViaApi(apiKey, normalized) : null;
  if (!channel) channel = await scrapeChannelStats(normalized);

  setCached(normalized, channel);
  return channel;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const requestedUrl = req.query?.url;

  if (requestedUrl) {
    const normalized = normalizeChannelUrl(requestedUrl);
    const cachedChannel = getCached(normalized);
    if (cachedChannel) {
      res.status(200).json({ ok: true, channel: cachedChannel, cached: true });
      return;
    }

    try {
      const channel = await fetchChannelStats(normalized);
      res.status(200).json({ ok: true, channel });
    } catch (error) {
      res.status(502).json({
        ok: false,
        error: 'youtube_fetch_failed',
        message: error?.message || 'unknown',
      });
    }
    return;
  }

  try {
    const urls = getChannelList();
    const results = await Promise.allSettled(urls.map((url) => fetchChannelStats(url)));
    const channels = results
      .filter((result) => result.status === 'fulfilled' && result.value)
      .map((result) => result.value);

    if (!channels.length) {
      res.status(502).json({
        ok: false,
        error: 'youtube_fetch_failed',
        message: 'no_channels_loaded',
      });
      return;
    }

    res.status(200).json({
      ok: true,
      channels,
      channel: channels[0],
    });
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: 'youtube_fetch_failed',
      message: error?.message || 'unknown',
    });
  }
}
