import type { Metadata } from "next";
import CopyFilmTitlesButton from "@/components/copy-film-titles-button";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { formatShortDate, padSpine } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Every film JT has logged on Letterboxd."
};

export const revalidate = 3600;

export default async function FilmsPage() {
  const films = await getCatalogue();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-36">
      <header className="flex flex-col gap-8 border-b border-ash/60 pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-marquee">The One Beer Collection</p>
          <h1 className="mt-4 font-criterion text-[clamp(52px,8vw,112px)] font-medium leading-[0.9] text-bone">The Catalogue</h1>
          <p className="mt-5 max-w-[46ch] font-criterion text-[20px] italic text-bone/70">
            {films.length} films, pulled straight from the Letterboxd diary. Spine numbers count up as the collection grows.
          </p>
        </div>
        <CopyFilmTitlesButton titles={films.map((film) => film.title)} />
      </header>

      {films.length === 0 ? (
        <p className="py-24 text-center text-[12px] tracking-[0.1em] text-smoke">[ the vault is empty ]</p>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-14 sm:grid-cols-3 lg:grid-cols-5">
          {films.map((film) => (
            <a key={`${film.letterboxdUrl}-${film.spine}`} href={film.letterboxdUrl} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-[2/3] overflow-hidden border border-bone/10 bg-ash/30">
                {film.posterUrl ? (
                  <div
                    className="h-full w-full bg-cover bg-center grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${film.posterUrl})` }}
                    role="img"
                    aria-label={`${film.title} poster`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4 text-center font-criterion text-[20px] italic text-bone/50">
                    {film.title}
                  </div>
                )}
                <span className="absolute left-2 top-2 bg-ink/80 px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-bone/80">
                  No. {padSpine(film.spine)}
                </span>
              </div>
              <p className="mt-3 font-criterion text-[19px] italic leading-tight text-bone transition-colors group-hover:text-marquee">{film.title}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-smoke">
                {[film.year, formatShortDate(film.watchedAt)].filter(Boolean).join(" · ")}
              </p>
              {film.rating ? <p className="mt-1.5 text-[13px] tracking-[0.1em] text-marquee">{film.rating}</p> : null}
              {film.reviewSnippet ? <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-bone/60">{film.reviewSnippet}</p> : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
