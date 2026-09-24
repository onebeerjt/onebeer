import type { Metadata } from "next";
import Link from "next/link";
import { SparkleCursor } from "@/components/sparkle-cursor";
import { Ticker } from "@/components/ticker";
import { getRecentTracks } from "@/lib/lastfm/now-playing";
import { getCatalogue } from "@/lib/letterboxd/catalogue";
import { getStatusInfo } from "@/lib/notion/status";
import { cormorant, fraktur, news, pixel } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onebeer.io"),
  title: {
    default: "One Beer",
    template: "%s | One Beer"
  },
  description: "JT's films, music, and the blog Quite Probably.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "One Beer",
    description: "JT's films, music, and the blog Quite Probably.",
    url: "https://onebeer.io",
    siteName: "One Beer"
  }
};

const NAV = [
  { href: "/", label: "Front page" },
  { href: "/blog", label: "Quite Probably" },
  { href: "/films", label: "Films" }
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [status, catalogue, tracks] = await Promise.all([getStatusInfo(), getCatalogue(), getRecentTracks(1)]);

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(new Date());

  const film = catalogue[0];
  const track = tracks[0];
  const tickerItems = [
    status.note ? `Mood: ${status.note}` : null,
    film ? `Now showing: ${film.title}${film.year ? ` (${film.year})` : ""}${film.rating ? ` ${film.rating}` : ""}` : null,
    track ? `${track.isPlaying ? "Now spinning" : "Last spun"}: ${track.track} — ${track.artist}` : null,
    catalogue.length ? `${catalogue.length} films on the shelf` : null,
    "Miami based · cerveza fueled · vibe coded"
  ].filter((item): item is string => Boolean(item));

  return (
    <html lang="en" className={`${fraktur.variable} ${news.variable} ${pixel.variable} ${cormorant.variable}`}>
      <body>
        <div className="paper-grain" aria-hidden />
        <SparkleCursor />

        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 border-b border-ink py-2 font-pixel text-[9px] uppercase sm:text-[10px]">
            <span>Miami edition</span>
            <span className="hidden sm:inline">{today}</span>
            <span>Price: one beer</span>
          </div>

          <header className="py-6 text-center sm:py-8">
            <Link href="/" className="masthead font-fraktur text-[clamp(46px,10vw,132px)] leading-[0.95]">
              One Beer
            </Link>
            <p className="mt-3 text-[15px] italic text-graphite sm:text-[17px]">&ldquo;All the news that&apos;s fit to pour&rdquo; — thoughts &amp; streams on tap</p>
          </header>

          <nav className="flex items-center justify-center gap-4 border-y-4 border-double border-ink py-2 font-pixel text-[10px] uppercase sm:gap-6 sm:text-[11px]">
            {NAV.map((item, index) => (
              <span key={item.href} className="flex items-center gap-4 sm:gap-6">
                {index > 0 ? (
                  <span aria-hidden className="text-vice-pink">
                    ✦
                  </span>
                ) : null}
                <Link href={item.href} className="decoration-vice-pink decoration-2 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <Ticker items={tickerItems} />
        </div>

        <main className="mx-auto max-w-[1240px] px-4 sm:px-8">{children}</main>

        <footer className="mx-auto mt-20 max-w-[1240px] px-4 pb-12 text-center sm:px-8">
          <div className="border-t-4 border-double border-ink pt-8">
            <p className="font-fraktur text-[34px] leading-none">One Beer</p>
            <p className="mt-3 italic text-graphite">Miami based, cerveza fueled, vibe coded.</p>
            <p className="mt-4 font-pixel text-[9px] uppercase text-graphite">Printed daily in the metaverse · Written &amp; edited by JT · @onebeerjt</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
