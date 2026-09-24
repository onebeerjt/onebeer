import Image from "next/image";
import Link from "next/link";
import { CriterionShelf } from "@/components/criterion-shelf";
import { MySpaceProfile, TopEight, type TopArtist } from "@/components/myspace-profile";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { getPostBySlug, getPostSubject, getPublishedPosts } from "@/lib/notion/posts";
import { getStatusInfo } from "@/lib/notion/status";
import { formatLongDate } from "@/lib/format";
import type { NowPlayingTrack } from "@/lib/types/content";

export const revalidate = 300;

type Block = { id: string; type: string; text: string; url?: string };

function topArtists(tracks: NowPlayingTrack[]): TopArtist[] {
  const counts = new Map<string, TopArtist>();
  let previous = "";

  for (const track of tracks) {
    const key = `${track.track}|${track.artist}`.toLowerCase();
    if (key === previous) continue;
    previous = key;

    const entry = counts.get(track.artist) ?? { artist: track.artist, plays: 0 };
    entry.plays += 1;
    if (!entry.art && track.albumArt) entry.art = track.albumArt;
    counts.set(track.artist, entry);
  }

  return Array.from(counts.values())
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 8);
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="holo-bg inline-block border border-ink px-2 py-0.5 font-pixel text-[10px] uppercase text-ink">{children}</span>;
}

export default async function FrontPage() {
  const [posts, catalogue, tracks, status] = await Promise.all([
    getPublishedPosts(),
    getCatalogue(),
    getRecentTracks(50),
    getStatusInfo()
  ]);

  const lead = posts[0];
  const others = posts.slice(1, 7);

  const [leadDetail, subjects] = await Promise.all([
    lead ? getPostBySlug(lead.slug) : Promise.resolve(null),
    Promise.all(posts.slice(0, 7).map((post) => getPostSubject(post.id)))
  ]);

  const leadBlocks = ((leadDetail?.content as Block[] | undefined) ?? []).filter((block) => block.text || block.url);
  const leadParagraphs = leadBlocks.filter((block) => block.type === "paragraph" && block.text).slice(0, 4);
  const leadImage = leadBlocks.find((block) => block.type === "image" && block.url)?.url;
  const leadDeck = subjects[0] || lead?.excerpt;

  const latestFilm = catalogue[0];
  const artists = topArtists(tracks);

  return (
    <>
      <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {lead ? (
            <article className="border-b-2 border-ink pb-10">
              <Kicker>Latest dispatch</Kicker>
              <h2 className="mt-4 text-[clamp(40px,6vw,78px)] font-bold leading-[0.95] tracking-[-0.02em]">
                <Link href={`/blog/${lead.slug}`} className="decoration-holo-pink decoration-4 underline-offset-8 hover:underline">
                  {lead.title}
                </Link>
              </h2>
              {leadDeck ? <p className="mt-4 text-[clamp(20px,2.2vw,26px)] italic leading-snug text-graphite">{leadDeck}</p> : null}
              <p className="mt-5 border-y border-ink/25 py-2 font-pixel text-[10px] uppercase">
                By JT · {formatLongDate(lead.publishedAt) ?? "Undated"} · Miami
              </p>

              {leadImage ? (
                <figure className="mt-6 border-2 border-ink">
                  <Image
                    src={leadImage}
                    alt={`${lead.title}`}
                    width={1400}
                    height={800}
                    unoptimized
                    className="h-auto w-full grayscale transition-[filter] duration-700 hover:grayscale-0"
                  />
                </figure>
              ) : null}

              {leadParagraphs.length > 0 ? (
                <div className="mt-6 gap-10 text-[18px] leading-[1.65] md:columns-2 [column-rule:1px_solid_rgba(10,10,10,0.2)]">
                  {leadParagraphs.map((block, index) => (
                    <p key={block.id} className={index === 0 ? "drop-cap mb-4" : "mb-4"}>
                      {block.text}
                    </p>
                  ))}
                </div>
              ) : null}

              <Link
                href={`/blog/${lead.slug}`}
                className="mt-6 inline-block font-pixel text-[11px] uppercase decoration-holo-pink decoration-2 underline-offset-4 hover:underline"
              >
                Story continues →
              </Link>
            </article>
          ) : (
            <p className="border-b-2 border-ink pb-10 text-[22px] italic text-graphite">The presses are warming up. First dispatch coming soon.</p>
          )}

          {others.length > 0 ? (
            <section className="mt-10">
              <h3 className="flex items-center gap-4 font-pixel text-[11px] uppercase">
                <span className="h-px flex-1 bg-ink" />
                More from the desk
                <span className="h-px flex-1 bg-ink" />
              </h3>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {others.map((post, index) => (
                  <article
                    key={post.id}
                    className="rounded-lg border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#0a0a0a] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[9px_9px_0_#ff4fd8]"
                  >
                    <header className="flex items-center gap-3">
                      <span className="holo-bg grid h-9 w-9 flex-none place-items-center rounded border border-ink font-fraktur text-[18px]">JT</span>
                      <div>
                        <p className="font-pixel text-[10px] uppercase">onebeerjt</p>
                        <p className="text-[12px] text-graphite">{formatLongDate(post.publishedAt) ?? "Undated"}</p>
                      </div>
                    </header>
                    <h4 className="mt-4 text-[28px] font-bold leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h4>
                    {subjects[index + 1] || post.excerpt ? (
                      <p className="mt-2 text-[17px] italic leading-snug text-graphite">{subjects[index + 1] || post.excerpt}</p>
                    ) : null}
                    <Link href={`/blog/${post.slug}`} className="mt-4 inline-block font-pixel text-[10px] uppercase text-link underline underline-offset-2">
                      Keep reading →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-8">
          <MySpaceProfile
            mood={status.note}
            moodUpdatedAt={status.updatedAt}
            track={tracks[0] ?? null}
            filmsCount={catalogue.length}
            postsCount={posts.length}
          />
          <TopEight artists={artists} sample={tracks.length} />
          <section className="border-2 border-dashed border-ink p-5 text-center">
            <p className="font-pixel text-[10px] uppercase">Miami forecast</p>
            <p className="mt-1 text-[34px] font-bold leading-none">100% chance</p>
            <p className="mt-1 italic text-graphite">of one more beer</p>
          </section>
        </aside>
      </div>

      <section className="relative -mx-4 mt-6 overflow-hidden bg-ink px-4 pt-10 text-bone sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-double border-bone/40 pb-4">
          <div>
            <Kicker>Arts &amp; culture</Kicker>
            <h2 className="mt-3 text-[clamp(40px,5vw,66px)] font-bold leading-none">The Collection</h2>
          </div>
          <Link href="/films" className="font-pixel text-[10px] uppercase text-bone/80 hover:text-holo-lime">
            {catalogue.length} films on the shelf · browse all →
          </Link>
        </div>

        {latestFilm ? (
          <p className="mt-6 max-w-3xl text-[18px] leading-snug">
            <span className="font-pixel text-[10px] uppercase text-holo-lime">Now showing {latestFilm.rating ?? ""}</span>
            <br />
            <a href={latestFilm.letterboxdUrl} target="_blank" rel="noreferrer" className="font-bold hover:underline">
              {latestFilm.title}
            </a>
            {latestFilm.year ? ` (${latestFilm.year})` : ""}
            {latestFilm.reviewSnippet ? <span className="italic text-bone/75"> — &ldquo;{latestFilm.reviewSnippet}&rdquo;</span> : null}
          </p>
        ) : null}

        <div className="mt-8">
          {catalogue.length > 0 ? (
            <CriterionShelf films={catalogue.slice(0, 30)} />
          ) : (
            <p className="py-16 text-center italic text-bone/60">The shelf is empty.</p>
          )}
        </div>

        <div aria-hidden className="relative -mx-8 h-32 overflow-hidden">
          <div className="synth-grid absolute inset-x-[-30%] top-0 h-[260%]" />
        </div>
      </section>
    </>
  );
}
