import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/posts";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing",
  description: "Every dispatch from JT"
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-4xl py-12">
      <span className="holo-bg inline-block border border-ink px-2 py-0.5 font-pixel text-[10px] uppercase">Writing</span>
      <h1 className="mt-4 text-[clamp(44px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.02em]">All the dispatches</h1>
      <p className="mt-3 text-[20px] italic text-graphite">Every story filed from the desk, newest first.</p>

      {posts.length === 0 ? (
        <p className="mt-12 border-y-2 border-ink py-10 text-center text-[20px] italic text-graphite">The presses are warming up.</p>
      ) : (
        <ol className="mt-10 divide-y divide-ink/20 border-y-2 border-ink">
          {posts.map((post) => (
            <li key={post.id} className="grid gap-2 py-7 md:grid-cols-[170px_minmax(0,1fr)] md:gap-8">
              <p className="pt-2 font-pixel text-[10px] uppercase text-graphite">{formatLongDate(post.publishedAt) ?? "Undated"}</p>
              <div>
                <Link href={`/blog/${post.slug}`} className="text-[clamp(28px,3.4vw,40px)] font-bold leading-tight decoration-holo-pink decoration-4 underline-offset-4 hover:underline">
                  {post.title}
                </Link>
                {post.excerpt ? <p className="mt-2 text-[18px] italic leading-snug text-graphite">{post.excerpt}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
