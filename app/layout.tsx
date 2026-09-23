import type { Metadata } from "next";
import Link from "next/link";
import { PulseBar } from "@/components/pulse-bar";
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
        <PulseBar />
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24 pt-6 sm:px-6">
          <header className="mb-8 border-b border-[#1b1f26] pb-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <Link href="/" className="inline-flex items-baseline gap-2 font-serif text-4xl font-semibold tracking-tight text-[#f2efe9]">
                    <span className="text-3xl" aria-hidden>
                      🍺
                    </span>
                    <span>one beer</span>
                  </Link>
                  <span className="font-mono text-sm text-[#94989f]">thoughts &amp; streams on tap</span>
                </div>
                {statusNote ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-[#c9c5bc]">
                    <span aria-hidden>💬</span>
                    <span>{statusNote}</span>
                    {relativeStatusTime ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f7480]">
                        {relativeStatusTime}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6f7480]">
                  JT (@onebeerjt) / personal wire
                </p>
              </div>
              <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-[#94989f] sm:justify-end">
                <Link href="/" className="transition-colors hover:text-[#ff8a3d]">
                  Home
                </Link>
                <Link href="/blog" className="transition-colors hover:text-[#ff8a3d]">
                  Blog
                </Link>
                <Link href="/films" className="transition-colors hover:text-[#ff8a3d]">
                  Films
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-[#1b1f26] pt-6 text-sm text-[#6f7480]">
            <p>Miami based, cerveza fueled, vibe coded.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
