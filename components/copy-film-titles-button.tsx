"use client";

import { useMemo, useState } from "react";

export default function CopyFilmTitlesButton({ titles }: { titles: string[] }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const textToCopy = useMemo(() => titles.join("\n"), [titles]);

  async function handleCopy() {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!textToCopy}
      className="self-start border border-bone/30 px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-bone transition-colors hover:border-marquee hover:text-marquee disabled:cursor-not-allowed disabled:opacity-40 md:self-auto"
    >
      {status === "copied" ? "Copied to clipboard" : status === "error" ? "Couldn't copy — retry" : "Copy all titles"}
    </button>
  );
}
