"use client";

import { useEffect, useState } from "react";
import type { HomeData } from "./types";
import { formatPlayedAt } from "./format";

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 900;

    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{n}</>;
}

function Corners({ color = "#00e5ff" }: { color?: string }) {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: color, opacity: 0.5 }} />
      <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: color, opacity: 0.5 }} />
      <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2" style={{ borderColor: color, opacity: 0.5 }} />
      <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2" style={{ borderColor: color, opacity: 0.5 }} />
    </>
  );
}

export default function ThemeHud({ data }: { data: HomeData }) {
  const { posts, films, tracks } = data;
  const nowTrack = tracks.find((t) => t.isPlaying) ?? tracks[0];

  return (
    <div className="rounded-2xl border border-[#1c2733] bg-[#05070a] p-6 sm:p-9" style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" }}>
      <div className="flex items-center gap-3 border-b border-[#1c2733] pb-5">
        <span className="live-dot" aria-hidden>
          <span className="live-dot-ping animate-ping" style={{ backgroundColor: "#00e5ff" }} />
          <span className="live-dot-core" style={{ backgroundColor: "#00e5ff" }} />
        </span>
        <span className="text-xs uppercase tracking-[0.24em] text-[#00e5ff]">system status — all channels live</span>
        <div className="ml-auto flex h-4 items-end gap-1">
          {[8, 14, 6, 16, 10].map((h, i) => (
            <div key={i} className="a-bar w-[4px] bg-[#00e5ff]" style={{ height: h, animationDuration: "1s", animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex h-56 w-56 items-center justify-center">
        <div className="a-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-[#00e5ff]/30" style={{ animationDuration: "18s" }} />
        <div className="absolute inset-5 rounded-full border border-[#00e5ff]/15" />
        <div className="a-gauge absolute inset-5 rounded-full" style={{ boxShadow: "0 0 40px rgba(0,229,255,0.25)", animationDuration: "2.6s" }} />
        <div className="relative z-10 flex flex-col items-center px-8 text-center">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#00e5ff]">now playing</div>
          {nowTrack ? (
            <>
              <div className="mt-2 line-clamp-2 text-lg font-semibold text-[#f2efe9]">{nowTrack.track}</div>
              <div className="mt-1 text-xs text-[#7d95a3]">{nowTrack.artist}</div>
            </>
          ) : (
            <div className="mt-2 text-sm text-[#7d95a3]">no signal</div>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3">
        <div className="relative border border-[#1c2733] bg-[#0a0d12] p-5">
          <Corners />
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7d95a3]">films tracked</div>
          <div className="mt-1 text-3xl font-semibold text-[#f2efe9]">
            <CountUp value={films.length} />
          </div>
        </div>
        <div className="relative border border-[#1c2733] bg-[#0a0d12] p-5">
          <Corners />
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7d95a3]">tracks logged</div>
          <div className="mt-1 text-3xl font-semibold text-[#f2efe9]">
            <CountUp value={tracks.length} />
          </div>
        </div>
        <div className="relative border border-[#1c2733] bg-[#0a0d12] p-5">
          <Corners />
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7d95a3]">posts live</div>
          <div className="mt-1 text-3xl font-semibold text-[#f2efe9]">
            <CountUp value={posts.length} />
          </div>
        </div>
      </div>

      {films.length > 0 ? (
        <div className="mt-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#00e5ff]">film feed</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {films.slice(0, 4).map((film, i) => (
              <div
                key={`${film.letterboxdUrl}-${i}`}
                className="relative flex items-center gap-3 border border-[#1c2733] bg-[#0a0d12] p-4"
                style={{ clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)" }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[#f2efe9]">
                    {film.title} {film.year ? <span className="text-[#7d95a3]">({film.year})</span> : null}
                  </p>
                </div>
                {film.rating ? (
                  <div className="flex-none rounded-full border border-[#00e5ff]/40 px-3 py-1 text-xs text-[#00e5ff]">{film.rating}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tracks.length > 0 ? (
        <div className="mt-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#00e5ff]">audio feed</div>
          <div className="mt-3 flex flex-col divide-y divide-[#1c2733] border border-[#1c2733] bg-[#0a0d12]">
            {tracks.slice(0, 5).map((track, i) => (
              <div key={`${track.track}-${i}`} className="flex items-center gap-4 px-4 py-3">
                <div className="flex h-6 flex-none items-end gap-[3px]">
                  {[6, 12, 8, 14].map((h, j) => (
                    <div
                      key={j}
                      className={track.isPlaying ? "a-bar w-[3px] bg-[#3ee089]" : "w-[3px] bg-[#2a3542]"}
                      style={track.isPlaying ? { height: h, animationDuration: "1s", animationDelay: `${j * 0.1}s` } : { height: h }}
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[#f2efe9]">{track.track}</p>
                  <p className="truncate text-xs text-[#7d95a3]">{track.artist}</p>
                </div>
                <div className="flex-none text-xs text-[#7d95a3]">{track.isPlaying ? "live" : formatPlayedAt(track.playedAt)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
