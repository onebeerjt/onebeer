import type { HomeData } from "./types";
import { kineticFont } from "@/lib/fonts";

function Band({
  text,
  fontSize,
  color,
  rotate,
  reverse,
  duration
}: {
  text: string;
  fontSize: number;
  color: string;
  rotate: number;
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="overflow-hidden py-1" style={{ transform: `rotate(${rotate}deg)` }}>
      <div
        className={reverse ? "a-marquee-rev flex whitespace-nowrap" : "a-marquee flex whitespace-nowrap"}
        style={{ animationDuration: duration }}
      >
        <span style={{ fontSize, lineHeight: 0.92, color, paddingRight: 48 }}>{text}</span>
        <span style={{ fontSize, lineHeight: 0.92, color, paddingRight: 48 }}>{text}</span>
      </div>
    </div>
  );
}

export default function ThemeKinetic({ data }: { data: HomeData }) {
  const { posts, films, tracks } = data;

  const trackText =
    tracks
      .slice(0, 6)
      .map((t) => `${t.track.toUpperCase()} — ${t.artist.toUpperCase()}`)
      .join("  ✦  ") || "NO TRACKS YET";

  const filmText =
    films
      .slice(0, 6)
      .map((f) => `${f.title.toUpperCase()}${f.rating ? " " + f.rating : ""}`)
      .join("  ✦  ") || "NO FILMS YET";

  const postText = posts.slice(0, 4).map((p) => p.title.toUpperCase()).join("  ✦  ") || "NOTHING PUBLISHED YET";

  return (
    <div className={`${kineticFont.className} relative overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]`}>
      <div className="flex items-center gap-2 px-6 pt-6 sm:px-10">
        <span className="live-dot" aria-hidden>
          <span className="live-dot-ping animate-ping" style={{ backgroundColor: "#d4ff3d" }} />
          <span className="live-dot-core" style={{ backgroundColor: "#d4ff3d" }} />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d4ff3d]">one beer — live</span>
      </div>

      <div className="mt-8 flex flex-col gap-2 py-6">
        <Band text={trackText} fontSize={72} color="#d4ff3d" rotate={-2} duration="26s" />
        <Band text={filmText} fontSize={96} color="#f5f3ee" rotate={2} reverse duration="34s" />
        <Band text={postText} fontSize={52} color="#7a7a7a" rotate={-1} duration="20s" />
      </div>

      <div className="px-6 pb-8 pt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#4a4a4a] sm:px-10">
        miami based · cerveza fueled · vibe coded
      </div>
    </div>
  );
}
