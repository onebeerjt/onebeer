"use client";

import { useEffect } from "react";

const COLORS = ["#ff4fd8", "#8a5cff", "#3ff0ff", "#c8ff3a"];

export function SparkleCursor() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let last = 0;
    let count = 0;

    function onMove(event: PointerEvent) {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;

      const star = document.createElement("span");
      star.className = "sparkle";
      star.textContent = "✦";
      star.style.left = `${event.clientX}px`;
      star.style.top = `${event.clientY}px`;
      star.style.color = COLORS[count++ % COLORS.length];
      star.style.fontSize = `${8 + Math.random() * 9}px`;
      star.addEventListener("animationend", () => star.remove());
      document.body.appendChild(star);
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
