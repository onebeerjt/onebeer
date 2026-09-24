import Link from "next/link";
import type { CatalogueFilm } from "@/lib/letterboxd/catalogue";
import { padSpine } from "@/lib/format";

const FALLBACK_TONES = ["#161616", "#2a2219", "#1b2320", "#3a1614", "#22201d"];

export function CriterionShelf({ films, showCatalogueLink = true }: { films: CatalogueFilm[]; showCatalogueLink?: boolean }) {
  return (
    <div className="flex items-end gap-[3px] overflow-x-auto pb-6 [scrollbar-width:thin]">
      {films.map((film, index) => (
        <a
          key={`${film.letterboxdUrl}-${film.spine}`}
          href={film.letterboxdUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`No. ${film.spine}: ${film.title}${film.year ? ` (${film.year})` : ""}${film.rating ? `, rated ${film.rating}` : ""}`}
          className="spine relative h-[380px] flex-none overflow-hidden text-bone outline-none focus-visible:ring-1 focus-visible:ring-marquee"
          style={{ backgroundColor: FALLBACK_TONES[index % FALLBACK_TONES.length] }}
        >
          {film.posterUrl ? (
            <div aria-hidden className="absolute inset-0 bg-center" style={{ backgroundImage: `url(${film.posterUrl})`, backgroundSize: "auto 100%" }} />
          ) : null}

          <div className="spine-label absolute inset-0 flex flex-col">
            {film.posterUrl ? <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" /> : null}
            <span className="relative flex h-9 flex-none items-center justify-center bg-bone text-[10px] font-semibold tracking-[0.06em] text-ink">
              {padSpine(film.spine)}
            </span>
            <span
              className="relative min-h-0 flex-1 overflow-hidden self-center py-4 font-criterion text-[17px] italic leading-none"
              style={{ writingMode: "vertical-rl", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              {film.title}
            </span>
            <span className="relative pb-3 text-center text-[9px] tracking-[0.1em] text-bone/80">{film.year ?? ""}</span>
          </div>

          <div className="spine-poster absolute inset-0">
            {film.posterUrl ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${film.posterUrl})` }} />
            ) : (
              <div className="absolute inset-0 bg-ink" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-16 text-left">
              <p className="text-[9px] uppercase tracking-[0.3em] text-marquee">No. {padSpine(film.spine)}</p>
              <p className="mt-1 font-criterion text-[20px] italic leading-tight text-bone">{film.title}</p>
              <p className="mt-1 text-[11px] tracking-[0.1em] text-marquee">{film.rating ?? ""}</p>
            </div>
          </div>
        </a>
      ))}

      {showCatalogueLink ? (
        <Link
          href="/films"
          className="flex h-[380px] w-[140px] flex-none flex-col items-center justify-center gap-3 border border-ash px-4 text-center text-[10px] uppercase tracking-[0.3em] text-smoke transition-colors hover:border-marquee hover:text-marquee"
        >
          <span>The full</span>
          <span>catalogue</span>
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}
