import Link from "next/link";
import { CriterionShelf } from "@/components/criterion-shelf";
import { MySpaceProfile, TopEight, type TopArtist } from "@/components/myspace-profile";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { getPostSubject, getPublishedPosts } from "@/lib/notion/posts";
import { getStatusInfo } from "@/lib/notion/status";
import { formatLongDate } from "@/lib/format";
import type { NowPlayingTrack } from "@/lib/types/content";

export const revalidate = 300;

function topArtists(tracks: NowPlayingTrack[]): TopArtist[] {
  const counts = new Map<string, TopArtist>();
  let previous = "";

  for (const track of tracks) {
    // Last.fm reports some scrobbles twice back-to-back.
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

export default async function FrontPage() {
  const [posts, catalogue, tracks, status] = await Promise.all([
    getPublishedPosts(),
    getCatalogue(),
    getRecentTracks(50),
    getStatusInfo()
  ]);

  const latestPost = posts[0];
  const deck = latestPost ? (await getPostSubject(latestPost.id)) || latestPost.excerpt : "";
  const latestFilm = catalogue[0];

  return (
    <>
      <div className="grid items-start gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-8">
          <section className="border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#0a0a0a]">
            <h2
              className="whitespace-nowrap border-b-4 border-double border-ink pb-2 font-fraktur text-[clamp(34px,3.4vw,44px)] leading-none"
              style={{ textShadow: "2px 0 #ff2a6d, -2px 0 #05d9e8" }}
            >
              <Link href="/blog">Quite Probably</Link>
            </h2>

            {latestPost ? (
              <article className="pt-4">
                <div className="flex items-center gap-2 font-pixel text-[9px] uppercase text-graphite">
                  <span className="holo-bg border border-ink px-1.5 py-0.5 text-ink">Latest</span>
                  <span>{formatLongDate(latestPost.publishedAt) ?? "Undated"}</span>
                </div>
                <h3 className="mt-2 text-[28px] font-bold leading-tight">
                  <Link href={`/blog/${latestPost.slug}`} className="decoration-vice-pink decoration-4 underline-offset-4 hover:underline">
                    {latestPost.title}
                  </Link>
                </h3>
                {deck ? <p className="mt-1 text-[17px] italic leading-snug text-graphite">{deck}</p> : null}
                <div className="mt-4 flex items-center justify-between font-pixel text-[10px] uppercase">
                  <Link href={`/blog/${latestPost.slug}`} className="text-vice-pink underline underline-offset-2">
                    Read it →
                  </Link>
                  <Link href="/blog" className="text-graphite hover:text-ink">
                    All posts
                  </Link>
                </div>
              </article>
            ) : (
              <p className="pt-4 text-[18px] italic text-graphite">Nothing here yet. Quite probably soon.</p>
            )}
          </section>

          <section className="border-2 border-dashed border-ink p-5 text-center">
            <p className="font-pixel text-[10px] uppercase">Miami forecast</p>
            <p className="mt-1 text-[34px] font-bold leading-none">100% chance</p>
            <p className="mt-1 italic text-graphite">of one more beer</p>
          </section>
        </div>

        <MySpaceProfile
          mood={status.note}
          moodUpdatedAt={status.updatedAt}
          track={tracks[0] ?? null}
          filmsCount={catalogue.length}
          postsCount={posts.length}
        />
        <TopEight artists={topArtists(tracks)} sample={tracks.length} />
      </div>

      <section className="relative -mx-4 mt-2 overflow-hidden bg-ink px-4 pt-10 text-bone sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-double border-bone/40 pb-4">
          <div>
            <span className="holo-bg inline-block border border-ink px-2 py-0.5 font-pixel text-[10px] uppercase text-ink">Arts &amp; culture</span>
            <h2 className="mt-3 text-[clamp(40px,5vw,66px)] font-bold leading-none">The Collection</h2>
          </div>
          <Link href="/films" className="font-pixel text-[10px] uppercase text-bone/80 transition-colors hover:text-vice-pink">
            {catalogue.length} films on the shelf · browse all →
          </Link>
        </div>

        {latestFilm ? (
          <p className="mt-6 max-w-3xl text-[18px] leading-snug">
            <span className="font-pixel text-[10px] uppercase text-vice-teal">Now showing {latestFilm.rating ?? ""}</span>
            <br />
            <a href={latestFilm.letterboxdUrl} target="_blank" rel="noreferrer" className="font-bold hover:text-vice-pink">
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

        <div aria-hidden className="relative -mx-8 h-28 overflow-hidden">
          <div className="synth-grid absolute inset-x-[-30%] top-0 h-[260%]" />
        </div>
      </section>
    </>
  );
}
