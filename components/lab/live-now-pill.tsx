"use client";

import { useMemo, useState } from "react";
import type { LabFilmItem, LabTrackItem } from "@/components/lab/types";

type LiveNowPillProps = {
  liveTrack: LabTrackItem | null;
  lastFilm: LabFilmItem | null;
  thinking: string;
};

export function LiveNowPill({ liveTrack, lastFilm, thinking }: LiveNowPillProps) {
  const [expanded, setExpanded] = useState(false);

  const nowPlayingLabel = useMemo(() => {
    if (!liveTrack) return "No track detected";
    return `${liveTrack.track} - ${liveTrack.artist}`;
  }, [liveTrack]);

  return (
    <div className="sticky top-3 z-40 flex justify-center px-2">
      <div className="w-full max-w-2xl">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full rounded-full border border-[#bfb29a] bg-[rgba(255,251,242,0.72)] px-4 py-3 text-left shadow-[0_8px_30px_rgba(40,30,20,0.08)] backdrop-blur-md transition-transform duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f1f]"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse live now panel" : "Expand live now panel"}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#201712] text-xs text-[#f8efe2]">●</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5b5148]">Now Playing</span>
            <span className="min-w-0 flex-1 overflow-hidden font-medium text-[#1f1a16]">
              <span className="inline-block min-w-full whitespace-nowrap motion-safe:animate-[lab-marquee_14s_linear_infinite] motion-reduce:animate-none">
                {nowPlayingLabel}
              </span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6a5f55]">{expanded ? "Hide" : "Live"}</span>
          </div>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ${expanded ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden">
              <div className="space-y-2 rounded-2xl border border-[#d7c9b0] bg-[rgba(255,254,249,0.86)] p-3">
                <p className="text-sm text-[#2b241f]">
                  <span className="mr-2">🎧</span>
                  <span className="font-semibold">Listening:</span>{" "}
                  {liveTrack ? `${liveTrack.track} - ${liveTrack.artist}` : "No track right now"}
                </p>
                <p className="text-sm text-[#2b241f]">
                  <span className="mr-2">🎬</span>
                  <span className="font-semibold">Last watched:</span>{" "}
                  {lastFilm ? `${lastFilm.title}${lastFilm.rating ? ` - ${lastFilm.rating}` : ""}` : "No recent film"}
                </p>
                <p className="text-sm text-[#2b241f]">
                  <span className="mr-2">🧠</span>
                  <span className="font-semibold">Thinking about:</span> {thinking}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
      <style jsx>{`
        @keyframes lab-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
