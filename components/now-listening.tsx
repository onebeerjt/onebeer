"use client";

import { useEffect, useState } from "react";
import type { NowPlayingTrack } from "@/lib/types/content";
import { timeAgo } from "@/lib/format";

const BAR_HEIGHTS = [18, 26, 12, 22];

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
    return <p className="text-[14px] italic text-[#d9c2ea]">Radio silence.</p>;
  }

  const playing = track.isPlaying;

  return (
    <div aria-live="polite" className="flex items-center gap-3">
      <div
        className="h-14 w-14 flex-none border border-vice-pink/60 bg-black bg-cover bg-center"
        style={track.albumArt ? { backgroundImage: `url(${track.albumArt})` } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-pixel text-[9px] uppercase text-vice-teal">
          {playing ? (
            <>
              <span className="blink text-vice-pink" aria-hidden>
                ●
              </span>
              Online now — playing
            </>
          ) : (
            <>Last spun{track.playedAt ? ` · ${timeAgo(track.playedAt)}` : ""}</>
          )}
        </p>
        <p className="truncate text-[15px] font-semibold text-white">{track.track}</p>
        <p className="truncate text-[13px] text-[#d9c2ea]">{track.artist}</p>
      </div>
      <div aria-hidden className="flex h-7 flex-none items-end gap-[3px]">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className={playing ? "eq-bar w-[3px] bg-vice-pink" : "w-[3px] bg-vice-pink/30"}
            style={{ height, animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
