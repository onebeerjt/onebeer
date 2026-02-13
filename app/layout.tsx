import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundRandomizer } from "@/components/background-randomizer";
import { NowPlayingBar } from "@/components/now-playing-bar";
import { getStatusInfo } from "@/lib/notion/status";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onebeer.io"),
  title: {
    default: "onebeer",
    template: "%s | onebeer"
  },
  description: "What JT has been writing, watching, and listening to lately.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "onebeer",
    description: "A lightweight personal hub for JT's latest writing, films, and music.",
    url: "https://onebeer.io",
    siteName: "onebeer"
  }
};

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  if (diffSeconds < 45) {
    return "just now";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return rtf.format(-diffDays, "day");
  }

  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 5) {
    return rtf.format(-diffWeeks, "week");
  }

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) {
    return rtf.format(-diffMonths, "month");
  }

  const diffYears = Math.round(diffDays / 365);
  return rtf.format(-diffYears, "year");
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const status = await getStatusInfo();
  const statusNote = status.note;
  const statusUpdatedAt = status.updatedAt;

  const relativeStatusTime = statusUpdatedAt ? formatRelativeTime(statusUpdatedAt) : null;
  return (
    <html lang="en">
      <body className="font-sans">
        <NowPlayingBar />
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-8 pt-6 sm:px-6">
          <header className="mb-6 border-b-2 border-[#cdbfa6] pb-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/" className="inline-flex items-baseline gap-3 font-serif text-4xl font-semibold tracking-tight text-[#1f1a16]">
                    <span className="text-3xl" aria-hidden>
                      🍺
                    </span>
                    <span>one beer</span>
                  </Link>
                  <span className="text-xl font-normal text-[#4f443b]">thoughts &amp; streams on tap</span>
                  {statusNote ? (
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f1a16]">
                      <span className="text-sm">💬</span>
                      <span>{statusNote}</span>
                      {relativeStatusTime ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6a5f55]">
                          {relativeStatusTime}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6a5f55]">
                  JT (@onebeerjt) / personal wire
                </p>
              </div>
              <span className="hidden sm:block" />
              <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-[#6a5f55] sm:justify-end">
                <Link href="/" className="transition-colors hover:text-[#8f1f1f]">
                  Home
                </Link>
                <Link href="/blog" className="transition-colors hover:text-[#8f1f1f]">
                  Blog
                </Link>
                <Link href="/films" className="transition-colors hover:text-[#8f1f1f]">
                  Films
                </Link>
                <Link href="/lab" className="transition-colors hover:text-[#8f1f1f]">
                  Lab
                </Link>
                <BackgroundRandomizer />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t-2 border-[#cdbfa6] pt-6 text-sm text-[#6a5f55]">
            <p>Miami based, cerveza fueled, vibe coded.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
