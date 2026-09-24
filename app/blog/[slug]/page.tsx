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

function renderBlock(block: ContentBlock) {
  if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
    return <h2 className="mt-4 font-bold uppercase">{block.text}</h2>;
  }

  if (block.type === "quote") {
    return (
      <div className="mx-auto max-w-[36ch]">
        <p className="text-center uppercase">JT</p>
        <p className="mt-1">{block.text}</p>
      </div>
    );
  }

  if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
    return <p className="pl-6">— {block.text}</p>;
  }

  if (block.type === "code") {
    return <pre className="overflow-x-auto whitespace-pre-wrap border border-ink/20 p-4 text-[13px]">{block.text}</pre>;
  }

  if (block.type === "image" && block.url) {
    return (
      <figure className="space-y-2">
        <Image src={block.url} alt={block.text || "Still from the post"} width={1200} height={675} unoptimized className="w-full grayscale" />
        {block.text ? <figcaption className="text-[12px] uppercase">{block.text}</figcaption> : null}
      </figure>
    );
  }

  return <p>{block.text}</p>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const content = (post.content as ContentBlock[]) ?? [];

  return (
    <div className="px-4 pb-24 pt-36">
      <article className="mx-auto max-w-[720px] bg-bone px-8 py-16 font-script text-[15px] leading-[1.7] text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] sm:px-20 sm:py-24 sm:text-[16px]">
        <header className="pb-16 text-center">
          <h1 className="text-[18px] font-bold uppercase leading-snug underline underline-offset-4 sm:text-[20px]">{post.title}</h1>
          <p className="mt-10">written by</p>
          <p className="mt-2">JT</p>
          <p className="mt-10 text-[12px]">{formatLongDate(post.publishedAt) ?? "Undated draft"}</p>
        </header>

        <p>FADE IN:</p>

        {content.length > 0 ? (
          <div className="mt-8 space-y-5">
            {content.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}
          </div>
        ) : (
          <p className="mt-8">The page is blank. The writer stares at it.</p>
        )}

        <p className="mt-14 text-right">FADE OUT.</p>
        <p className="mt-6 text-center font-bold">THE END</p>
      </article>

      <p className="mt-12 text-center">
        <Link href="/blog" className="text-[10px] uppercase tracking-[0.35em] text-smoke transition-colors hover:text-marquee">
          ← Back to the screenplays
        </Link>
      </p>
    </div>
  );
}
