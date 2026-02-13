import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getRecentFilms } from "@/lib/letterboxd/latest-film";
import { getPublishedPosts } from "@/lib/notion/posts";
import { getStatusInfo } from "@/lib/notion/status";
import { mockLabData } from "@/components/lab/mockData";
import type { LabData } from "@/components/lab/types";

const LAB_USE_MOCK = process.env.LAB_USE_MOCK_DATA === "true";

const onTapFallback: LabData["onTap"] = [
  {
    tag: "watch",
    title: "Film list this week",
    url: "/films",
    commentary: "Fresh watches, high-conviction ratings, no filler."
  },
  {
    tag: "link",
    title: "Personal wire cadence",
    url: "/blog",
    commentary: "Short-form notes, longer essays, and status snapshots."
  },
  {
    tag: "note",
    title: "Live module in beta",
    url: "/lab",
    commentary: "Testing interaction patterns before they hit the main route."
  }
];

function mapStatus(note: string | null, updatedAt: string | null): LabData["status"] {
  if (!note) {
    return {
      type: "vibe",
      title: "Headphones on, building",
      subtitle: "No status note in Notion yet.",
      emoji: "🧠"
    };
  }

  return {
    type: "vibe",
    title: note,
    subtitle: updatedAt ? `Updated ${new Date(updatedAt).toLocaleString("en-US", { month: "short", day: "numeric" })}` : undefined,
    emoji: "💬"
  };
}

/*
  Lab data source toggle:
  - Set LAB_USE_MOCK_DATA=true to use local fixtures from mockData.ts
  - Remove/false to pull live data from existing Last.fm, Letterboxd, and Notion fetchers
*/
export async function getLabData(): Promise<LabData> {
  if (LAB_USE_MOCK) {
    return mockLabData;
  }

  const [tracks, films, posts, statusInfo] = await Promise.all([
    getRecentTracks(12),
    getRecentFilms(12),
    getPublishedPosts(),
    getStatusInfo()
  ]);

  const liveTrack = tracks[0]
    ? {
        track: tracks[0].track,
        artist: tracks[0].artist,
        albumArt: tracks[0].albumArt,
        url: tracks[0].url,
        isPlaying: tracks[0].isPlaying
      }
    : null;

  const lastFilm = films[0]
    ? {
        title: films[0].title,
        rating: films[0].rating,
        posterUrl: films[0].posterUrl,
        letterboxdUrl: films[0].letterboxdUrl
      }
    : null;

  return {
    liveTrack,
    lastFilm,
    thinking: statusInfo.note ?? "quietly refining the system and the signal.",
    status: mapStatus(statusInfo.note, statusInfo.updatedAt),
    onTap: onTapFallback,
    writing: posts.slice(0, 4).map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt
    })),
    films: films.slice(0, 8).map((film) => ({
      title: film.title,
      rating: film.rating,
      posterUrl: film.posterUrl,
      letterboxdUrl: film.letterboxdUrl
    }))
  };
}
