import type { LatestFilm } from "@/lib/types/content";

function decodeHtml(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function stripTags(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

function parseTitle(rawTitle: string) {
  const cleaned = decodeHtml(stripTags(rawTitle));
  const withoutPrefix = cleaned
    .replace(/^.+\s(rewatched|reviewed|watched)\s/i, "")
    .replace(/^.+\slogged\s/i, "")
    .trim();

  const yearMatch = withoutPrefix.match(/\((\d{4})\)\s*$/);
  const year = yearMatch?.[1];
  const title = year ? withoutPrefix.replace(/\(\d{4}\)\s*$/, "").trim() : withoutPrefix;

  return {
    title: title || cleaned,
    year
  };
}

export async function getLatestFilm(): Promise<LatestFilm | null> {
  const rssUrl = process.env.LETTERBOXD_RSS_URL;

  if (!rssUrl) {
    return null;
  }

  const response = await fetch(rssUrl, {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    return null;
  }

  const xml = await response.text();
  const itemMatch = xml.match(/<item>[\s\S]*?<\/item>/i);

  if (!itemMatch) {
    return null;
  }

  const item = itemMatch[0];
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
    letterboxdUrl: link,
    watchedAt: pubDate ? new Date(pubDate).toISOString() : undefined
  };
}
