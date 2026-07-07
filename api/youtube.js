const CACHE_MS = 5 * 60 * 1000;
let cached = null;

async function fetchChannelStats(apiKey, channelId) {
  const params = new URLSearchParams({
    part: 'statistics,snippet',
    id: channelId,
    key: apiKey,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `youtube_api_${response.status}`);
  }

  const data = await response.json();
  const channel = data?.items?.[0];
  if (!channel) return null;

  const stats = channel.statistics || {};
  return {
    id: channel.id,
    title: channel.snippet?.title || '',
    subscribers: Number(stats.subscriberCount || 0),
    views: Number(stats.viewCount || 0),
    videos: Number(stats.videoCount || 0),
    updatedAt: new Date().toISOString(),
  };
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

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    res.status(200).json({ ok: false, error: 'not_configured' });
    return;
  }

  if (cached && Date.now() - cached.at < CACHE_MS) {
    res.status(200).json({ ok: true, channel: cached.channel, cached: true });
    return;
  }

  try {
    const channel = await fetchChannelStats(apiKey, channelId);
    if (!channel) {
      res.status(404).json({ ok: false, error: 'channel_not_found' });
      return;
    }

    cached = { channel, at: Date.now() };
    res.status(200).json({ ok: true, channel });
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: 'youtube_fetch_failed',
      message: error?.message || 'unknown',
    });
  }
}
