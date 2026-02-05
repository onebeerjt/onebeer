import Link from "next/link";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getRecentFilms } from "@/lib/letterboxd/latest-film";
import { getPostSubject, getPublishedPosts } from "@/lib/notion/posts";

export const revalidate = 120;

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Unscheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

function formatPlayedAt(value: string | undefined) {
  if (!value) {
    return "Playing now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(date);
}

export default async function Home() {
  const [posts, recentTracks, recentFilms] = await Promise.all([
    getPublishedPosts(),
    getRecentTracks(24),
    getRecentFilms(24)
  ]);
  const latestPost = posts[0];
  const recentPosts = posts.slice(0, 3);
  const recentTwoFilms = recentFilms.slice(0, 2);
  const subjectLines = await Promise.all(
    recentPosts.map(async (post) => ({
      id: post.id,
      subject: await getPostSubject(post.id)
    }))
  );
  const subjectMap = new Map(subjectLines.map((entry) => [entry.id, entry.subject]));

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#8f1f1f]">
          What&apos;s up lately
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1f1a16] sm:text-6xl">
          Writing first. Watching and listening alongside it.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#4f443b]">
          onebeer is JT&apos;s personal hub at <span className="font-medium">onebeer.io</span>.
          Posts are published from Notion, and activity indicators keep the site feeling current.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="paper-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#1f1a16]">Latest writing</h2>
            <Link href="/blog" className="font-mono text-xs uppercase tracking-[0.16em] text-[#8f1f1f] hover:underline">
              View all
            </Link>
          </div>
          {latestPost ? (
            <div className="mt-2 space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-t border-[#e2d7c2] pt-3 first:border-t-0 first:pt-0">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#7f7468]">
                    {formatDate(post.publishedAt)}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-base font-semibold text-[#1f1a16] hover:text-[#8f1f1f] hover:underline">
                    {post.title}
                  </Link>
                  {subjectMap.get(post.id) ? (
                    <p className="text-sm italic leading-relaxed text-[#4f443b]">{subjectMap.get(post.id)}</p>
                  ) : post.excerpt ? (
                    <p className="text-sm leading-relaxed text-[#4f443b]">{post.excerpt}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#4f443b]">
              No published Notion posts found yet. Publish one and it will appear here.
            </p>
          )}
        </article>

        <article className="paper-card p-5">
          <h2 className="font-serif text-xl font-semibold text-[#1f1a16]">Latest films</h2>
          {recentTwoFilms.length > 0 ? (
            <div className="mt-2 space-y-3">
              {recentTwoFilms.map((film, index) => (
                <div key={`${film.letterboxdUrl}-${index}`} className="flex items-center gap-3 border-t border-[#e2d7c2] pt-3 first:border-t-0 first:pt-0">
                  <div className="h-16 w-12 flex-none overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
                    {film.posterUrl ? (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${film.posterUrl})` }}
                        aria-label={`${film.title} poster`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">No Art</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={film.letterboxdUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-base font-semibold text-[#1f1a16] hover:text-[#8f1f1f] hover:underline"
                    >
                      {film.title}
                      {film.year ? ` (${film.year})` : ""}
                      {film.rating ? ` - ${film.rating}` : ""}
                    </a>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#7f7468]">
                      {film.watchedAt ? formatDate(film.watchedAt) : "Recently logged"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#4f443b]">
              No Letterboxd activity found yet. Confirm your RSS URL and recent activity.
            </p>
          )}
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#8f1f1f]">Movies</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#1f1a16]">Recent films</h2>
        </div>

        {recentFilms.length === 0 ? (
          <div className="paper-card border-dashed p-6">
            <p className="text-sm leading-relaxed text-[#4f443b]">No recent Letterboxd films found yet.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {recentFilms.map((film, index) => (
              <article
                key={`${film.letterboxdUrl}-${index}`}
                className="paper-card flex items-start gap-4 p-3"
              >
                <div className="h-16 w-12 flex-none overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
                  {film.posterUrl ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${film.posterUrl})` }}
                      aria-label={`${film.title} poster`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">No Art</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={film.letterboxdUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm font-semibold text-[#1f1a16] hover:text-[#8f1f1f] hover:underline"
                  >
                    {film.title}
                    {film.year ? ` (${film.year})` : ""}
                    {film.rating ? ` - ${film.rating}` : ""}
                  </a>
                  <p className="font-mono text-xs text-[#7f7468]">{film.watchedAt ? formatPlayedAt(film.watchedAt) : "Recently"}</p>
                  {film.reviewSnippet ? <p className="mt-1 text-sm text-[#4f443b]">{film.reviewSnippet}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#8f1f1f]">Music</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#1f1a16]">Recent tracks</h2>
        </div>

        {recentTracks.length === 0 ? (
          <div className="paper-card border-dashed p-6">
            <p className="text-sm leading-relaxed text-[#4f443b]">
              No recent Last.fm tracks found yet. Check your Last.fm username and API key.
            </p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {recentTracks.map((track, index) => (
              <article
                key={`${track.track}-${track.artist}-${track.playedAt ?? index}`}
                className="paper-card flex items-center gap-4 p-3"
              >
                <div className="h-14 w-14 flex-none overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
                  {track.albumArt ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${track.albumArt})` }}
                      aria-label={`${track.album ?? track.track} artwork`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">No Art</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1f1a16]">{track.track}</p>
                  <p className="truncate text-sm text-[#4f443b]">{track.artist}</p>
                  <p className="font-mono text-xs text-[#7f7468]">{track.isPlaying ? "Now playing" : formatPlayedAt(track.playedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
