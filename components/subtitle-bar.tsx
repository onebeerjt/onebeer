"use client";

import { useEffect, useState } from "react";
import type { NowPlayingTrack } from "@/lib/types/content";
import { timeAgo } from "@/lib/format";

type ApiPayload = {
  ok: boolean;
  data: NowPlayingTrack | null;
};

export function SubtitleBar() {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/now-playing", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as ApiPayload;
        if (mounted) setTrack(payload.data);
      } catch {
        // keep the last subtitle on screen
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!track) return null;

  const key = `${track.track}-${track.artist}-${track.isPlaying}`;

  return (
    <div
      key={key}
      aria-live="polite"
      className="subtitle subtitle-enter pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(92vw,720px)] -translate-x-1/2 text-center font-yeezy"
    >
      {track.isPlaying ? (
        <>
          <p className="text-[17px] font-medium leading-snug text-marquee sm:text-[19px]">♪ {track.track} ♪</p>
          <p className="mt-0.5 text-[12px] uppercase tracking-[0.2em] text-bone/80">{track.artist} — now playing</p>
        </>
      ) : (
        <p className="text-[12px] tracking-[0.08em] text-smoke">
          [ last heard: {track.track} — {track.artist}
          {track.playedAt ? `, ${timeAgo(track.playedAt)}` : ""} ]
        </p>
      )}
    </div>
  );
}
