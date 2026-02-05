import type { LatestFilm } from "@/lib/types/content";

function decodeHtml(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => {
      const parsed = Number(code);
      return Number.isNaN(parsed) ? "" : String.fromCharCode(parsed);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
      const parsed = Number.parseInt(hex, 16);
      return Number.isNaN(parsed) ? "" : String.fromCharCode(parsed);
    })
    .trim();
}

function stripTags(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanupText(input: string) {
  return decodeHtml(stripTags(input))
    .replace(/\]\]>/g, "")
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

function parseTitle(rawTitle: string) {
  const cleaned = cleanupText(rawTitle);
  const ratingMatch = cleaned.match(/\s-\s*([★\u2605]+(?:½)?)\s*$/u);
  const rating = ratingMatch?.[1];

  const withoutPrefix = cleaned
    .replace(/^.+\s(rewatched|reviewed|watched)\s/i, "")
    .replace(/^.+\slogged\s/i, "")
    .replace(/\s*-\s*[★\u2605\u00bd]+$/u, "")
    .trim();

  const yearMatch = withoutPrefix.match(/\((\d{4})\)\s*$/);
  const year = yearMatch?.[1];
  const title = year ? withoutPrefix.replace(/\(\d{4}\)\s*$/, "").trim() : withoutPrefix;

  return {
    title: title || cleaned,
    year,
    rating
  };
}

function extractPosterUrl(item: string) {
  const mediaContent = item.match(/<media:content[^>]*url="([^"]+)"/i)?.[1];
  if (mediaContent) {
    return mediaContent;
  }

  const img = item.match(/<img[^>]*src="([^"]+)"/i)?.[1];
  return img || undefined;
}

function extractReviewSnippet(item: string) {
  const description = extractTag(item, "description");
  if (!description) {
    return undefined;
  }

  const clean = cleanupText(description);
  if (!clean) {
    return undefined;
  }

  const clipped = clean.length > 240 ? `${clean.slice(0, 240).trim()}...` : clean;
  return clipped;
}

function parseItem(item: string): LatestFilm | null {
  const link = extractTag(item, "link");
  const titleRaw = extractTag(item, "title");
  const pubDate = extractTag(item, "pubDate");

  if (!link || !titleRaw) {
    return null;
  }

  const parsed = parseTitle(titleRaw);

  return {
    title: parsed.title,
    year: parsed.year,
    rating: parsed.rating,
    letterboxdUrl: link,
    watchedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
    posterUrl: extractPosterUrl(item),
    reviewSnippet: extractReviewSnippet(item)
  };
}

async function fetchFeed(): Promise<LatestFilm[]> {
  const rssUrl = process.env.LETTERBOXD_RSS_URL;

  if (!rssUrl) {
    return [];
  }

  const response = await fetch(rssUrl, {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    return [];
  }

  const xml = await response.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  return items
    .map(parseItem)
    .filter((item): item is LatestFilm => item !== null)
    .sort((a, b) => {
      const aTime = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
      const bTime = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function getLatestFilm(): Promise<LatestFilm | null> {
  const films = await fetchFeed();
  return films[0] ?? null;
}

export async function getRecentFilms(limit = 8): Promise<LatestFilm[]> {
  const films = await fetchFeed();
  return films.slice(0, limit);
}
