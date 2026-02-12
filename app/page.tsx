import Link from "next/link";
import Image from "next/image";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getRecentFilms } from "@/lib/letterboxd/latest-film";
import { getPostBySlug, getPostSubject, getPublishedPosts } from "@/lib/notion/posts";

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

function getPostPreview(content: unknown) {
  if (!Array.isArray(content)) {
    return "";
  }

  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const type = (block as { type?: string }).type ?? "";
    const text = (block as { text?: string }).text ?? "";
    if (!text) continue;
    if (type.startsWith("heading")) continue;
    return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
  }

  return "";
}

function getPostPreviewImage(content: unknown) {
  if (!Array.isArray(content)) {
    return "";
  }

  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const type = (block as { type?: string }).type ?? "";
    const url = (block as { url?: string }).url ?? "";
    if (type === "image" && url) {
      return url;
    }
  }

  return "";
}

export default async function Home() {
  const [posts, recentTracks, recentFilms] = await Promise.all([
    getPublishedPosts(),
    getRecentTracks(24),
    getRecentFilms(24)
  ]);
  const latestPost = posts[0];
  const recentPosts = posts.slice(0, 3);
  const postPreviewData = await Promise.all(
    recentPosts.map(async (post) => {
      const postDetail = await getPostBySlug(post.slug);
      return {
        id: post.id,
        preview: getPostPreview(postDetail?.content),
        imageUrl: getPostPreviewImage(postDetail?.content)
      };
    })
  );
  const previewMap = new Map(postPreviewData.map((entry) => [entry.id, entry.preview]));
  const previewImageMap = new Map(postPreviewData.map((entry) => [entry.id, entry.imageUrl]));
  const recentThreeFilms = recentFilms.slice(0, 3);
  const subjectLines = await Promise.all(
    recentPosts.map(async (post) => ({
      id: post.id,
      subject: await getPostSubject(post.id)
    }))
  );
  const subjectMap = new Map(subjectLines.map((entry) => [entry.id, entry.subject]));

  return (
    <div className="space-y-10">

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="paper-card flex h-full flex-col p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#1f1a16]">Latest writing</h2>
          </div>
          {latestPost ? (
            <div className="mt-2 flex flex-1 flex-col">
              <div className="space-y-3">
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
                  {!subjectMap.get(post.id) && !post.excerpt && previewMap.get(post.id) ? (
                    <p className="text-sm leading-relaxed text-[#4f443b]">{previewMap.get(post.id)}</p>
                  ) : null}
                  {post.id === latestPost.id && previewImageMap.get(post.id) ? (
                    <div className="mt-2 overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
                      <Image
                        src={previewImageMap.get(post.id) ?? ""}
                        alt={`${post.title} preview`}
                        width={1000}
                        height={560}
                        unoptimized
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
              </div>
              <div className="mt-auto flex justify-end pt-3">
                <Link href="/blog" className="font-mono text-xs uppercase tracking-[0.16em] text-[#8f1f1f] hover:underline">
                  View all
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#4f443b]">
              No published Notion posts found yet. Publish one and it will appear here.
            </p>
          )}
        </article>

        <article className="paper-card p-5">
          <h2 className="font-serif text-xl font-semibold text-[#1f1a16]">Latest films</h2>
          {recentThreeFilms.length > 0 ? (
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-3 overflow-visible">
                {recentThreeFilms.map((film, index) => (
                  <a
                    key={`${film.letterboxdUrl}-${index}`}
                    href={film.letterboxdUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative z-10 flex h-44 w-full flex-none items-end overflow-visible rounded-lg bg-[#ede3cf] shadow-sm hover:shadow-md md:hover:z-50"
                    aria-label={`${film.title} poster`}
                  >
                    {film.posterUrl ? (
                      <div
                        className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-200 group-hover:scale-[1.02]"
                        style={{ backgroundImage: `url(${film.posterUrl})` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">No Art</div>
                    )}
                    <div className="pointer-events-none fixed inset-0 z-[70] hidden items-center justify-center md:group-hover:flex">
                      <div className="relative z-10 rounded-3xl border border-[#cdbfa6] bg-[#fff9ef] p-4 shadow-2xl">
                        {film.posterUrl ? (
                          <div className="flex flex-col items-center gap-3">
                            <div
                              className="h-[520px] w-[340px] bg-contain bg-center bg-no-repeat"
                              style={{ backgroundImage: `url(${film.posterUrl})` }}
                              aria-label={`${film.title} large poster`}
                            />
                            <div className="rounded-full border border-[#cdbfa6] bg-[#fff4e3] px-4 py-1 text-base font-semibold text-[#1f1a16]">
                              {film.rating ?? "No rating"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-[520px] w-[340px] items-center justify-center text-sm text-zinc-500">No Art</div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-[#e2d7c2] pt-3">
                {recentThreeFilms.map((film, index) => (
                  <div key={`${film.letterboxdUrl}-stars-${index}`} className="text-center">
                    <p className="font-mono text-base uppercase tracking-[0.2em] text-[#6a5f55]">
                      {film.rating ?? "No rating"}
                    </p>
                  </div>
                ))}
              </div>
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
                className="paper-card group relative flex items-start gap-4 p-3 transition-transform duration-200 md:hover:-translate-y-1 md:hover:scale-[1.02] md:hover:shadow-xl"
              >
                <div className="h-16 w-12 flex-none overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
                  {film.posterUrl ? (
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-200 md:group-hover:scale-110"
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
                {film.reviewSnippet ? (
                  <div className="pointer-events-none absolute inset-0 hidden rounded-lg border border-[#cdbfa6] bg-[#fff9ef] p-4 shadow-2xl md:flex md:items-center md:gap-4 md:opacity-0 md:transition md:duration-200 md:group-hover:opacity-100">
                    <div className="h-28 w-20 flex-none overflow-hidden rounded-md border border-[#cdbfa6] bg-[#ede3cf]">
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
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#1f1a16]">
                        {film.title}
                        {film.year ? ` (${film.year})` : ""}
                        {film.rating ? ` - ${film.rating}` : ""}
                      </p>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#7f7468]">
                        {film.watchedAt ? formatPlayedAt(film.watchedAt) : "Recently"}
                      </p>
                      <p className="mt-2 text-sm text-[#4f443b]">{film.reviewSnippet}</p>
                    </div>
                  </div>
                ) : null}
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
