import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/notion/posts";

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

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unscheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function renderBlock(block: ContentBlock) {
  if (block.type === "heading_1") {
    return <h2 className="font-serif text-3xl font-semibold text-[#f2efe9]">{block.text}</h2>;
  }

  if (block.type === "heading_2") {
    return <h3 className="font-serif text-2xl font-semibold text-[#f2efe9]">{block.text}</h3>;
  }

  if (block.type === "heading_3") {
    return <h4 className="font-serif text-xl font-semibold text-[#f2efe9]">{block.text}</h4>;
  }

  if (block.type === "quote") {
    return <blockquote className="border-l-2 border-[#262b33] pl-4 italic text-[#94989f]">{block.text}</blockquote>;
  }

  if (block.type === "bulleted_list_item") {
    return (
      <p className="text-base leading-relaxed text-[#c9c5bc]">
        <span className="mr-2">-</span>
        {block.text}
      </p>
    );
  }

  if (block.type === "numbered_list_item") {
    return (
      <p className="text-base leading-relaxed text-[#c9c5bc]">
        <span className="mr-2">#</span>
        {block.text}
      </p>
    );
  }

  if (block.type === "code") {
    return <pre className="overflow-x-auto rounded-md bg-[#0d0f12] p-4 text-sm text-[#e8e5de]">{block.text}</pre>;
  }

  if (block.type === "image" && block.url) {
    return (
      <figure className="space-y-2">
        <Image
          src={block.url}
          alt={block.text || "Notion image"}
          width={1200}
          height={675}
          unoptimized
          className="w-full rounded-md border border-[#262b33]"
        />
        {block.text ? <figcaption className="text-xs text-[#6f7480]">{block.text}</figcaption> : null}
      </figure>
    );
  }

  return <p className="text-base leading-relaxed text-[#c9c5bc]">{block.text}</p>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const content = (post.content as ContentBlock[]) ?? [];

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f7480]">Blog post</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#f2efe9]">{post.title}</h1>
        <p className="text-sm text-[#94989f]">Published {formatDate(post.publishedAt)}</p>
      </header>

      {content.length > 0 ? (
        <div className="space-y-4">{content.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</div>
      ) : (
        <div className="card border-dashed p-6">
          <p className="text-sm leading-relaxed text-[#94989f]">No readable content blocks found for this post yet.</p>
        </div>
      )}
    </article>
  );
}
