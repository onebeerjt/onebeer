import type { Metadata } from "next";
import Link from "next/link";
import { NowPlayingBar } from "@/components/now-playing-bar";
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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <NowPlayingBar />
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-8 pt-6 sm:px-6">
          <header className="mb-8 border-b-2 border-[#cdbfa6] pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link href="/" className="font-serif text-4xl font-semibold tracking-tight text-[#1f1a16]">
                  <span className="mr-2 align-middle text-3xl" aria-hidden>
                    🍺
                  </span>
                  onebeer
                </Link>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-[#6a5f55]">
                  JT (@onebeerjt) / personal wire
                </p>
              </div>
              <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-[#6a5f55]">
                <Link href="/" className="transition-colors hover:text-[#8f1f1f]">
                  Home
                </Link>
                <Link href="/blog" className="transition-colors hover:text-[#8f1f1f]">
                  Blog
                </Link>
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
