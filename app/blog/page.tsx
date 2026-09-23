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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f7480]">Blog</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#f2efe9]">
          Latest writing
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="card border-dashed p-6">
          <p className="text-sm leading-relaxed text-[#94989f]">
            No published posts found yet. Make sure the Notion database is shared with your integration.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="card card-hover p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f7480]">{formatDate(post.publishedAt)}</p>
              <Link href={`/blog/${post.slug}`} className="mt-1 block font-serif text-2xl font-semibold text-[#f2efe9] hover:text-[#ff8a3d] hover:underline">
                {post.title}
              </Link>
              {post.excerpt ? <p className="mt-2 text-sm leading-relaxed text-[#94989f]">{post.excerpt}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
