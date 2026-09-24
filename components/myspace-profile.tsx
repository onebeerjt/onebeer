import { NowListening } from "@/components/now-listening";
import type { NowPlayingTrack } from "@/lib/types/content";
import { timeAgo } from "@/lib/format";

export type TopArtist = {
  artist: string;
  plays: number;
  art?: string;
};

function BoxHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="holo-bg border-b-2 border-ink px-3 py-2 font-pixel text-[12px] uppercase text-ink">{children}</h3>;
}

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
  const details = [
    ["Location", "Miami, FL"],
    ["Fueled by", "Cerveza"],
    ["Built with", "Vibes"],
    ["Films logged", String(filmsCount)],
    ["Dispatches", String(postsCount)]
  ];

  return (
    <section className="border-2 border-ink bg-white shadow-[6px_6px_0_#0a0a0a]">
      <BoxHeader>JT&apos;s profile</BoxHeader>
      <div className="flex gap-4 p-4">
        <div className="holo-bg grid h-24 w-24 flex-none place-items-center border-2 border-ink font-fraktur text-[46px] leading-none text-ink">JT</div>
        <div className="min-w-0 space-y-2">
          <p className="text-[17px] font-semibold leading-tight">@onebeerjt</p>
          <p className="text-[14px] italic leading-snug text-graphite">&ldquo;thoughts &amp; streams on tap&rdquo;</p>
          {moodUpdatedAt ? <p className="font-pixel text-[9px] uppercase text-graphite">Last login: {timeAgo(moodUpdatedAt)}</p> : null}
        </div>
      </div>

      <div className="border-t-2 border-ink px-4 py-3">
        <p className="font-pixel text-[10px] uppercase text-graphite">Mood</p>
        <p className="mt-0.5 text-[16px] leading-snug">{mood ?? "Unwritten"}</p>
      </div>

      <div className="border-t-2 border-ink px-4 py-3">
        <NowListening initial={track} />
      </div>

      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t-2 border-ink px-4 py-3 text-[14px]">
        {details.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-pixel text-[10px] uppercase leading-[21px] text-graphite">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TopEight({ artists, sample }: { artists: TopArtist[]; sample: number }) {
  if (artists.length === 0) return null;

  return (
    <section className="border-2 border-ink bg-white shadow-[6px_6px_0_#0a0a0a]">
      <BoxHeader>JT&apos;s Top {artists.length}</BoxHeader>
      <p className="px-4 pt-3 text-[13px] italic text-graphite">Most-played artists from the last {sample} scrobbles.</p>
      <ol className="grid grid-cols-4 gap-x-3 gap-y-4 p-4">
        {artists.map((entry) => (
          <li key={entry.artist}>
            <a
              href={`https://www.last.fm/music/${encodeURIComponent(entry.artist)}`}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <div
                className="aspect-square border border-ink bg-paper bg-cover bg-center transition-transform group-hover:-rotate-3 group-hover:scale-105"
                style={entry.art ? { backgroundImage: `url(${entry.art})` } : undefined}
              />
              <p className="mt-1 line-clamp-2 text-[12px] leading-tight text-link underline underline-offset-2">{entry.artist}</p>
              <p className="font-pixel text-[8px] uppercase text-graphite">{entry.plays} plays</p>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
