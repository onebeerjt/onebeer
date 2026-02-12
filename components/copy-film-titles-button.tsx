"use client";

import { useMemo, useState } from "react";

type CopyFilmTitlesButtonProps = {
  films: Array<{ title: string; rating?: string }>;
};

export default function CopyFilmTitlesButton({ films }: CopyFilmTitlesButtonProps) {
  const [status, setStatus] = useState<"idle" | "titles" | "ratings" | "error">("idle");
  const titlesText = useMemo(() => films.map((film) => film.title).join("\n"), [films]);
  const titlesWithRatingsText = useMemo(
    () => films.map((film) => `${film.title} - ${film.rating ?? "No rating"}`).join("\n"),
    [films]
  );

  async function handleCopy(mode: "titles" | "ratings") {
    const textToCopy = mode === "titles" ? titlesText : titlesWithRatingsText;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setStatus(mode);
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1800);
    }
  }

  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        onClick={() => handleCopy("titles")}
        disabled={!titlesText}
        className="inline-flex items-center gap-2 rounded-md border border-[#cdbfa6] bg-[#fffdf7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f443b] transition-colors hover:bg-[#f4ebd8] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Copy film titles"
        title={status === "titles" ? "Copied titles" : "Copy titles"}
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
        {status === "titles" ? "Copied titles" : status === "ratings" ? "Copied w/ ratings" : status === "error" ? "Retry" : "Copy titles"}
      </button>

      <div className="pointer-events-none absolute left-0 top-[calc(100%+6px)] z-20 w-max rounded-md border border-[#cdbfa6] bg-[#fffdf7] p-1 opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => handleCopy("ratings")}
          disabled={!titlesWithRatingsText}
          className="w-full rounded px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f443b] hover:bg-[#f4ebd8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy with ratings
        </button>
      </div>
    </div>
  );
}
