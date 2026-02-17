import Link from "next/link";
import type { LabFilmItem } from "@/components/lab/types";

type LatestFilmsSectionProps = {
  films: LabFilmItem[];
};

function FilmCard({ film, featured = false }: { film: LabFilmItem; featured?: boolean }) {
  return (
    <Link
      href={film.letterboxdUrl}
      target="_blank"
      rel="noreferrer"
      className="group rounded-xl border border-[#d9ccb8] bg-[rgba(255,252,246,0.96)] p-2.5 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className={`overflow-hidden rounded border border-[#cdbfa6] bg-[#ece2cf] ${featured ? "aspect-[16/11] sm:aspect-[16/10]" : "aspect-[2/3]"}`}>
        {film.posterUrl ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-200 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${film.posterUrl})` }}
            aria-label={`${film.title} poster`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-[#6a5f55]">No Art</div>
        )}
      </div>
      <p className={`mt-2 line-clamp-2 font-semibold leading-snug text-[#1f1a16] ${featured ? "text-xl" : "text-base"}`}>{film.title}</p>
      <p className="font-mono text-xs tracking-[0.08em] text-[#6a5f55]">{film.rating ?? "No rating"}</p>
    </Link>
  );
}

export function LatestFilmsSection({ films }: LatestFilmsSectionProps) {
  const featured = films.slice(0, 2);
  const rest = films.slice(2);

  return (
    <section className="space-y-4 motion-safe:animate-[lab-fade-in_0.66s_ease-out]">
      <div className="flex items-end justify-between border-b border-[#ccbda4] pb-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8f1f1f]">Latest Films</p>
        <Link href="/films" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6a5f55] hover:text-[#8f1f1f]">
          View archive
        </Link>
      </div>

      {films.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#cdbfa6] p-4 text-sm text-[#5d5349]">No films loaded.</div>
      ) : (
        <>
          {featured.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {featured.map((film) => (
                <FilmCard key={`${film.letterboxdUrl}-${film.title}`} film={film} featured />
              ))}
            </div>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {rest.map((film) => (
                <FilmCard key={`${film.letterboxdUrl}-${film.title}`} film={film} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
