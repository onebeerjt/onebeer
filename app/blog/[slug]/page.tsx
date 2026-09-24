import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/notion/posts";
import { formatLongDate } from "@/lib/format";

type BlogPostPageProps = {
  params: { slug: string };
};

type ContentBlock = {
  id: string;
  type: string;
  text: string;
  url?: string;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

function renderBlock(block: ContentBlock, dropCap: boolean) {
  if (block.type === "heading_1" || block.type === "heading_2") {
    return <h2 className="pt-4 text-[30px] font-bold leading-tight">{block.text}</h2>;
  }

  if (block.type === "heading_3") {
    return <h3 className="pt-2 text-[24px] font-bold leading-tight">{block.text}</h3>;
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-6">
        <div className="holo-bg h-1" />
        <p className="py-5 text-center text-[clamp(24px,3vw,32px)] italic leading-snug">&ldquo;{block.text}&rdquo;</p>
        <div className="holo-bg h-1" />
      </blockquote>
    );
  }

  if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
    return (
      <p className="relative pl-7">
        <span aria-hidden className="absolute left-0 text-holo-pink">
          ✦
        </span>
        {block.text}
      </p>
    );
  }

  if (block.type === "code") {
    return <pre className="overflow-x-auto border-2 border-ink bg-ink p-4 text-[14px] text-paper">{block.text}</pre>;
  }

  if (block.type === "image" && block.url) {
    return (
      <figure className="space-y-2">
        <Image
          src={block.url}
          alt={block.text || "Photo from the story"}
          width={1400}
          height={800}
          unoptimized
          className="w-full border-2 border-ink grayscale transition-[filter] duration-700 hover:grayscale-0"
        />
        {block.text ? <figcaption className="font-pixel text-[10px] uppercase text-graphite">{block.text}</figcaption> : null}
      </figure>
    );
  }

  return <p className={dropCap ? "drop-cap" : undefined}>{block.text}</p>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const content = ((post.content as ContentBlock[]) ?? []).filter((block) => block.text || block.url);
  const firstParagraphId = content.find((block) => block.type === "paragraph")?.id;

  return (
    <article className="mx-auto max-w-[760px] py-12">
      <Link href="/blog" className="font-pixel text-[10px] uppercase text-graphite hover:text-ink">
        ← All dispatches
      </Link>
      <div className="mt-6">
        <span className="holo-bg inline-block border border-ink px-2 py-0.5 font-pixel text-[10px] uppercase">Dispatch</span>
      </div>
      <h1 className="mt-4 text-[clamp(40px,6vw,76px)] font-bold leading-[0.98] tracking-[-0.02em]">{post.title}</h1>
      {post.excerpt ? <p className="mt-4 text-[22px] italic leading-snug text-graphite">{post.excerpt}</p> : null}
      <p className="mt-5 border-y border-ink/25 py-2 font-pixel text-[10px] uppercase">By JT · {formatLongDate(post.publishedAt) ?? "Undated"} · Miami</p>

      {content.length > 0 ? (
        <div className="mt-8 space-y-5 text-[19px] leading-[1.7]">
          {content.map((block) => (
            <div key={block.id}>{renderBlock(block, block.id === firstParagraphId)}</div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-[19px] italic text-graphite">This story is still being filed.</p>
      )}

      <p className="mt-14 text-center font-pixel text-[11px] uppercase tracking-[0.3em]">— 30 —</p>
    </article>
  );
}
