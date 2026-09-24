import type { NowPlayingTrack } from "@/lib/types/content";

function CreditRows({ tracks, hidden }: { tracks: NowPlayingTrack[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex flex-col gap-7 py-7">
      {tracks.map((track, index) => (
        <li key={`${track.track}-${track.artist}-${index}`} className="grid grid-cols-2 items-baseline gap-6 sm:gap-10">
          <span className="text-right font-criterion text-[19px] italic leading-snug text-bone sm:text-[22px]">&ldquo;{track.track}&rdquo;</span>
          <span className="text-[11px] uppercase leading-snug tracking-[0.28em] text-smoke">{track.artist}</span>
        </li>
      ))}
    </ul>
  );
}

export function CreditsRoll({ tracks }: { tracks: NowPlayingTrack[] }) {
  if (tracks.length === 0) {
    return <p className="py-24 text-center text-[12px] tracking-[0.1em] text-smoke">[ no sound recorded ]</p>;
  }

  return (
    <div className="credits-window relative h-[62vh] overflow-hidden">
      <div className="credits-roll">
        <CreditRows tracks={tracks} />
        <CreditRows tracks={tracks} hidden />
      </div>
    </div>
  );
}
