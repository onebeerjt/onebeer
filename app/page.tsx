import Link from "next/link";
import { ChapterCard } from "@/components/chapter-card";
import { CreditsRoll } from "@/components/credits-roll";
import { CriterionShelf } from "@/components/criterion-shelf";
import { Reveal } from "@/components/reveal";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { getPostBySlug, getPostSubject, getPublishedPosts } from "@/lib/notion/posts";
import { formatLongDate, formatShortDate, padSpine } from "@/lib/format";
import type { NowPlayingTrack } from "@/lib/types/content";

export const revalidate = 300;

function firstParagraph(content: unknown) {
  if (!Array.isArray(content)) return "";
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const type = (block as { type?: string }).type ?? "";
    const text = (block as { text?: string }).text ?? "";
    if (!text || type.startsWith("heading")) continue;
    return text.length > 260 ? `${text.slice(0, 260).trim()}…` : text;
  }
  return "";
}

function dedupeTracks(tracks: NowPlayingTrack[]) {
  const seen = new Set<string>();
  return tracks.filter((track) => {
    const key = `${track.track}|${track.artist}|${track.playedAt ?? "now"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function Home() {
  const [catalogue, rawTracks, posts] = await Promise.all([getCatalogue(), getRecentTracks(40), getPublishedPosts()]);

  const tracks = dedupeTracks(rawTracks).slice(0, 24);
  const feature = catalogue[0];
  const shelf = catalogue.slice(1, 25);

  const scenes = await Promise.all(
    posts.slice(0, 3).map(async (post) => {
      const [detail, subject] = await Promise.all([getPostBySlug(post.slug), getPostSubject(post.id)]);
      return {
        ...post,
        action: subject || post.excerpt || firstParagraph(detail?.content)
      };
    })
  );

  return (
    <>
      <section className="projector relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden">
        {feature?.posterUrl ? (
          <div
            aria-hidden
            className="slow-zoom absolute inset-[-4%] bg-cover bg-center"
            style={{
              backgroundImage: `url(${feature.posterUrl})`,
              filter: "grayscale(1) contrast(1.15) brightness(0.32) blur(2px)"
            }}
          />
        ) : null}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        <div className="letterbox-bar top-0" aria-hidden />
        <div className="letterbox-bar bottom-0" aria-hidden />

        <div className="relative z-20 flex flex-col items-center px-6 text-center">
          <p className="credit text-[10px] uppercase tracking-[0.5em] text-bone/70 sm:text-[11px]" style={{ animationDelay: "0.8s" }}>
            One Beer Pictures presents
          </p>
          <p className="credit mt-4 text-[10px] uppercase tracking-[0.5em] text-bone/70 sm:text-[11px]" style={{ animationDelay: "2s" }}>
            A film by JT
          </p>
          <h1
            className="rise mt-10 font-chapter text-[clamp(84px,19vw,280px)] uppercase leading-[0.82] text-marquee"
            style={{ animationDelay: "3.1s" }}
          >
            One Beer
          </h1>
          <p className="rise mt-6 font-criterion text-[clamp(22px,3vw,34px)] italic text-bone" style={{ animationDelay: "3.8s" }}>
            thoughts &amp; streams on tap
          </p>
        </div>

        {feature ? (
          <p
            className="rise absolute bottom-[calc(9vh+18px)] right-5 z-20 max-w-[60vw] text-right text-[9px] uppercase tracking-[0.3em] text-bone/50 sm:right-8"
            style={{ animationDelay: "4.6s" }}
          >
            Backdrop: {feature.title}
            {feature.year ? ` (${feature.year})` : ""} — last thing I watched
          </p>
        ) : null}
        <a
          href="#chapter-one"
          className="rise absolute bottom-[calc(9vh+18px)] left-5 z-20 text-[9px] uppercase tracking-[0.4em] text-bone/60 transition-colors hover:text-marquee sm:left-8"
          style={{ animationDelay: "4.6s" }}
        >
          ↓ Roll film
        </a>
      </section>

      <ChapterCard id="chapter-one" number="One" title="The Pictures" note="What I've been watching" />

      {feature ? (
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <Reveal className="mx-auto w-full max-w-[360px] md:max-w-none">
            <a href={feature.letterboxdUrl} target="_blank" rel="noreferrer" className="group block">
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-smoke">No. {padSpine(feature.spine)}</p>
              <div className="aspect-[2/3] w-full overflow-hidden border border-bone/15 bg-ash/30 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                {feature.posterUrl ? (
                  <div
                    className="h-full w-full bg-cover bg-center grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${feature.posterUrl})` }}
                    role="img"
                    aria-label={`${feature.title} poster`}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-smoke">A picture</span>
                    <span className="font-criterion text-[clamp(28px,3.4vw,44px)] italic leading-tight text-bone/80">{feature.title}</span>
                    {feature.year ? <span className="text-[10px] tracking-[0.3em] text-smoke">{feature.year}</span> : null}
                  </div>
                )}
              </div>
            </a>
          </Reveal>

          <Reveal delay={250}>
            <p className="text-[10px] uppercase tracking-[0.42em] text-marquee">Now showing</p>
            <h2 className="mt-4 font-criterion text-[clamp(44px,6.4vw,92px)] font-medium leading-[0.95] text-bone">{feature.title}</h2>
            <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-smoke">
              {[feature.year, feature.watchedAt ? `Watched ${formatShortDate(feature.watchedAt)}` : null].filter(Boolean).join(" · ")}
            </p>
            {feature.rating ? <p className="mt-6 text-[28px] tracking-[0.12em] text-marquee">{feature.rating}</p> : null}
            {feature.reviewSnippet ? (
              <blockquote className="relative mt-8 max-w-[34ch] font-criterion text-[clamp(22px,2.4vw,30px)] italic leading-snug text-bone/90">
                <span aria-hidden className="absolute -left-6 -top-5 font-criterion text-[72px] leading-none text-marquee/60">
                  &ldquo;
                </span>
                {feature.reviewSnippet}
              </blockquote>
            ) : null}
            <a
              href={feature.letterboxdUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block border-b border-bone/30 pb-1 text-[10px] uppercase tracking-[0.35em] text-bone transition-colors hover:border-marquee hover:text-marquee"
            >
              Full review on Letterboxd →
            </a>
          </Reveal>
        </section>
      ) : (
        <p className="py-24 text-center text-[12px] tracking-[0.1em] text-smoke">[ projector warming up — no films logged yet ]</p>
      )}

      {shelf.length > 0 ? (
        <section className="mx-auto mt-32 max-w-6xl px-6">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-ash/60 pb-4">
              <p className="text-[10px] uppercase tracking-[0.42em] text-smoke">The collection</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ash">Hover a spine</p>
            </div>
            <CriterionShelf films={shelf} />
          </Reveal>
        </section>
      ) : null}

      <ChapterCard id="chapter-two" number="Two" title="The Sound" note="Original motion picture soundtrack" />

      <section className="mx-auto max-w-3xl px-6">
        <Reveal>
          <CreditsRoll tracks={tracks} />
        </Reveal>
      </section>

      <ChapterCard id="chapter-three" number="Three" title="The Words" note="Pages from the screenplay" />

      <section className="px-4">
        <Reveal>
          <div className="mx-auto max-w-[700px] bg-bone px-8 py-14 font-script text-[15px] leading-[1.65] text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] sm:px-16 sm:py-20 sm:text-[16px]">
            <p className="text-right">1.</p>
            <p className="mt-6">FADE IN:</p>

            {scenes.length === 0 ? (
              <p className="mt-8">The page is blank. The writer stares at it. Something is coming.</p>
            ) : (
              scenes.map((scene, index) => (
                <div key={scene.id} className="mt-10">
                  <Link href={`/blog/${scene.slug}`} className="group flex gap-4 font-bold uppercase">
                    <span className="w-6 flex-none">{index + 1}</span>
                    <span className="underline-offset-4 group-hover:underline">
                      INT. &ldquo;{scene.title}&rdquo; — {formatLongDate(scene.publishedAt)?.toUpperCase() ?? "UNDATED"}
                    </span>
                  </Link>
                  {scene.action ? <p className="mt-4 pl-10">{scene.action}</p> : null}
                  {index < scenes.length - 1 ? <p className="mt-6 text-right">CUT TO:</p> : null}
                </div>
              ))
            )}

            <p className="mt-12 text-right">FADE OUT.</p>
            <p className="mt-14 text-center">
              <Link href="/blog" className="underline underline-offset-4 hover:no-underline">
                READ THE FULL SCREENPLAYS
              </Link>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="font-chapter text-[clamp(72px,14vw,200px)] uppercase leading-none text-bone">The End</p>
        </Reveal>
        <Reveal delay={400}>
          <p className="mt-6 text-[10px] uppercase tracking-[0.42em] text-smoke">…until the next one</p>
        </Reveal>
      </section>
    </>
  );
}
