import Link from "next/link";
import { NowListening } from "@/components/now-listening";
import type { NowPlayingTrack } from "@/lib/types/content";
import { timeAgo } from "@/lib/format";

export type TopArtist = {
  artist: string;
  plays: number;
  art?: string;
};

export function MySpaceProfile({
  mood,
  moodUpdatedAt,
  track,
  filmsCount,
  postsCount
}: {
  mood: string | null;
  moodUpdatedAt: string | null;
  track: NowPlayingTrack | null;
  filmsCount: number;
  postsCount: number;
}) {
  const seen = timeAgo(moodUpdatedAt);

  return (
    <section className="overflow-hidden border-2 border-ink bg-vice-night text-[#f6e9ff] shadow-[6px_6px_0_#ff2a6d]">
      <div className="holo-bg relative h-24 overflow-hidden border-b-2 border-ink">
        <p className="absolute left-3 top-2 font-pixel text-[10px] uppercase text-ink">JT&apos;s profile</p>
        <div aria-hidden className="vice-sun absolute -bottom-3 right-5 h-24 w-24 rounded-full" />
      </div>

      <div className="px-4 pb-5">
        <div className="relative z-10 -mt-9 flex items-end gap-3">
          <div className="grid h-[76px] w-[76px] flex-none place-items-center border-2 border-vice-pink bg-vice-night shadow-[0_0_20px_rgba(255,42,109,0.55)]">
            <span className="holo-text font-fraktur text-[42px] leading-none">JT</span>
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-[19px] font-semibold leading-tight text-white">@onebeerjt</p>
            <p className="font-pixel text-[9px] uppercase text-vice-teal">
              Miami, FL{seen ? ` · seen ${seen}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-5 border-l-2 border-vice-pink pl-3">
          <p className="font-pixel text-[9px] uppercase text-vice-magenta">Mood</p>
          <p className="text-[20px] italic leading-snug">{mood ?? "Unwritten"}</p>
        </div>

        <div className="mt-4 border border-white/10 bg-black/30 p-3">
          <NowListening initial={track} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 font-pixel text-[9px] uppercase">
          <Link href="/films" className="border border-vice-teal/60 px-2 py-1 text-vice-teal transition-colors hover:bg-vice-teal hover:text-ink">
            {filmsCount} films
          </Link>
          <Link href="/blog" className="border border-vice-pink/60 px-2 py-1 text-vice-pink transition-colors hover:bg-vice-pink hover:text-ink">
            {postsCount} {postsCount === 1 ? "post" : "posts"}
          </Link>
          <span className="border border-vice-orange/60 px-2 py-1 text-vice-orange">Cerveza fueled</span>
        </div>
      </div>
    </section>
  );
}

export function TopEight({ artists, sample }: { artists: TopArtist[]; sample: number }) {
  if (artists.length === 0) return null;
  const max = artists[0].plays;

  return (
    <section className="overflow-hidden border-2 border-ink bg-vice-night text-[#f6e9ff] shadow-[6px_6px_0_#b026ff]">
      <h3 className="holo-bg border-b-2 border-ink px-3 py-2 font-pixel text-[11px] uppercase text-ink">JT&apos;s Top {artists.length}</h3>
      <p className="px-4 pt-3 text-[13px] italic text-[#d9c2ea]">Most-played artists, last {sample} scrobbles.</p>
      <ol className="grid grid-cols-4 gap-x-3 gap-y-5 p-4">
        {artists.map((entry, index) => (
          <li key={entry.artist}>
            <a href={`https://www.last.fm/music/${encodeURIComponent(entry.artist)}`} target="_blank" rel="noreferrer" className="group block">
              <div
                className="relative aspect-square border border-white/20 bg-black bg-cover bg-center transition-transform group-hover:-rotate-3 group-hover:scale-105"
                style={entry.art ? { backgroundImage: `url(${entry.art})` } : undefined}
              >
                <span className="absolute left-0 top-0 bg-vice-pink px-1 font-pixel text-[8px] text-ink">#{index + 1}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-tight text-white transition-colors group-hover:text-vice-pink">{entry.artist}</p>
              <div className="mt-1 h-1 bg-white/10">
                <div className="holo-bg h-full" style={{ width: `${Math.max(12, (entry.plays / max) * 100)}%` }} />
              </div>
              <p className="mt-0.5 font-pixel text-[8px] uppercase text-[#bfa6d4]">
                {entry.plays} {entry.plays === 1 ? "play" : "plays"}
              </p>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
