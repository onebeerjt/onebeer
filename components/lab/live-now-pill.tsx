"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LabFilmItem, LabTrackItem } from "@/components/lab/types";

type LiveNowPillProps = {
  liveTrack: LabTrackItem | null;
  lastFilm: LabFilmItem | null;
  thinking: string;
};

function inferPlaying(track: LabTrackItem | null) {
  if (!track) return false;
  if (track.isPlaying) return true;
  if (!track.playedAt) return false;
  const played = new Date(track.playedAt).getTime();
  if (Number.isNaN(played)) return false;
  return Date.now() - played <= 10 * 60 * 1000;
}

function formatTimeLabel(track: LabTrackItem | null) {
  if (!track?.playedAt) return "Live signal";
  const date = new Date(track.playedAt);
  if (Number.isNaN(date.getTime())) return "Live signal";
  return `Updated ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(date)}`;
}

export function LiveNowPill({ liveTrack, lastFilm, thinking }: LiveNowPillProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const isPlaying = useMemo(() => inferPlaying(liveTrack), [liveTrack]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section className="overflow-hidden rounded-xl border border-[#cdbfa6] bg-[rgba(255,252,246,0.95)] motion-safe:animate-[lab-fade-in_0.45s_ease-out]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7c9b0] bg-[#211814] px-4 py-3 text-[#f4ebdc] sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#b99a7c] bg-[#2e221c] text-[10px]" aria-hidden>
            {isPlaying ? "♪" : "●"}
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em]">Live Signal</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d8cab8]">{formatTimeLabel(liveTrack)}</p>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <article className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7d7063]">Now playing</p>
          <p className="mt-2 font-serif text-3xl leading-[1.02] text-[#1f1a16] sm:text-4xl break-words">
            {liveTrack ? liveTrack.track : "No track in rotation"}
          </p>
          <p className="mt-2 text-base text-[#4f443b] break-words">{liveTrack ? liveTrack.artist : "Waiting for signal"}</p>

          <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-[#d8cab5] px-3 py-1.5 text-xs text-[#5d5248]">
            {isPlaying && !reduceMotion ? (
              <span className="inline-flex items-end gap-[2px]" aria-label="Now playing activity">
                <span className="h-1.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_infinite]" />
                <span className="h-2.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_0.1s_infinite]" />
                <span className="h-1.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_0.2s_infinite]" />
              </span>
            ) : null}
            <span>{isPlaying ? "Playback active" : "Standby"}</span>
          </div>
        </article>

        <div className="space-y-2 rounded-lg border border-[#ded1bd] bg-[#fffdf8] p-3">
          <div className="border-b border-[#eee5d5] pb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#85796d]">Last watched</p>
            <p className="mt-1 text-lg font-semibold leading-tight text-[#1f1a16] break-words">{lastFilm ? lastFilm.title : "No recent film"}</p>
            <p className="text-sm text-[#5f5449]">{lastFilm?.rating ?? "No rating"}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#85796d]">Thinking about</p>
            <p className="mt-1 text-sm leading-relaxed text-[#2c2520] break-words">{thinking}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-[#e8dcc8] px-4 py-3 sm:px-5">
        <Link href="/films" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#6a5f55] underline decoration-[#baa98e] underline-offset-4 hover:text-[#8f1f1f]">
          Film archive
        </Link>
        <Link href="/blog" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#6a5f55] underline decoration-[#baa98e] underline-offset-4 hover:text-[#8f1f1f]">
          Writing log
        </Link>
      </div>

      <style jsx>{`
        @keyframes lab-wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </section>
  );
}
