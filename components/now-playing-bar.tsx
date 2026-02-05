"use client";

import { useEffect, useState } from "react";
import type { NowPlayingTrack } from "@/lib/types/content";

type ApiPayload = {
  ok: boolean;
  data: NowPlayingTrack | null;
};

function formatLabel(track: NowPlayingTrack | null) {
  if (!track) {
    return "No recent track";
  }

  if (track.isPlaying) {
    return `Now: ${track.track} - ${track.artist}`;
  }

  return `Last: ${track.track} - ${track.artist}`;
}

export function NowPlayingBar() {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/now-playing", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ApiPayload;
        if (mounted) {
          setTrack(payload.data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-100 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <p className="font-medium uppercase tracking-[0.14em]">Now playing</p>
        <p className="truncate text-zinc-300">{loading ? "Loading..." : formatLabel(track)}</p>
      </div>
    </div>
  );
}
