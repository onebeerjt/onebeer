import Link from "next/link";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getLatestFilm, getRecentFilms } from "@/lib/letterboxd/latest-film";
import { getPublishedPosts } from "@/lib/notion/posts";

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
    year: "numeric"
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
    minute: "2-digit"
  }).format(date);
}

export default async function Home() {
  const [posts, latestFilm, recentTracks, recentFilms] = await Promise.all([
    getPublishedPosts(),
    getLatestFilm(),
    getRecentTracks(10),
    getRecentFilms(8)
  ]);
  const latestPost = posts[0];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          What&apos;s up lately
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Writing first. Watching and listening alongside it.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-700">
          onebeer is JT&apos;s personal hub at <span className="font-medium">onebeer.io</span>.
          Posts are published from Notion, and activity indicators keep the site feeling current.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-zinc-900">Latest writing</h2>
          {latestPost ? (
            <div className="mt-2 space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                {formatDate(latestPost.publishedAt)}
              </p>
              <Link href={`/blog/${latestPost.slug}`} className="text-base font-semibold text-zinc-900 hover:underline">
                {latestPost.title}
              </Link>
              {latestPost.excerpt ? (
                <p className="text-sm leading-relaxed text-zinc-700">{latestPost.excerpt}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              No published Notion posts found yet. Publish one and it will appear here.
            </p>
          )}
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-zinc-900">Latest film</h2>
          {latestFilm ? (
            <div className="mt-2 space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                {latestFilm.watchedAt ? formatDate(latestFilm.watchedAt) : "Recently logged"}
              </p>
              <a
                href={latestFilm.letterboxdUrl}
                target="_blank"
                rel="noreferrer"
                className="text-base font-semibold text-zinc-900 hover:underline"
              >
                {latestFilm.title}
                {latestFilm.year ? ` (${latestFilm.year})` : ""}
              </a>
              {latestFilm.reviewSnippet ? (
                <p className="text-sm leading-relaxed text-zinc-700">{latestFilm.reviewSnippet}</p>
              ) : (
                <p className="text-sm leading-relaxed text-zinc-700">From Letterboxd activity.</p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              No Letterboxd activity found yet. Confirm your RSS URL and recent activity.
            </p>
          )}
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Movies</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-zinc-900">Recent films</h2>
        </div>

        {recentFilms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
            <p className="text-sm leading-relaxed text-zinc-700">No recent Letterboxd films found yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentFilms.map((film, index) => (
              <article
                key={`${film.letterboxdUrl}-${index}`}
                className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
              >
                <div className="h-16 w-12 flex-none overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
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
                    className="truncate text-sm font-semibold text-zinc-900 hover:underline"
                  >
                    {film.title}
                    {film.year ? ` (${film.year})` : ""}
                  </a>
                  <p className="text-xs text-zinc-500">{film.watchedAt ? formatPlayedAt(film.watchedAt) : "Recently"}</p>
                  {film.reviewSnippet ? <p className="mt-1 text-sm text-zinc-700">{film.reviewSnippet}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Music</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-zinc-900">Recent tracks</h2>
        </div>

        {recentTracks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
            <p className="text-sm leading-relaxed text-zinc-700">
              No recent Last.fm tracks found yet. Check your Last.fm username and API key.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTracks.map((track, index) => (
              <article
                key={`${track.track}-${track.artist}-${track.playedAt ?? index}`}
                className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
              >
                <div className="h-14 w-14 flex-none overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
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
                  <p className="truncate text-sm font-semibold text-zinc-900">{track.track}</p>
                  <p className="truncate text-sm text-zinc-700">{track.artist}</p>
                  <p className="text-xs text-zinc-500">{track.isPlaying ? "Now playing" : formatPlayedAt(track.playedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
