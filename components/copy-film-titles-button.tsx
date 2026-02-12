"use client";

import { useMemo, useState } from "react";

type CopyFilmTitlesButtonProps = {
  titles: string[];
};

export default function CopyFilmTitlesButton({ titles }: CopyFilmTitlesButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const textToCopy = useMemo(() => titles.join("\n"), [titles]);

  async function handleCopy() {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!textToCopy}
      className="inline-flex items-center gap-2 rounded-md border border-[#cdbfa6] bg-[#fffdf7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f443b] transition-colors hover:bg-[#f4ebd8] disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Copy film titles"
      title={status === "copied" ? "Copied" : "Copy titles"}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="11" height="11" rx="2" ry="2" />
        <rect x="4" y="4" width="11" height="11" rx="2" ry="2" />
      </svg>
      {status === "copied" ? "Copied" : status === "error" ? "Retry" : "Copy titles"}
    </button>
  );
}
