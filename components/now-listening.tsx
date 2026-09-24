"use client";

import { useEffect, useState } from "react";
import type { NowPlayingTrack } from "@/lib/types/content";
import { timeAgo } from "@/lib/format";

export function NowListening({ initial }: { initial: NowPlayingTrack | null }) {
  const [track, setTrack] = useState(initial);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/now-playing", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data: NowPlayingTrack | null };
        if (mounted && payload.data) setTrack(payload.data);
      } catch {
        // keep showing the last known track
      }
    }

    const interval = setInterval(load, 15000);
    load();
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!track) {
    return <p className="text-[15px] italic text-graphite">Radio silence.</p>;
  }

  return (
    <div aria-live="polite">
      {track.isPlaying ? (
        <p className="mb-1.5">
          <span className="blink inline-block bg-holo-lime px-1.5 py-0.5 font-pixel text-[10px] uppercase text-ink">Online now!</span>
        </p>
      ) : null}
      <p className="font-pixel text-[10px] uppercase text-graphite">{track.isPlaying ? "Currently listening" : "Last spun"}</p>
      <p className="mt-0.5 text-[15px] leading-snug">
        ♫ <span className="font-semibold">{track.track}</span> — {track.artist}
      </p>
      {!track.isPlaying && track.playedAt ? <p className="text-[12px] italic text-graphite">{timeAgo(track.playedAt)}</p> : null}
    </div>
  );
}
