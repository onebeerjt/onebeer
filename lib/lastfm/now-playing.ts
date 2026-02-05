import type { NowPlayingTrack } from "@/lib/types/content";

type LastFmImage = {
  "#text"?: string;
  size?: string;
};

type LastFmTrack = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  image?: LastFmImage[];
  date?: { uts?: string };
  "@attr"?: { nowplaying?: string };
};

type LastFmResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

function pickAlbumArt(images?: LastFmImage[]) {
  if (!images || images.length === 0) {
    return undefined;
  }

  const preferred = ["extralarge", "large", "medium", "small", ""];

  for (const size of preferred) {
    const item = images.find((image) => image.size === size && image["#text"]?.trim());
    if (item?.["#text"]) {
      return item["#text"].trim();
    }
  }

  return undefined;
}

function toTrack(raw: LastFmTrack): NowPlayingTrack | null {
  if (!raw.name || !raw.artist?.["#text"]) {
    return null;
  }

  const playedAt = raw.date?.uts ? new Date(Number(raw.date.uts) * 1000).toISOString() : undefined;

  return {
    track: raw.name,
    artist: raw.artist["#text"],
    album: raw.album?.["#text"] || undefined,
    albumArt: pickAlbumArt(raw.image),
    url: raw.url,
    isPlaying: raw["@attr"]?.nowplaying === "true",
    playedAt
  };
}

async function fetchRecentTracks(limit: number): Promise<NowPlayingTrack[]> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return [];
  }

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: String(limit)
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as LastFmResponse;
  const raw = data.recenttracks?.track;
  const tracks = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return tracks.map(toTrack).filter((track): track is NowPlayingTrack => track !== null);
}

export async function getNowPlaying(): Promise<NowPlayingTrack | null> {
  const tracks = await fetchRecentTracks(1);
  return tracks[0] ?? null;
}

export async function getRecentTracks(limit = 8): Promise<NowPlayingTrack[]> {
  const tracks = await fetchRecentTracks(limit);
  return tracks.sort((a, b) => {
    const aTime = a.playedAt ? new Date(a.playedAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.playedAt ? new Date(b.playedAt).getTime() : Number.MAX_SAFE_INTEGER;
    return bTime - aTime;
  });
}
