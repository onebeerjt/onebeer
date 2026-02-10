import type { Metadata } from "next";
import Link from "next/link";
import { NowPlayingBar } from "@/components/now-playing-bar";
import { getStatusNote } from "@/lib/notion/status";
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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const statusNote = await getStatusNote();
  return (
    <html lang="en">
      <body className="font-sans">
        <NowPlayingBar />
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-8 pt-6 sm:px-6">
          <header className="mb-6 border-b-2 border-[#cdbfa6] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <Link href="/" className="inline-flex items-baseline gap-3 font-serif text-4xl font-semibold tracking-tight text-[#1f1a16]">
                  <span className="text-3xl" aria-hidden>
                    🍺
                  </span>
                  <span>one beer</span>
                  <span className="text-xl font-normal text-[#4f443b]">thoughts &amp; streams on tap</span>
                </Link>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#6a5f55]">
                  JT (@onebeerjt) / personal wire
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {statusNote ? (
                  <div className="relative order-first flex items-center gap-2">
                    <div className="relative rounded-full border border-[#cdbfa6] bg-[#fff9ef] px-4 py-2 text-xs font-semibold text-[#1f1a16] shadow-sm">
                      {statusNote}
                      <span className="absolute -left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-[#cdbfa6] bg-[#fff9ef]" />
                      <span className="absolute -left-6 top-[58%] h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-[#cdbfa6] bg-[#fff9ef]" />
                    </div>
                    <span className="text-xs">💭</span>
                  </div>
                ) : null}
                <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-[#6a5f55]">
                <Link href="/" className="transition-colors hover:text-[#8f1f1f]">
                  Home
                </Link>
                <Link href="/blog" className="transition-colors hover:text-[#8f1f1f]">
                  Blog
                </Link>
                <Link href="/films" className="transition-colors hover:text-[#8f1f1f]">
                  Films
                </Link>
                </nav>
              </div>
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
