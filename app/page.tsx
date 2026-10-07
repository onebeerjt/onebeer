import Link from "next/link";
import { CriterionShelf } from "@/components/criterion-shelf";
import { ListeningRoom } from "@/components/listening-room";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { getPostSubject, getPublishedPosts } from "@/lib/notion/posts";
import { formatLongDate } from "@/lib/format";

export const revalidate = 300;

export default async function FrontPage() {
  const [posts, catalogue, tracks] = await Promise.all([getPublishedPosts(), getCatalogue(), getRecentTracks(50)]);

  const latestPost = posts[0];
  const deck = latestPost ? (await getPostSubject(latestPost.id)) || latestPost.excerpt : "";
  const latestFilm = catalogue[0];

  return (
    <>
      <section className="relative -mx-4 mt-8 overflow-hidden bg-ink px-4 pt-10 text-bone sm:-mx-8 sm:px-8">
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

      <ListeningRoom tracks={tracks} />

      <section className="grid items-end gap-4 border-t-4 border-double border-ink pt-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
        <div>
          <p className="font-pixel text-[10px] uppercase text-graphite">The blog</p>
          <h2 className="mt-1 whitespace-nowrap font-fraktur text-[clamp(36px,4vw,52px)] leading-none" style={{ textShadow: "1px 0 #ff2a6d, -1px 0 #05d9e8" }}>
            <Link href="/blog">Quite Probably</Link>
          </h2>
        </div>
        {latestPost ? (
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 md:border-l md:border-ink/20 md:pl-10">
            <div className="min-w-0">
              <p className="font-pixel text-[9px] uppercase text-graphite">Latest · {formatLongDate(latestPost.publishedAt) ?? "Undated"}</p>
              <h3 className="mt-1 text-[26px] font-bold leading-tight">
                <Link href={`/blog/${latestPost.slug}`} className="decoration-vice-pink decoration-2 underline-offset-4 hover:underline">
                  {latestPost.title}
                </Link>
              </h3>
              {deck ? <p className="text-[16px] italic text-graphite">{deck}</p> : null}
            </div>
            <Link href="/blog" className="font-pixel text-[10px] uppercase underline underline-offset-4">
              All posts →
            </Link>
          </div>
        ) : (
          <p className="text-[18px] italic text-graphite">Nothing here yet. Quite probably soon.</p>
        )}
      </section>
    </>
  );
}
