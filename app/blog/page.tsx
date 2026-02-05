import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest writing from JT"
};

export const revalidate = 300;

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Blog</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-900">
          Latest writing
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
          <p className="text-sm leading-relaxed text-zinc-700">
            No published posts found yet. Make sure the Notion database is shared with your integration.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{formatDate(post.publishedAt)}</p>
              <Link href={`/blog/${post.slug}`} className="mt-1 block font-serif text-2xl font-semibold text-zinc-900 hover:underline">
                {post.title}
              </Link>
              {post.excerpt ? <p className="mt-2 text-sm leading-relaxed text-zinc-700">{post.excerpt}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
