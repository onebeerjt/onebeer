import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/notion/posts";

type BlogPostPageProps = {
  params: { slug: string };
};

type ContentBlock = {
  id: string;
  type: string;
  text: string;
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
    return <h2 className="font-serif text-3xl font-semibold text-zinc-900">{block.text}</h2>;
  }

  if (block.type === "heading_2") {
    return <h3 className="font-serif text-2xl font-semibold text-zinc-900">{block.text}</h3>;
  }

  if (block.type === "heading_3") {
    return <h4 className="font-serif text-xl font-semibold text-zinc-900">{block.text}</h4>;
  }

  if (block.type === "quote") {
    return <blockquote className="border-l-2 border-zinc-300 pl-4 italic text-zinc-700">{block.text}</blockquote>;
  }

  if (block.type === "bulleted_list_item") {
    return (
      <p className="text-base leading-relaxed text-zinc-800">
        <span className="mr-2">-</span>
        {block.text}
      </p>
    );
  }

  if (block.type === "numbered_list_item") {
    return (
      <p className="text-base leading-relaxed text-zinc-800">
        <span className="mr-2">#</span>
        {block.text}
      </p>
    );
  }

  if (block.type === "code") {
    return <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100">{block.text}</pre>;
  }

  return <p className="text-base leading-relaxed text-zinc-800">{block.text}</p>;
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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Blog post</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900">{post.title}</h1>
        <p className="text-sm text-zinc-600">Published {formatDate(post.publishedAt)}</p>
      </header>

      {content.length > 0 ? (
        <div className="space-y-4">{content.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
          <p className="text-sm leading-relaxed text-zinc-700">No readable content blocks found for this post yet.</p>
        </div>
      )}
    </article>
  );
}
