import Link from "next/link";
import type { CatalogueFilm } from "@/lib/letterboxd/catalogue";
import { padSpine } from "@/lib/format";

const SPINES = [
  { bg: "#161616", fg: "#ece5d5" },
  { bg: "#2a2219", fg: "#ece5d5" },
  { bg: "#ece5d5", fg: "#0a0a0a" },
  { bg: "#1b2320", fg: "#ece5d5" },
  { bg: "#3a1614", fg: "#ece5d5" },
  { bg: "#f2c200", fg: "#0a0a0a" },
  { bg: "#22201d", fg: "#c4bca9" }
];

export function CriterionShelf({ films }: { films: CatalogueFilm[] }) {
  return (
    <div className="flex items-end gap-[3px] overflow-x-auto pb-6 [scrollbar-width:thin]">
      {films.map((film, index) => {
        const tone = SPINES[index % SPINES.length];
        return (
          <a
            key={`${film.letterboxdUrl}-${film.spine}`}
            href={film.letterboxdUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`No. ${film.spine}: ${film.title}${film.year ? ` (${film.year})` : ""}${film.rating ? `, rated ${film.rating}` : ""}`}
            className="spine relative h-[380px] flex-none overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-marquee"
            style={{ backgroundColor: tone.bg, color: tone.fg }}
          >
            <div className="spine-label absolute inset-0 flex flex-col items-center justify-between py-4">
              <span className="text-[9px] font-medium tracking-[0.12em] opacity-70">{padSpine(film.spine)}</span>
              <span
                className="min-h-0 flex-1 overflow-hidden py-3 font-criterion text-[17px] italic leading-none"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {film.title}
              </span>
              <span className="text-[9px] tracking-[0.12em] opacity-70">{film.year ?? ""}</span>
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
        );
      })}

      <Link
        href="/films"
        className="flex h-[380px] w-[140px] flex-none flex-col items-center justify-center gap-3 border border-ash px-4 text-center text-[10px] uppercase tracking-[0.3em] text-smoke transition-colors hover:border-marquee hover:text-marquee"
      >
        <span>The full</span>
        <span>catalogue</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
