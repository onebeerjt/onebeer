"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogueFilm } from "@/lib/letterboxd/catalogue";
import { formatShortDate, padSpine } from "@/lib/format";

const FALLBACK_TONES = ["#161616", "#2a2219", "#1b2320", "#3a1614", "#22201d"];
const SPINE_W = 52;
const CASE_MAX_W = 372;
const EASE_MS = 600;

const filmKey = (film: CatalogueFilm) => `${film.letterboxdUrl}-${film.spine}`;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CriterionShelf({ films, showCatalogueLink = true }: { films: CatalogueFilm[]; showCatalogueLink?: boolean }) {
  const [open, setOpen] = useState<{ key: string; width: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);

  const stopScroll = useCallback(() => cancelAnimationFrame(frame.current), []);

  // Glide the shelf so the opened case lands centred, tracking the width transition
  // frame by frame (a native smooth scroll would clamp to the not-yet-grown scrollWidth).
  const glideTo = useCallback(
    (el: HTMLElement, width: number, closingWidth: number, closingBefore: boolean) => {
      const box = scroller.current;
      if (!box) return;
      stopScroll();
      const settledLeft = el.offsetLeft - (closingBefore ? closingWidth - SPINE_W : 0);
      const target = Math.max(0, settledLeft - (box.clientWidth - width) / 2);
      const from = box.scrollLeft;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        box.scrollLeft = target;
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / EASE_MS);
        box.scrollLeft = from + (target - from) * easeOut(t);
        if (t < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [stopScroll]
  );

  useEffect(() => stopScroll, [stopScroll]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggle(film: CatalogueFilm, index: number, el: HTMLElement) {
    const key = filmKey(film);
    if (open?.key === key) {
      setOpen(null);
      return;
    }
    const box = scroller.current;
    const width = Math.min(CASE_MAX_W, Math.max(SPINE_W + 200, (box?.clientWidth ?? CASE_MAX_W) - 24));
    const openIndex = open ? films.findIndex((f) => filmKey(f) === open.key) : -1;
    setOpen({ key, width });
    glideTo(el, width, open?.width ?? 0, openIndex !== -1 && openIndex < index);
  }

  return (
    <div
      ref={scroller}
      onWheel={stopScroll}
      onTouchStart={stopScroll}
      className="relative flex items-end gap-[3px] overflow-x-auto pb-6 [scrollbar-width:thin]"
    >
      {films.map((film, index) => {
        const key = filmKey(film);
        const isOpen = open?.key === key;
        const date = formatShortDate(film.watchedAt);
        const panelId = `shelf-review-${film.spine}`;

        return (
          <div
            key={key}
            data-open={isOpen}
            className="spine relative flex h-[380px] flex-none overflow-hidden text-bone"
            style={{ backgroundColor: FALLBACK_TONES[index % FALLBACK_TONES.length], width: isOpen ? open.width : undefined }}
          >
            <button
              type="button"
              onClick={(e) => toggle(film, index, e.currentTarget.parentElement as HTMLElement)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={`No. ${film.spine}: ${film.title}${film.year ? ` (${film.year})` : ""}${film.rating ? `, rated ${film.rating}` : ""}`}
              className="spine-btn relative h-full flex-none cursor-pointer overflow-hidden text-left text-bone outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-marquee"
              style={{ width: isOpen ? SPINE_W : "100%" }}
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
            </button>

            <section
              id={panelId}
              role="region"
              aria-label={`${film.title} review`}
              aria-hidden={!isOpen}
              className="spine-case relative h-full min-w-0 flex-none overflow-hidden bg-ink"
              style={{ width: isOpen ? open.width - SPINE_W : 0 }}
            >
              {film.posterUrl ? (
                <div
                  aria-hidden
                  className="absolute inset-0 scale-125 bg-cover bg-center opacity-30 blur-2xl"
                  style={{ backgroundImage: `url(${film.posterUrl})` }}
                />
              ) : null}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-vice-night/90 via-ink/90 to-ink" />
              <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-vice-pink via-vice-purple to-vice-teal" />

              <div className="spine-case-inner relative flex h-full flex-col p-4" style={{ width: (open?.width ?? CASE_MAX_W) - SPINE_W }}>
                <div className="flex flex-none gap-3">
                  <div className="relative h-[138px] w-[92px] flex-none overflow-hidden border border-bone/20 bg-black shadow-[0_0_24px_rgba(176,38,255,0.35)]">
                    {film.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={film.posterUrl} alt={`Poster for ${film.title}`} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center p-2 text-center font-criterion text-[13px] italic text-smoke">{film.title}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-marquee">No. {padSpine(film.spine)}</p>
                    <h3 className="mt-1 font-criterion text-[22px] italic leading-[1.05] text-bone [text-wrap:balance]">{film.title}</h3>
                    {film.year ? <p className="mt-1 text-[11px] tracking-[0.12em] text-smoke">{film.year}</p> : null}
                    {film.rating ? (
                      <p aria-label={`Rated ${film.rating}`} className="mt-2 text-[14px] tracking-[0.08em] text-marquee [text-shadow:0_0_10px_rgba(242,194,0,0.5)]">
                        {film.rating}
                      </p>
                    ) : null}
                    {date ? <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-smoke">Watched {date}</p> : null}
                  </div>
                </div>

                <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
                  {film.reviewSnippet ? (
                    <p className="font-news text-[14px] leading-[1.55] text-bone/90">{film.reviewSnippet}</p>
                  ) : (
                    <p className="font-criterion text-[15px] italic text-smoke">Watched, no review written.</p>
                  )}
                </div>

                <div className="mt-3 flex flex-none items-center justify-between border-t border-bone/15 pt-3 text-[9px] uppercase tracking-[0.22em]">
                  <a
                    href={film.letterboxdUrl}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={isOpen ? 0 : -1}
                    className="text-smoke outline-none transition-colors hover:text-vice-teal focus-visible:text-vice-teal"
                  >
                    Full page on Letterboxd ↗
                  </a>
                  <button
                    type="button"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => setOpen(null)}
                    className="-mr-2 px-2 py-1 text-smoke outline-none transition-colors hover:text-marquee focus-visible:text-marquee"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      })}

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
