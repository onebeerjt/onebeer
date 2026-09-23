import { getAllFilms } from "@/lib/letterboxd/archive";
import CopyFilmTitlesButton from "@/components/copy-film-titles-button";

export const revalidate = 3600;

function dateKey(value: string | undefined) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York"
  }).format(date);
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

function scoreFilm(film: Awaited<ReturnType<typeof getAllFilms>>[number]) {
  let score = 0;
  if (film.posterUrl) score += 3;
  if (film.reviewSnippet) score += 2;
  if (film.rating) score += 1;
  return score;
}

function dedupeFilms(films: Awaited<ReturnType<typeof getAllFilms>>) {
  const grouped = new Map<string, typeof films>();

  for (const film of films) {
    const year = film.year ?? "";
    const title = normalizeTitle(film.title, year);
    const key = `${title}|${year}|${dateKey(film.watchedAt)}`;
    const list = grouped.get(key) ?? [];
    list.push(film);
    grouped.set(key, list);
  }

  const merged: typeof films = [];
  for (const list of grouped.values()) {
    if (list.length === 1) {
      merged.push(list[0]);
      continue;
    }
    const best = list.reduce((acc, next) => (scoreFilm(next) > scoreFilm(acc) ? next : acc), list[0]);
    merged.push(best);
  }

  return merged;
}

function formatPlayedAt(value: string | undefined) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

export default async function FilmsPage() {
  const films = dedupeFilms(await getAllFilms(500));

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-[#f2efe9] sm:text-5xl">Films</h1>
        <div className="flex flex-wrap items-center gap-3">
          <p className="max-w-2xl text-sm text-[#94989f]">
            Everything pulled from JT&apos;s Letterboxd feed. New logs appear automatically.
          </p>
          <CopyFilmTitlesButton titles={films.map((film) => film.title)} />
        </div>
      </section>

      {films.length === 0 ? (
        <div className="card border-dashed p-6">
          <p className="text-sm leading-relaxed text-[#94989f]">No Letterboxd activity found yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {films.map((film, index) => (
            <article
              key={`${film.letterboxdUrl}-${index}`}
              className="card card-hover group relative flex items-start gap-4 p-4 transition-transform duration-200 md:hover:-translate-y-1 md:hover:shadow-xl"
            >
              <div className="h-20 w-14 flex-none overflow-hidden rounded-md border border-[#262b33] bg-[#1b1f26]">
                {film.posterUrl ? (
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-200 md:group-hover:scale-110"
                    style={{ backgroundImage: `url(${film.posterUrl})` }}
                    aria-label={`${film.title} poster`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-[#6f7480]">No Art</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href={film.letterboxdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-base font-semibold text-[#f2efe9] hover:text-[#ff8a3d] hover:underline"
                >
                  {film.title}
                  {film.year ? ` (${film.year})` : ""}
                  {film.rating ? ` - ${film.rating}` : ""}
                </a>
                <p className="font-mono text-xs text-[#6f7480]">{film.watchedAt ? formatPlayedAt(film.watchedAt) : "Recently"}</p>
                {film.reviewSnippet ? <p className="mt-2 text-sm text-[#94989f]">{film.reviewSnippet}</p> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
