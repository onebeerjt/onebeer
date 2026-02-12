"use client";

const PALETTES = [
  { glow: "rgba(255, 247, 219, 0.62)", from: "#f9f3e6", to: "#efe6d4" },
  { glow: "rgba(230, 246, 255, 0.56)", from: "#eef6ff", to: "#dae8f8" },
  { glow: "rgba(240, 255, 240, 0.56)", from: "#eef9ef", to: "#d8ecd8" },
  { glow: "rgba(255, 235, 227, 0.56)", from: "#fff1e9", to: "#f6dfd4" },
  { glow: "rgba(250, 240, 255, 0.56)", from: "#f8efff", to: "#e9dcf8" },
  { glow: "rgba(255, 249, 225, 0.6)", from: "#fdf7e8", to: "#efe4c4" }
];

export function BackgroundRandomizer() {
  function randomizeBackground() {
    const next = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const root = document.documentElement;
    root.style.setProperty("--bg-glow", next.glow);
    root.style.setProperty("--bg-from", next.from);
    root.style.setProperty("--bg-to", next.to);
  }

  return (
    <button
      type="button"
      onClick={randomizeBackground}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#cdbfa6] bg-[#fff8eb] text-sm leading-none transition-colors hover:bg-[#f5ead3]"
      aria-label="Randomize background color"
      title="Randomize background"
    >
      🎨
    </button>
  );
}
