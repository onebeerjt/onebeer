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
      className="self-start border-2 border-ink bg-white px-4 py-3 font-pixel text-[10px] uppercase text-ink shadow-[4px_4px_0_#0a0a0a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#ff4fd8] disabled:cursor-not-allowed disabled:opacity-40 md:self-auto"
    >
      {status === "copied" ? "Copied to clipboard" : status === "error" ? "Couldn't copy — retry" : "Copy all titles"}
    </button>
  );
}
