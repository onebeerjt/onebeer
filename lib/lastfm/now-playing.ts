import type { NowPlayingTrack } from "@/lib/types/content";

type LastFmTrack = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  date?: { uts?: string };
  "@attr"?: { nowplaying?: string };
};

type LastFmResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

export async function getNowPlaying(): Promise<NowPlayingTrack | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return null;
  }

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: "1"
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as LastFmResponse;
  const raw = data.recenttracks?.track;
  const firstTrack = Array.isArray(raw) ? raw[0] : raw;

  if (!firstTrack?.name || !firstTrack.artist?.["#text"]) {
    return null;
  }

  const playedAt = firstTrack.date?.uts
    ? new Date(Number(firstTrack.date.uts) * 1000).toISOString()
    : undefined;

  return {
    track: firstTrack.name,
    artist: firstTrack.artist["#text"],
    album: firstTrack.album?.["#text"] || undefined,
    url: firstTrack.url,
    isPlaying: firstTrack["@attr"]?.nowplaying === "true",
    playedAt
  };
}
