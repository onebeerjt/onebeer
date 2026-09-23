import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getRecentFilms } from "@/lib/letterboxd/latest-film";
import { getPostBySlug, getPostSubject, getPublishedPosts } from "@/lib/notion/posts";
import { ThemeSwitcher } from "@/components/home/theme-switcher";
import type { HomeData } from "@/components/home/types";

export const revalidate = 120;

function getPostPreview(content: unknown) {
  if (!Array.isArray(content)) return "";
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
  if (!Array.isArray(content)) return "";
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const type = (block as { type?: string }).type ?? "";
    const url = (block as { url?: string }).url ?? "";
    if (type === "image" && url) return url;
  }
  return "";
}

export default async function Home() {
  const [posts, recentTracks, recentFilms] = await Promise.all([
    getPublishedPosts(),
    getRecentTracks(24),
    getRecentFilms(24)
  ]);

  const recentPosts = posts.slice(0, 3);
  const postDetails = await Promise.all(
    recentPosts.map(async (post) => {
      const postDetail = await getPostBySlug(post.slug);
      const subject = await getPostSubject(post.id);
      return {
        id: post.id,
        preview: getPostPreview(postDetail?.content),
        imageUrl: getPostPreviewImage(postDetail?.content),
        subject
      };
    })
  );
  const detailMap = new Map(postDetails.map((entry) => [entry.id, entry]));

  const homeData: HomeData = {
    posts: recentPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      subject: detailMap.get(post.id)?.subject || undefined,
      preview: detailMap.get(post.id)?.preview || undefined,
      imageUrl: detailMap.get(post.id)?.imageUrl || undefined
    })),
    films: recentFilms,
    tracks: recentTracks
  };

  return <ThemeSwitcher data={homeData} />;
}
