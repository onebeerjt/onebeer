"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LabFilmItem, LabTrackItem } from "@/components/lab/types";

type LiveNowPillProps = {
  liveTrack: LabTrackItem | null;
  lastFilm: LabFilmItem | null;
  thinking: string;
};

type LivePrefs = {
  showThinking: boolean;
  showFilms: boolean;
  compactMode: boolean;
};

const DEFAULT_PREFS: LivePrefs = {
  showThinking: true,
  showFilms: true,
  compactMode: false
};

const PREFS_KEY = "onebeer_lab_live_prefs_v1";

function inferPlaying(track: LabTrackItem | null) {
  if (!track) return false;
  if (track.isPlaying) return true;
  if (!track.playedAt) return false;
  const played = new Date(track.playedAt).getTime();
  if (Number.isNaN(played)) return false;
  return Date.now() - played <= 10 * 60 * 1000;
}

export function LiveNowPill({ liveTrack, lastFilm, thinking }: LiveNowPillProps) {
  const [expanded, setExpanded] = useState(false);
  const [peekActive, setPeekActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [pauseMarquee, setPauseMarquee] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<LivePrefs>(DEFAULT_PREFS);
  const [reduceMotion, setReduceMotion] = useState(false);

  const marqueeViewportRef = useRef<HTMLSpanElement | null>(null);
  const marqueeMeasureRef = useRef<HTMLSpanElement | null>(null);
  const peekTimerRef = useRef<number | null>(null);
  const pressTimerRef = useRef<number | null>(null);
  const previousScrollY = useRef(0);

  const nowPlayingLabel = useMemo(() => {
    if (!liveTrack) return "No track detected";
    return `${liveTrack.track} - ${liveTrack.artist}`;
  }, [liveTrack]);

  const isPlaying = useMemo(() => inferPlaying(liveTrack), [liveTrack]);
  const showPeek = !expanded && peekActive && prefs.showThinking;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LivePrefs>;
      setPrefs({
        showThinking: parsed.showThinking ?? true,
        showFilms: parsed.showFilms ?? true,
        compactMode: parsed.compactMode ?? false
      });
    } catch {
      setPrefs(DEFAULT_PREFS);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const viewport = marqueeViewportRef.current;
      const content = marqueeMeasureRef.current;
      if (!viewport || !content) return;
      setIsOverflowing(content.scrollWidth > viewport.clientWidth + 2);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [nowPlayingLabel, prefs.compactMode]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    previousScrollY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - previousScrollY.current;
      previousScrollY.current = current;

      if (expanded || delta >= -10) return;
      setPeekActive(true);
      if (peekTimerRef.current) window.clearTimeout(peekTimerRef.current);
      peekTimerRef.current = window.setTimeout(() => setPeekActive(false), 2000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (peekTimerRef.current) window.clearTimeout(peekTimerRef.current);
    };
  }, [expanded, reduceMotion]);

  function pulsePress() {
    setPressed(true);
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
    pressTimerRef.current = window.setTimeout(() => setPressed(false), 120);
  }

  function togglePref<K extends keyof LivePrefs>(key: K) {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  }

  const shellClass = [
    "w-full overflow-hidden rounded-full border border-[#bfb29a] bg-[rgba(255,251,242,0.72)] shadow-[0_8px_30px_rgba(40,30,20,0.08)] backdrop-blur-md",
    "transition-[transform,border-radius,padding] duration-300 focus-within:ring-2 focus-within:ring-[#8f1f1f]",
    pressed ? "scale-[0.985]" : "scale-100",
    expanded || showPeek ? "rounded-3xl" : "",
    prefs.compactMode ? "px-3 py-2" : "px-4 py-3",
    !expanded && !showPeek && !reduceMotion ? "motion-safe:animate-[lab-breathe_4.8s_ease-in-out_infinite]" : ""
  ].join(" ");

  return (
    <div className="sticky top-3 z-40 flex justify-center px-2">
      <div className="w-full max-w-2xl">
        <div className={shellClass}>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            onPointerDown={pulsePress}
            onMouseEnter={() => setPauseMarquee(true)}
            onMouseLeave={() => setPauseMarquee(false)}
            onTouchStart={() => setPauseMarquee(true)}
            onTouchEnd={() => setPauseMarquee(false)}
            className="w-full text-left focus-visible:outline-none"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse live now panel" : "Expand live now panel"}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#201712] text-xs text-[#f8efe2]">
                {isPlaying ? (
                  <span className="inline-flex items-end gap-[1px]" aria-hidden>
                    <span className="h-1.5 w-[2px] bg-[#f8efe2] motion-safe:animate-[lab-wave_1s_ease-in-out_infinite]" />
                    <span className="h-2.5 w-[2px] bg-[#f8efe2] motion-safe:animate-[lab-wave_1s_ease-in-out_0.15s_infinite]" />
                    <span className="h-1.5 w-[2px] bg-[#f8efe2] motion-safe:animate-[lab-wave_1s_ease-in-out_0.3s_infinite]" />
                  </span>
                ) : (
                  "●"
                )}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5b5148]">Now Playing</span>
              <span ref={marqueeViewportRef} className="relative min-w-0 flex-1 overflow-hidden font-medium text-[#1f1a16]">
                <span ref={marqueeMeasureRef} className="invisible absolute left-0 top-0 whitespace-nowrap">
                  {nowPlayingLabel}
                </span>
                {isOverflowing && !reduceMotion ? (
                  <span
                    className="inline-flex min-w-full gap-8 whitespace-nowrap motion-safe:animate-[lab-marquee_13s_linear_infinite]"
                    style={{ animationPlayState: pauseMarquee ? "paused" : "running" }}
                  >
                    <span>{nowPlayingLabel}</span>
                    <span aria-hidden>{nowPlayingLabel}</span>
                  </span>
                ) : (
                  <span className="block whitespace-normal break-words">
                    {nowPlayingLabel}
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6a5f55]">{expanded ? "Hide" : "Live"}</span>
            </div>
          </button>

          {(expanded || showPeek) && (
            <div className="mt-3 space-y-2 rounded-2xl border border-[#d7c9b0] bg-[rgba(255,254,249,0.86)] p-3">
              <p className="text-sm break-words text-[#2b241f]">
                <span className="mr-2">🎧</span>
                <span className="font-semibold">Listening:</span>{" "}
                {liveTrack ? `${liveTrack.track} - ${liveTrack.artist}` : "No track right now"}
              </p>

              {prefs.showFilms && (
                <p className="text-sm break-words text-[#2b241f]">
                  <span className="mr-2">🎬</span>
                  <span className="font-semibold">Last watched:</span>{" "}
                  {lastFilm ? `${lastFilm.title}${lastFilm.rating ? ` - ${lastFilm.rating}` : ""}` : "No recent film"}
                </p>
              )}

              {prefs.showThinking && (
                <p className="text-sm break-words text-[#2b241f]">
                  <span className="mr-2">🧠</span>
                  <span className="font-semibold">Thinking about:</span> {thinking}
                </p>
              )}

              {expanded && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSettings((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#d5c6ab] bg-[#fff9ef] px-2 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#5f5347] hover:bg-[#f5ebd7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f1f]"
                    aria-expanded={showSettings}
                    aria-label="Open live module settings"
                  >
                    ⚙ Settings
                  </button>

                  {showSettings && (
                    <div className="mt-2 space-y-2 rounded-md border border-[#d7c9b0] bg-[#fffdf8] p-2">
                      <label className="flex items-center justify-between gap-3 text-xs text-[#3f372f]">
                        <span>Show Thinking about</span>
                        <input
                          type="checkbox"
                          checked={prefs.showThinking}
                          onChange={() => togglePref("showThinking")}
                          className="h-4 w-4 accent-[#8f1f1f]"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 text-xs text-[#3f372f]">
                        <span>Show films row</span>
                        <input
                          type="checkbox"
                          checked={prefs.showFilms}
                          onChange={() => togglePref("showFilms")}
                          className="h-4 w-4 accent-[#8f1f1f]"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 text-xs text-[#3f372f]">
                        <span>Compact mode</span>
                        <input
                          type="checkbox"
                          checked={prefs.compactMode}
                          onChange={() => togglePref("compactMode")}
                          className="h-4 w-4 accent-[#8f1f1f]"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes lab-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(calc(-50% - 1rem));
          }
        }
        @keyframes lab-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.008);
          }
        }
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
    </div>
  );
}
