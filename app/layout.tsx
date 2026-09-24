import type { Metadata } from "next";
import Link from "next/link";
import { SubtitleBar } from "@/components/subtitle-bar";
import { getStatusInfo } from "@/lib/notion/status";
import { timeAgo } from "@/lib/format";
import { anton, cormorant, courier } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onebeer.io"),
  title: {
    default: "onebeer",
    template: "%s | onebeer"
  },
  description: "A film by JT. What I've been watching, hearing, and writing.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "onebeer",
    description: "A film by JT. What I've been watching, hearing, and writing.",
    url: "https://onebeer.io",
    siteName: "onebeer"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const status = await getStatusInfo();
  const noteAge = timeAgo(status.updatedAt);

  return (
    <html lang="en" className={`${anton.variable} ${cormorant.variable} ${courier.variable}`}>
      <body>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />

        <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
          <div className="flex items-start justify-between gap-6 px-5 py-5 text-[11px] uppercase tracking-[0.3em] text-bone sm:px-8">
            <div className="space-y-1.5">
              <Link href="/" className="font-semibold">
                One Beer
              </Link>
              {status.note ? (
                <p className="hidden max-w-[34ch] normal-case tracking-[0.06em] text-bone/60 sm:block">
                  Director&apos;s note: {status.note}
                  {noteAge ? ` · ${noteAge}` : ""}
                </p>
              ) : null}
            </div>
            <nav className="flex gap-6">
              <Link href="/films" className="transition-opacity hover:opacity-60">
                Films
              </Link>
              <Link href="/blog" className="transition-opacity hover:opacity-60">
                Writing
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-ash/50 px-6 pb-36 pt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-smoke">Written, directed &amp; scored by JT</p>
          <p className="mt-3 font-criterion text-[20px] italic text-bone/80">Miami based. Cerveza fueled. Vibe coded.</p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-ash">@onebeerjt · No beers were harmed in the making of this website</p>
        </footer>

        <SubtitleBar />
      </body>
    </html>
  );
}
