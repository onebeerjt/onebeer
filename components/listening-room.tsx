import type { NowPlayingTrack } from "@/lib/types/content";

type TopArtist = {
  artist: string;
  plays: number;
  art?: string;
};

// Last.fm reports some scrobbles twice back-to-back.
function dropRepeats(tracks: NowPlayingTrack[]) {
  let previous = "";
  return tracks.filter((track) => {
    const key = `${track.track}|${track.artist}`.toLowerCase();
    const repeat = key === previous;
    previous = key;
    return !repeat;
  });
}

function topArtists(tracks: NowPlayingTrack[]): TopArtist[] {
  const counts = new Map<string, TopArtist>();
  for (const track of tracks) {
    const entry = counts.get(track.artist) ?? { artist: track.artist, plays: 0 };
    entry.plays += 1;
    if (!entry.art && track.albumArt) entry.art = track.albumArt;
    counts.set(track.artist, entry);
  }
  return Array.from(counts.values())
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 8);
}

function playedOn(value: string | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" }).format(date);
}

export function ListeningRoom({ tracks: raw }: { tracks: NowPlayingTrack[] }) {
  const tracks = dropRepeats(raw);
  if (tracks.length === 0) return null;

  const artists = topArtists(tracks);
  const max = artists[0]?.plays ?? 1;

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-double border-ink pb-3">
        <div>
          <p className="font-pixel text-[10px] uppercase text-graphite">On rotation</p>
          <h2 className="mt-1 text-[clamp(38px,5vw,64px)] font-bold leading-none tracking-[-0.02em]">Heavy Rotation</h2>
        </div>
        <p className="pb-1 font-pixel text-[10px] uppercase text-graphite">Via Last.fm · last {tracks.length} plays</p>
      </div>
      <div aria-hidden className="holo-bg h-[3px]" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <h3 className="font-pixel text-[10px] uppercase">Top {artists.length} artists</h3>
          <ol className="mt-3 grid grid-cols-4 gap-x-3 gap-y-5 sm:gap-x-5">
            {artists.map((entry, index) => (
              <li key={entry.artist}>
                <a href={`https://www.last.fm/music/${encodeURIComponent(entry.artist)}`} target="_blank" rel="noreferrer" className="group block">
                  <div
                    className="relative aspect-square border border-ink bg-ink/10 bg-cover bg-center transition-transform group-hover:-translate-y-1"
                    style={entry.art ? { backgroundImage: `url(${entry.art})` } : undefined}
                  >
                    <span className="absolute left-0 top-0 bg-ink px-1.5 py-0.5 font-pixel text-[9px] text-paper">{index + 1}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[14px] font-semibold leading-tight group-hover:underline">{entry.artist}</p>
                  <div className="mt-1.5 h-[3px] bg-ink/10">
                    <div className="holo-bg h-full" style={{ width: `${Math.max(10, (entry.plays / max) * 100)}%` }} />
                  </div>
                  <p className="mt-1 font-pixel text-[8px] uppercase text-graphite">
                    {entry.plays} {entry.plays === 1 ? "play" : "plays"}
                  </p>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="font-pixel text-[10px] uppercase">Recently played</h3>
          <ol className="mt-3 max-h-[360px] divide-y divide-ink/15 overflow-y-auto border-y-2 border-ink [scrollbar-width:thin] lg:max-h-[440px]">
            {tracks.map((track, index) => (
              <li key={`${track.track}-${track.playedAt ?? "now"}-${index}`} className="flex items-center gap-3 py-2 pr-2">
                <span className="w-6 flex-none text-right font-pixel text-[9px] text-graphite">{index + 1}</span>
                <div
                  className="h-9 w-9 flex-none border border-ink/30 bg-ink/10 bg-cover bg-center"
                  style={track.albumArt ? { backgroundImage: `url(${track.albumArt})` } : undefined}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold leading-tight">{track.track}</p>
                  <p className="truncate text-[13px] italic text-graphite">{track.artist}</p>
                </div>
                {track.isPlaying ? (
                  <span className="flex flex-none items-end gap-[2px]" aria-label="Now playing">
                    {[10, 14, 8].map((height, bar) => (
                      <span key={bar} className="eq-bar w-[3px] bg-vice-pink" style={{ height, animationDelay: `${bar * 0.15}s` }} />
                    ))}
                  </span>
                ) : (
                  <span className="flex-none font-pixel text-[9px] uppercase text-graphite">{playedOn(track.playedAt)}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
