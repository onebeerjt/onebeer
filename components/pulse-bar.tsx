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

export function PulseBar() {
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

  const isPlaying = Boolean(track?.isPlaying);

  return (
    <div className="w-full border-b border-[#262b33] bg-[#0d0f12] px-4 py-2 text-xs sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
        <span className="live-dot" aria-hidden>
          {isPlaying ? <span className="live-dot-ping animate-ping" /> : null}
          <span className="live-dot-core" style={!isPlaying ? { opacity: 0.45 } : undefined} />
        </span>
        <span className="font-mono font-semibold uppercase tracking-[0.18em] text-[#3ee089]">Pulse</span>

        <div className="h-4 w-px flex-none bg-[#262b33]" aria-hidden />

        {loading ? (
          <span className="font-mono text-[#6f7480]">Reading the wire...</span>
        ) : track ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex-none font-mono uppercase tracking-[0.1em] text-[#6f7480]">
              {isPlaying ? "Now" : "Last"}
            </span>
            <span className="truncate text-[#f2efe9]">
              <span className="font-semibold">{track.track}</span>
              <span className="text-[#94989f]"> — {track.artist}</span>
            </span>
            {!isPlaying && track.playedAt ? (
              <span className="flex-none font-mono text-[#6f7480]">{formatPlayedTime(track.playedAt)}</span>
            ) : null}
          </div>
        ) : (
          <span className="font-mono text-[#6f7480]">No signal yet</span>
        )}
      </div>
    </div>
  );
}
