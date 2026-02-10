import fs from "fs";
import path from "path";
import type { LatestFilm } from "@/lib/types/content";
import { getRecentFilms } from "@/lib/letterboxd/latest-film";

const ARCHIVE_PATH = path.join(process.cwd(), "data", "letterboxd-diary.csv");

const HEADER_ALIASES: Record<string, string[]> = {
  title: ["name", "title", "film"],
  year: ["year"],
  watchedAt: ["watcheddate", "watched date", "date"],
  rating: ["rating", "rating10", "rating/5"],
  review: ["review", "reviewtext", "review text"],
  url: ["letterboxduri", "letterboxd uri", "letterboxd url", "url", "uri"]
};

function parseCsvRow(row: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    const next = row[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsv(data: string): { headers: string[]; rows: string[][] } {
  const lines = data.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvRow(lines[0]).map((value) => value.trim().toLowerCase());
  const rows = lines.slice(1).map(parseCsvRow);

  return { headers, rows };
}

function findHeaderIndex(headers: string[], key: string): number {
  const options = HEADER_ALIASES[key] ?? [];
  return headers.findIndex((header) => options.includes(header));
}

function ratingToStars(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/[★\u2605]/u.test(trimmed)) {
    return trimmed;
  }

  const numeric = Number(trimmed);
  if (Number.isNaN(numeric)) {
    return trimmed;
  }

  const score = numeric > 5 ? numeric / 2 : numeric;
  const fullStars = Math.floor(score);
  const half = score - fullStars >= 0.5;
  const stars = "★".repeat(fullStars) + (half ? "½" : "");

  return stars || undefined;
}

function dateKey(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York"
  }).format(date);
}

function normalizeDate(raw: string): string | undefined {
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

function toFilm(headers: string[], row: string[]): LatestFilm | null {
  const titleIndex = findHeaderIndex(headers, "title");
  if (titleIndex === -1) {
    return null;
  }

  const title = row[titleIndex]?.trim();
  if (!title) {
    return null;
  }

  const yearIndex = findHeaderIndex(headers, "year");
  const watchedIndex = findHeaderIndex(headers, "watchedAt");
  const ratingIndex = findHeaderIndex(headers, "rating");
  const reviewIndex = findHeaderIndex(headers, "review");
  const urlIndex = findHeaderIndex(headers, "url");

  return {
    title,
    year: yearIndex >= 0 ? row[yearIndex]?.trim() || undefined : undefined,
    rating: ratingIndex >= 0 ? ratingToStars(row[ratingIndex] ?? "") : undefined,
    letterboxdUrl: urlIndex >= 0 ? row[urlIndex]?.trim() || "#" : "#",
    watchedAt: watchedIndex >= 0 ? normalizeDate(row[watchedIndex] ?? "") : undefined,
    reviewSnippet: reviewIndex >= 0 ? row[reviewIndex]?.trim() || undefined : undefined
  };
}

function readArchive(): LatestFilm[] {
  if (!fs.existsSync(ARCHIVE_PATH)) {
    return [];
  }

  const data = fs.readFileSync(ARCHIVE_PATH, "utf8");
  const { headers, rows } = parseCsv(data);

  return rows
    .map((row) => toFilm(headers, row))
    .filter((film): film is LatestFilm => film !== null);
}

async function fetchPosterFromLetterboxd(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) {
      return undefined;
    }
    const html = await response.text();
    const ogImage = html.match(/property="og:image" content="([^"]+)"/i)?.[1];
    if (ogImage) {
      return ogImage;
    }
    const twitterImage = html.match(/name="twitter:image" content="([^"]+)"/i)?.[1];
    return twitterImage || undefined;
  } catch {
    return undefined;
  }
}

function normalizeTitleForKey(title: string, year?: string) {
  const base = title
    .toLowerCase()
    .replace(/\(\d{4}\)/g, "")
    .replace(/,\s*\d{4}/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!year) return base;
  return base.replace(new RegExp(`\\b${year}\\b`, "g"), "").trim();
}

function bestFilmForGroup(films: LatestFilm[]): LatestFilm {
  const scored = films.map((film) => {
    let score = 0;
    if (film.posterUrl) score += 3;
    if (film.reviewSnippet) score += 2;
    if (film.rating) score += 1;
    if (film.letterboxdUrl && film.letterboxdUrl !== "#") score += 1;
    return { film, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.film ?? films[0];
}

function dedupeByTitleDate(items: LatestFilm[]): LatestFilm[] {
  const groups = new Map<string, LatestFilm[]>();

  for (const film of items) {
    const year = (film.year ?? "").toLowerCase().trim();
    const title = normalizeTitleForKey(film.title, year);
    const date = dateKey(film.watchedAt) || "unknown";
    const key = `${title}|${year}|${date}`;
    const list = groups.get(key) ?? [];
    list.push(film);
    groups.set(key, list);
  }

  return Array.from(groups.values()).map(bestFilmForGroup);
}

export async function getAllFilms(limit = 500): Promise<LatestFilm[]> {
  const [archive, recent] = await Promise.all([readArchive(), getRecentFilms(200)]);

  const recentDates = recent
    .map((film) => (film.watchedAt ? new Date(film.watchedAt) : null))
    .filter((date): date is Date => Boolean(date) && !Number.isNaN(date!.getTime()));

  const oldestRecent = recentDates.length
    ? new Date(Math.min(...recentDates.map((date) => date.getTime())))
    : null;

  const archiveOnly = oldestRecent
    ? archive.filter((film) => {
        if (!film.watchedAt) return true;
        const filmDate = new Date(film.watchedAt);
        if (Number.isNaN(filmDate.getTime())) return true;
        return filmDate.getTime() < oldestRecent.getTime();
      })
    : archive;

  const combined = [...recent, ...archiveOnly];
  const sorted = dedupeByTitleDate(combined)
    .sort((a, b) => {
      const aTime = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
      const bTime = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limit);

  const filled = await Promise.all(
    sorted.map(async (film) => {
      if (!film.posterUrl && film.letterboxdUrl) {
        const posterUrl = await fetchPosterFromLetterboxd(film.letterboxdUrl);
        return { ...film, posterUrl: posterUrl ?? film.posterUrl };
      }
      return film;
    })
  );

  return filled;
}
