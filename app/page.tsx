import Link from "next/link";
import { getLatestFilm } from "@/lib/letterboxd/latest-film";
import { getPublishedPosts } from "@/lib/notion/posts";

export const revalidate = 300;

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

export default async function Home() {
  const [posts, latestFilm] = await Promise.all([getPublishedPosts(), getLatestFilm()]);
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
              <p className="text-sm leading-relaxed text-zinc-700">From Letterboxd activity.</p>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              No Letterboxd activity found yet. Confirm your RSS URL and recent activity.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
