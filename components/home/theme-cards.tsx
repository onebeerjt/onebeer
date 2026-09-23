import Link from "next/link";
import Image from "next/image";
import type { HomeData } from "./types";
import { formatDate, formatPlayedAt, isRecent } from "./format";

function LiveDot() {
  return (
    <span className="live-dot" aria-label="Recent activity">
      <span className="live-dot-ping animate-ping" />
      <span className="live-dot-core" />
    </span>
  );
}

export default function ThemeCards({ data }: { data: HomeData }) {
  const { posts, films, tracks } = data;
  const latestPost = posts[0];
  const recentThreeFilms = films.slice(0, 3);
  const mostRecentFilm = films[0];
  const mostRecentTrack = tracks[0];

  return (
    <div className="space-y-10">
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f7480]">Latest post</p>
          {latestPost ? (
            <Link href={`/blog/${latestPost.slug}`} className="mt-1 block text-sm font-semibold text-[#f2efe9] hover:text-[#ff8a3d]">
              {latestPost.title}
            </Link>
          ) : (
            <p className="mt-1 text-sm text-[#94989f]">Nothing published yet</p>
          )}
        </div>
        <div className="card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f7480]">Latest film</p>
          {mostRecentFilm ? (
            <div className="mt-1 flex items-center gap-2">
              {isRecent(mostRecentFilm.watchedAt, 24) ? <LiveDot /> : null}
              <a
                href={mostRecentFilm.letterboxdUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm font-semibold text-[#f2efe9] hover:text-[#ff8a3d]"
              >
                {mostRecentFilm.title}
                {mostRecentFilm.rating ? ` — ${mostRecentFilm.rating}` : ""}
              </a>
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#94989f]">No films logged yet</p>
          )}
        </div>
        <div className="card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f7480]">Latest track</p>
          {mostRecentTrack ? (
            <div className="mt-1 flex items-center gap-2">
              {mostRecentTrack.isPlaying ? <LiveDot /> : null}
              <p className="truncate text-sm font-semibold text-[#f2efe9]">
                {mostRecentTrack.track}
                <span className="text-[#94989f]"> — {mostRecentTrack.artist}</span>
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#94989f]">No tracks yet</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="card flex h-full flex-col p-5">
          <h2 className="font-serif text-xl font-semibold text-[#f2efe9]">Latest writing</h2>
          {latestPost ? (
            <div className="mt-2 flex flex-1 flex-col">
              <div className="space-y-3">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border-t border-[#1b1f26] pt-3 first:border-t-0 first:pt-0">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#6f7480]">{formatDate(post.publishedAt)}</p>
                    <Link href={`/blog/${post.slug}`} className="text-base font-semibold text-[#f2efe9] hover:text-[#ff8a3d] hover:underline">
                      {post.title}
                    </Link>
                    {post.subject ? (
                      <p className="text-sm italic leading-relaxed text-[#94989f]">{post.subject}</p>
                    ) : post.excerpt ? (
                      <p className="text-sm leading-relaxed text-[#94989f]">{post.excerpt}</p>
                    ) : post.preview ? (
                      <p className="text-sm leading-relaxed text-[#94989f]">{post.preview}</p>
                    ) : null}
                    {post.id === latestPost.id && post.imageUrl ? (
                      <div className="mt-2 overflow-hidden rounded-md border border-[#262b33] bg-[#1b1f26]">
                        <Image src={post.imageUrl} alt={`${post.title} preview`} width={1000} height={560} unoptimized className="h-auto w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-auto flex justify-end pt-3">
                <Link href="/blog" className="font-mono text-xs uppercase tracking-[0.16em] text-[#ff8a3d] hover:underline">
                  View all
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#94989f]">No published Notion posts found yet. Publish one and it will appear here.</p>
          )}
        </article>

        <article className="card p-5">
          <h2 className="font-serif text-xl font-semibold text-[#f2efe9]">Latest films</h2>
          {recentThreeFilms.length > 0 ? (
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-3">
                {recentThreeFilms.map((film, index) => (
                  <a
                    key={`${film.letterboxdUrl}-${index}`}
                    href={film.letterboxdUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex h-44 w-full flex-none items-end overflow-hidden rounded-lg bg-[#1b1f26] shadow-sm hover:shadow-md"
                    aria-label={`${film.title} poster`}
                  >
                    {film.posterUrl ? (
                      <div className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-200 group-hover:scale-[1.02]" style={{ backgroundImage: `url(${film.posterUrl})` }} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-[#6f7480]">No Art</div>
                    )}
                  </a>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-[#1b1f26] pt-3">
                {recentThreeFilms.map((film, index) => (
                  <div key={`${film.letterboxdUrl}-stars-${index}`} className="text-center">
                    <p className="font-mono text-base uppercase tracking-[0.2em] text-[#94989f]">{film.rating ?? "No rating"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#94989f]">No Letterboxd activity found yet.</p>
          )}
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#ff8a3d]">Movies</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#f2efe9]">Recent films</h2>
        </div>
        {films.length === 0 ? (
          <div className="card border-dashed p-6">
            <p className="text-sm leading-relaxed text-[#94989f]">No recent Letterboxd films found yet.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {films.map((film, index) => (
              <article key={`${film.letterboxdUrl}-${index}`} className="card card-hover flex items-start gap-4 p-3">
                <div className="h-16 w-12 flex-none overflow-hidden rounded-md border border-[#262b33] bg-[#1b1f26]">
                  {film.posterUrl ? (
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${film.posterUrl})` }} aria-label={`${film.title} poster`} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-[#6f7480]">No Art</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <a href={film.letterboxdUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-semibold text-[#f2efe9] hover:text-[#ff8a3d] hover:underline">
                    {film.title}
                    {film.year ? ` (${film.year})` : ""}
                    {film.rating ? ` - ${film.rating}` : ""}
                  </a>
                  <p className="font-mono text-xs text-[#6f7480]">{film.watchedAt ? formatPlayedAt(film.watchedAt) : "Recently"}</p>
                  {film.reviewSnippet ? <p className="mt-1 text-sm text-[#94989f]">{film.reviewSnippet}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#3ee089]">Music</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#f2efe9]">Recent tracks</h2>
        </div>
        {tracks.length === 0 ? (
          <div className="card border-dashed p-6">
            <p className="text-sm leading-relaxed text-[#94989f]">No recent Last.fm tracks found yet. Check your Last.fm username and API key.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {tracks.map((track, index) => (
              <article key={`${track.track}-${track.artist}-${track.playedAt ?? index}`} className="card card-hover flex items-center gap-4 p-3">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-md border border-[#262b33] bg-[#1b1f26]">
                  {track.albumArt ? (
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${track.albumArt})` }} aria-label={`${track.album ?? track.track} artwork`} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#6f7480]">No Art</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#f2efe9]">{track.track}</p>
                  <p className="truncate text-sm text-[#94989f]">{track.artist}</p>
                  <p className="flex items-center gap-1.5 font-mono text-xs text-[#6f7480]">
                    {track.isPlaying ? <LiveDot /> : null}
                    {track.isPlaying ? "Now playing" : formatPlayedAt(track.playedAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
