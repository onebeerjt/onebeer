"use client";

import { useEffect, useState } from "react";
import type { NowPlayingTrack } from "@/lib/types/content";

type ApiPayload = {
  ok: boolean;
  data: NowPlayingTrack | null;
};

function formatPlayedTime(iso: string | undefined) {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return "just now";
  }

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatLabel(track: NowPlayingTrack | null) {
  if (!track) {
    return "No recent track";
  }

  if (track.isPlaying) {
    return `Now: ${track.track} - ${track.artist}`;
  }

  const when = formatPlayedTime(track.playedAt);
  return `Last: ${track.track} - ${track.artist}${when ? ` (${when})` : ""}`;
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
    <div className="w-full border-b-2 border-[#5d1a1a] bg-[#201818] px-4 py-2 text-xs text-[#f2e9d8] sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <p className="font-mono font-medium uppercase tracking-[0.16em]">Now playing</p>
        <p className="truncate font-mono text-[#d7c9b2]">{loading ? "Loading..." : formatLabel(track)}</p>
      </div>
    </div>
  );
}
