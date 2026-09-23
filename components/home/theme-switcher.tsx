"use client";

import { useEffect, useState } from "react";
import type { HomeData } from "./types";
import ThemeCards from "./theme-cards";
import ThemeTerminal from "./theme-terminal";
import ThemeHud from "./theme-hud";
import ThemeKinetic from "./theme-kinetic";

const THEMES = [
  { id: "terminal", label: "Terminal" },
  { id: "hud", label: "HUD" },
  { id: "kinetic", label: "Kinetic" },
  { id: "cards", label: "Signal" }
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "onebeer-theme";

export function ThemeSwitcher({ data }: { data: HomeData }) {
  const [theme, setTheme] = useState<ThemeId>("terminal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (stored && THEMES.some((t) => t.id === stored)) {
        setTheme(stored);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  return (
    <div>
      {theme === "cards" ? <ThemeCards data={data} /> : null}
      {theme === "terminal" ? <ThemeTerminal data={data} /> : null}
      {theme === "hud" ? <ThemeHud data={data} /> : null}
      {theme === "kinetic" ? <ThemeKinetic data={data} /> : null}

      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#262b33] bg-[#14171c]/95 p-1 shadow-2xl backdrop-blur">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={
              theme === t.id
                ? "rounded-full bg-[#ff8a3d] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#14171c]"
                : "rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#94989f] hover:text-[#f2efe9]"
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
