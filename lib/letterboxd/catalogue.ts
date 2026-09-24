import { getAllFilms } from "@/lib/letterboxd/archive";
import type { LatestFilm } from "@/lib/types/content";

export type CatalogueFilm = LatestFilm & { spine: number };

function dateKey(value: string | undefined) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(date);
}

function normalizeTitle(title: string, year?: string) {
  const cleaned = title
    .toLowerCase()
    .replace(/\(\d{4}\)/g, "")
    .replace(/,\s*\d{4}/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!year) return cleaned;
  return cleaned.replace(new RegExp(`\\b${year}\\b`, "g"), "").trim();
}

function scoreFilm(film: LatestFilm) {
  let score = 0;
  if (film.posterUrl) score += 3;
  if (film.reviewSnippet) score += 2;
  if (film.rating) score += 1;
  return score;
}

function dedupeFilms(films: LatestFilm[]) {
  const grouped = new Map<string, LatestFilm[]>();

  for (const film of films) {
    const year = film.year ?? "";
    const key = `${normalizeTitle(film.title, year)}|${year}|${dateKey(film.watchedAt)}`;
    const list = grouped.get(key) ?? [];
    list.push(film);
    grouped.set(key, list);
  }

  return Array.from(grouped.values()).map((list) =>
    list.reduce((best, next) => (scoreFilm(next) > scoreFilm(best) ? next : best), list[0])
  );
}

function splitTrailingYear(film: LatestFilm): LatestFilm {
  if (film.year) return film;
  const match = film.title.match(/^(.*?),\s*(\d{4})$/);
  return match ? { ...film, title: match[1], year: match[2] } : film;
}

export async function getCatalogue(): Promise<CatalogueFilm[]> {
  const films = dedupeFilms((await getAllFilms(500)).map(splitTrailingYear));
  return films.map((film, index) => ({ ...film, spine: films.length - index }));
}
