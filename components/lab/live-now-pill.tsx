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
    <section className="rounded-2xl border border-[#cdbfa6] bg-[rgba(255,252,246,0.95)] p-4 sm:p-5 motion-safe:animate-[lab-fade-in_0.45s_ease-out]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfd2be] pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#261a13] text-[10px] text-[#f7efe3]" aria-hidden>
            {isPlaying ? "♪" : "●"}
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5f5449]">Live Desk</p>
          {isPlaying ? (
            <span className="inline-flex items-end gap-[2px]" aria-label="Now playing activity">
              <span className="h-1.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_infinite]" />
              <span className="h-2.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_0.1s_infinite]" />
              <span className="h-1.5 w-[2px] bg-[#7c221e] motion-safe:animate-[lab-wave_1s_ease-in-out_0.2s_infinite]" />
            </span>
          ) : null}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#786d61]">{formatTimeLabel(liveTrack)}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-[#e3d7c4] bg-[#fffdf8] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#867a6e]">Listening</p>
          <p className="mt-1 text-base font-semibold leading-snug text-[#1f1a16] break-words">
            {liveTrack ? liveTrack.track : "No track right now"}
          </p>
          <p className="text-sm text-[#5f5449] break-words">{liveTrack ? liveTrack.artist : "Waiting for signal"}</p>
        </article>

        <article className="rounded-xl border border-[#e3d7c4] bg-[#fffdf8] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#867a6e]">Last Watched</p>
          <p className="mt-1 text-base font-semibold leading-snug text-[#1f1a16] break-words">
            {lastFilm ? lastFilm.title : "No recent film"}
          </p>
          <p className="text-sm text-[#5f5449]">{lastFilm?.rating ?? "No rating yet"}</p>
        </article>

        <article className="rounded-xl border border-[#e3d7c4] bg-[#fffdf8] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#867a6e]">Thinking About</p>
          <p className="mt-1 text-sm leading-relaxed text-[#2c2520] break-words">{thinking}</p>
        </article>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#ece2cf] pt-3">
        <Link href="/films" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#6a5f55] underline decoration-[#baa98e] underline-offset-4 hover:text-[#8f1f1f]">
          Film archive
        </Link>
        <Link href="/blog" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#6a5f55] underline decoration-[#baa98e] underline-offset-4 hover:text-[#8f1f1f]">
          Writing log
        </Link>
        {!reduceMotion && isPlaying ? <span className="text-xs text-[#7c221e]">Live playback active</span> : null}
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
