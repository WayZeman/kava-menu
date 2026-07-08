const DEFAULT_CHANNELS = [
  'https://www.youtube.com/@КіноМить/shorts',
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
    try {
      url.pathname = decodeURIComponent(url.pathname);
    } catch {
      // keep encoded pathname
    }
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
  const payload = { ...channel };
  if (Array.isArray(payload.uploads) && payload.uploads.length === 0) {
    delete payload.uploads;
  }
  cache.set(normalizeChannelUrl(channelUrl), { channel: payload, at: Date.now() });
}

const videoCache = new Map();

function getVideoCache(channelId) {
  const entry = videoCache.get(channelId);
  if (entry && entry.videos.length > 0 && Date.now() - entry.at < CACHE_MS) return entry.videos;
  return null;
}

function setVideoCache(channelId, videos) {
  if (!videos.length) return;
  videoCache.set(channelId, { videos, at: Date.now() });
}

function parseRssVideos(xml) {
  const entries = [];
  const blocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  blocks.forEach((block) => {
    const videoId = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const publishedAt = block.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!videoId || !publishedAt) return;

    const title = block.match(/<title>([^<]*)<\/title>/)?.[1] || '';
    const link = block.match(/<link rel="alternate" href="([^"]+)"/)?.[1]
      || `https://www.youtube.com/watch?v=${videoId}`;

    entries.push({
      id: videoId,
      title,
      publishedAt,
      url: link,
    });
  });

  return entries;
}

async function fetchVideosViaRss(channelId) {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/atom+xml, application/xml, text/xml, */*',
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`youtube_rss_${response.status}`);
  }

  const xml = await response.text();
  const videos = parseRssVideos(xml);
  if (!videos.length) {
    throw new Error('youtube_rss_empty');
  }

  return videos;
}

function extractVideoIdsFromHtml(html, limit = 30) {
  const ids = [...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
  return [...new Set(ids)].slice(0, limit);
}

async function fetchVideoIdsFromListing(listingUrl, limit = 30) {
  const response = await fetch(listingUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`youtube_listing_${response.status}`);
  }

  const html = await response.text();
  const ids = extractVideoIdsFromHtml(html, limit);
  if (!ids.length) {
    throw new Error('youtube_listing_empty');
  }

  return ids;
}

function decodeHtmlText(value) {
  return String(value || '')
    .replace(/\\u0026/g, '&')
    .replace(/\\"/g, '"')
    .replace(/\\\//g, '/');
}

async function fetchVideoMeta(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`youtube_video_${response.status}`);
  }

  const html = await response.text();
  const dateMatch = html.match(/"publishDate":"([^"]+)"/)
    || html.match(/itemprop="datePublished" content="([^"]+)"/);
  if (!dateMatch) return null;

  const titleMatch = html.match(/<meta name="title" content="([^"]+)"/)
    || html.match(/<meta property="og:title" content="([^"]+)"/);
  const publishedAt = new Date(dateMatch[1]);
  if (Number.isNaN(publishedAt.getTime())) return null;

  const isShort = /"url":"https:\/\/www\.youtube\.com\/shorts\//.test(html)
    || html.includes(`/shorts/${videoId}`);

  return {
    id: videoId,
    title: decodeHtmlText(titleMatch?.[1] || ''),
    publishedAt: publishedAt.toISOString(),
    url: isShort ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`,
  };
}

async function mapWithConcurrency(items, mapper, concurrency = 6) {
  const results = [];
  for (let index = 0; index < items.length; index += concurrency) {
    const chunk = items.slice(index, index + concurrency);
    const chunkResults = await Promise.allSettled(chunk.map(mapper));
    chunkResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    });
  }
  return results;
}

async function fetchVideosViaScrape(channelUrl, maxVideos = 15) {
  const baseUrl = normalizeChannelUrl(channelUrl);
  const listingCandidates = [
    String(channelUrl || '').includes('/shorts') ? String(channelUrl) : '',
    `${baseUrl}/shorts`,
    `${baseUrl}/videos`,
  ].filter(Boolean);

  let videoIds = [];
  for (const listingUrl of listingCandidates) {
    try {
      videoIds = await fetchVideoIdsFromListing(listingUrl, maxVideos);
      if (videoIds.length) break;
    } catch {
      // try next listing tab
    }
  }

  if (!videoIds.length) return [];

  const videos = await mapWithConcurrency(
    videoIds,
    (videoId) => fetchVideoMeta(videoId),
    6,
  );

  return videos.sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

async function fetchVideosViaApi(apiKey, channelId) {
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
  );
  if (!channelResponse.ok) return null;

  const channelPayload = await channelResponse.json();
  const uploadsPlaylistId = channelPayload?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) return null;

  const videos = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: '50',
      key: apiKey,
    });
    if (pageToken) params.set('pageToken', pageToken);

    const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
    if (!playlistResponse.ok) break;

    const playlistPayload = await playlistResponse.json();
    (playlistPayload?.items || []).forEach((item) => {
      const snippet = item?.snippet;
      const videoId = snippet?.resourceId?.videoId;
      const publishedAt = snippet?.publishedAt;
      if (!videoId || !publishedAt) return;

      videos.push({
        id: videoId,
        title: snippet?.title || '',
        publishedAt,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    });

    pageToken = playlistPayload?.nextPageToken || '';
  } while (pageToken && videos.length < 200);

  return videos;
}

async function fetchChannelVideos(channel, channelUrl) {
  const channelId = channel?.id;
  if (!channelId) return [];

  const cachedVideos = getVideoCache(channelId);
  if (cachedVideos) return cachedVideos;

  const apiKey = process.env.YOUTUBE_API_KEY;
  let videos = [];

  try {
    if (apiKey) {
      videos = await fetchVideosViaApi(apiKey, channelId) || [];
    }
    if (!videos.length) {
      try {
        videos = await fetchVideosViaRss(channelId);
      } catch {
        videos = [];
      }
    }
    if (!videos.length) {
      videos = await fetchVideosViaScrape(channelUrl || channel.url, 15);
    }
  } catch {
    videos = [];
  }

  setVideoCache(channelId, videos);
  return videos;
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
  let cachedChannel = getCached(normalized);
  if (cachedChannel) {
    if (!Array.isArray(cachedChannel.uploads) || cachedChannel.uploads.length === 0) {
      const uploads = await fetchChannelVideos(cachedChannel, normalized);
      cachedChannel = {
        ...cachedChannel,
        videoCount: cachedChannel.videoCount ?? cachedChannel.videos,
        uploads,
      };
      setCached(normalized, cachedChannel);
    }
    return cachedChannel;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  let channel = apiKey ? await fetchViaApi(apiKey, normalized) : null;
  if (!channel) channel = await scrapeChannelStats(normalized);

  const uploads = await fetchChannelVideos(channel, normalized);
  channel = {
    ...channel,
    videoCount: channel.videos,
    uploads,
  };

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
    if (cachedChannel && Array.isArray(cachedChannel.uploads) && cachedChannel.uploads.length > 0) {
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
