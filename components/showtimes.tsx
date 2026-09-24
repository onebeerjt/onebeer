import type { CatalogueFilm } from "@/lib/letterboxd/catalogue";

function screened(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

export function Showtimes({ films }: { films: CatalogueFilm[] }) {
  const [pick, ...listings] = films;
  if (!pick) return null;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-double border-ink pb-3">
        <div>
          <p className="font-pixel text-[10px] uppercase text-graphite">Arts &amp; entertainment</p>
          <h2 className="mt-1 text-[clamp(44px,6vw,76px)] font-bold uppercase leading-[0.9] tracking-[-0.03em]">Now Playing</h2>
        </div>
        <p className="pb-1 font-pixel text-[10px] uppercase text-graphite">Showtimes · One Beer Cinema, Miami</p>
      </div>

      <a
        href={pick.letterboxdUrl}
        target="_blank"
        rel="noreferrer"
        className="group mt-6 flex gap-5 border-4 border-ink bg-white p-4 shadow-[6px_6px_0_#ff2a6d] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#b026ff] sm:p-5"
      >
        {pick.posterUrl ? (
          <div
            role="img"
            aria-label={`${pick.title} poster`}
            className="aspect-[2/3] w-28 flex-none border-2 border-ink bg-cover bg-center grayscale transition-[filter] duration-500 group-hover:grayscale-0 sm:w-36"
            style={{ backgroundImage: `url(${pick.posterUrl})` }}
          />
        ) : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="holo-bg border border-ink px-1.5 py-0.5 font-pixel text-[9px] uppercase text-ink">Critic&apos;s pick</span>
            {screened(pick.watchedAt) ? (
              <span className="font-pixel text-[9px] uppercase text-graphite">Screened {screened(pick.watchedAt)}</span>
            ) : null}
          </div>
          <h3 className="mt-3 text-[clamp(26px,3.4vw,40px)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">{pick.title}</h3>
          {pick.year ? <p className="mt-1 font-pixel text-[10px] uppercase text-graphite">{pick.year}</p> : null}
          {pick.rating ? <p className="mt-2 text-[24px] leading-none text-vice-pink">{pick.rating}</p> : null}
          {pick.reviewSnippet ? (
            <p className="mt-3 text-[18px] italic leading-snug">
              &ldquo;{pick.reviewSnippet}&rdquo; <span className="not-italic text-graphite">— JT</span>
            </p>
          ) : null}
        </div>
      </a>

      {listings.length > 0 ? (
        <ol className="mt-8 gap-10 sm:columns-2 [column-rule:1px_solid_rgba(10,10,10,0.2)]">
          {listings.map((film) => (
            <li key={`${film.letterboxdUrl}-${film.spine}`} className="break-inside-avoid py-2.5">
              <div className="flex items-baseline gap-2">
                <a
                  href={film.letterboxdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 text-[16px] font-bold uppercase leading-tight tracking-[-0.01em] hover:text-vice-pink"
                >
                  {film.title}
                </a>
                <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-ink/35" />
                <span className="flex-none font-pixel text-[9px] uppercase">{screened(film.watchedAt) ?? "—"}</span>
              </div>
              <p className="mt-0.5 text-[13px] text-graphite">
                {film.rating ? <span className="text-vice-pink">{film.rating}</span> : "Unrated"}
                {film.year ? ` · ${film.year}` : ""}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
