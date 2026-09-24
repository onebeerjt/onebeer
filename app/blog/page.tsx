import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/posts";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Screenplays",
  description: "Writing from JT"
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <header className="border-b border-ash/60 pb-10">
        <p className="text-[10px] uppercase tracking-[0.42em] text-marquee">Writing</p>
        <h1 className="mt-4 font-criterion text-[clamp(52px,8vw,112px)] font-medium leading-[0.9] text-bone">The Screenplays</h1>
        <p className="mt-5 max-w-[46ch] font-criterion text-[20px] italic text-bone/70">Drafts, notes, and whatever else made it to the page.</p>
      </header>

      {posts.length === 0 ? (
        <p className="py-24 text-center text-[12px] tracking-[0.1em] text-smoke">[ the page is blank — something is coming ]</p>
      ) : (
        <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="flex aspect-[8.5/11] flex-col bg-bone p-8 font-script text-ink shadow-[0_40px_70px_-35px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-1">
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <p className="text-[17px] font-bold uppercase leading-snug underline underline-offset-4">{post.title}</p>
                  <p className="mt-8 text-[13px]">written by</p>
                  <p className="mt-2 text-[13px]">JT</p>
                </div>
                <p className="text-[11px]">{formatLongDate(post.publishedAt) ?? "Undated draft"}</p>
              </div>
              {post.excerpt ? <p className="mt-5 font-criterion text-[18px] italic leading-snug text-bone/70">{post.excerpt}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
