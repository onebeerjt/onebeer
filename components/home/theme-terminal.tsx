import type { HomeData } from "./types";
import { formatLogTimestamp } from "./format";

export default function ThemeTerminal({ data }: { data: HomeData }) {
  const { posts, films, tracks } = data;
  const nowTrack = tracks.find((t) => t.isPlaying) ?? tracks[0];
  const tickerFilm = films[0];
  const tickerPost = posts[0];

  const tickerText = (
    <span className="pr-12 text-[#8b968f]">
      <span className="text-[#3ee089]">●</span> LIVE
      {nowTrack ? (
        <>
          {" "}
          — NOW PLAYING: <span className="text-[#f2efe9]">{nowTrack.track.toUpperCase()}</span> — {nowTrack.artist.toUpperCase()}
        </>
      ) : null}
      {tickerFilm ? (
        <>
          {" "}
          &nbsp;//&nbsp; LATEST FILM: <span className="text-[#f2efe9]">{tickerFilm.title.toUpperCase()}</span> {tickerFilm.rating ?? ""}
        </>
      ) : null}
      {tickerPost ? (
        <>
          {" "}
          &nbsp;//&nbsp; LATEST POST: <span className="text-[#f2efe9]">{tickerPost.title.toUpperCase()}</span>
        </>
      ) : null}
      &nbsp;//&nbsp;
    </span>
  );

  const barHeights = [14, 26, 10, 34, 18, 30, 12, 36, 20, 16, 28, 22];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#182420] bg-[#060a08] text-[#c9d1c9]" style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" }}>
      <div className="a-scan pointer-events-none absolute inset-x-0 top-0 z-[5] h-[110px]" style={{ animationDuration: "6s", background: "linear-gradient(180deg, rgba(62,224,137,0) 0%, rgba(62,224,137,0.08) 50%, rgba(62,224,137,0) 100%)" }} />

      <div className="relative z-[2] flex h-11 flex-none items-center gap-2 border-b border-[#1a2420] bg-[#0d1210] px-5">
        <span className="h-[11px] w-[11px] flex-none rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] flex-none rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] flex-none rounded-full bg-[#28c840]" />
        <div className="flex-1 text-center text-[13px] text-[#5c6b64]">jt@onebeer — pulse.sh — live</div>
      </div>

      <div className="relative z-[2] flex h-10 flex-none items-center overflow-hidden border-b border-[#16211c] bg-[#0a0e0c]">
        <div className="a-marquee flex whitespace-nowrap text-[13px] tracking-[0.04em]" style={{ animationDuration: "24s" }}>
          {tickerText}
          {tickerText}
        </div>
      </div>

      <div className="relative z-[2] flex flex-col gap-7 px-6 py-9 text-[15px] leading-[1.7] sm:px-10">
        <div className="flex items-center gap-2 text-[#3ee089]">
          <span>jt@onebeer</span>
          <span className="text-[#5c6b64]">~</span>
          <span>% ./pulse --watch --live</span>
          <span className="a-blink inline-block h-[16px] w-[8px] bg-[#3ee089]" style={{ animationDuration: "1s" }} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[#5c6b64]"># live signal</div>
          <div className="flex items-center gap-5 border border-[#182420] bg-[#0d1210] p-5" style={{ boxShadow: "0 0 32px rgba(62,224,137,0.08)" }}>
            <span className="relative inline-flex h-[14px] w-[14px] flex-none">
              <span className="a-radar absolute inset-0 rounded-full border border-[#3ee089]" style={{ animationDuration: "2.4s" }} />
              <span className="a-radar absolute inset-0 rounded-full border border-[#3ee089]" style={{ animationDuration: "2.4s", animationDelay: "0.8s" }} />
              <span className="a-radar absolute inset-0 rounded-full border border-[#3ee089]" style={{ animationDuration: "2.4s", animationDelay: "1.6s" }} />
              <span className="relative h-[14px] w-[14px] rounded-full bg-[#3ee089]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#8fffc4]">now playing</div>
              {nowTrack ? (
                <>
                  <div className="truncate text-[20px] text-[#f2efe9]">{nowTrack.track}</div>
                  <div className="text-[14px] text-[#8b968f]">{nowTrack.artist}</div>
                </>
              ) : (
                <div className="text-[15px] text-[#8b968f]">No signal yet</div>
              )}
            </div>
            <div className="ml-auto flex h-9 flex-none items-end gap-1">
              {barHeights.map((h, i) => (
                <div key={i} className="a-bar w-[5px] bg-[#3ee089]" style={{ height: h, animationDuration: "1.1s", animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </div>
        </div>

        {films.length > 0 ? (
          <div className="flex flex-col gap-3.5 border-t border-dashed border-[#16211c] pt-6">
            <div className="text-[#3ee089]">
              jt@onebeer <span className="text-[#5c6b64]">~</span> % <span className="text-[#e8ece9]">tail -f films.log</span>
            </div>
            {films.slice(0, 6).map((film, i) => (
              <div key={`${film.letterboxdUrl}-${i}`} className="a-row-in flex gap-5 text-[#c9d1c9]" style={{ animationDuration: "0.5s", animationDelay: `${0.05 + i * 0.05}s` }}>
                <span className="w-[168px] flex-none text-[#5c6b64]">{formatLogTimestamp(film.watchedAt)}</span>
                <span className="w-[88px] flex-none text-[#ffb454]">{film.rating ?? "-"}</span>
                <span className="truncate">
                  {film.title} {film.year ? <span className="text-[#5c6b64]">({film.year})</span> : null}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {tracks.length > 0 ? (
          <div className="flex flex-col gap-3.5 border-t border-dashed border-[#16211c] pt-6">
            <div className="text-[#3ee089]">
              jt@onebeer <span className="text-[#5c6b64]">~</span> % <span className="text-[#e8ece9]">tail -f tracks.log</span>
            </div>
            {tracks.slice(0, 6).map((track, i) => (
              <div key={`${track.track}-${i}`} className="a-row-in flex gap-5 text-[#c9d1c9]" style={{ animationDuration: "0.5s", animationDelay: `${0.05 + i * 0.05}s` }}>
                <span className="w-[168px] flex-none text-[#5c6b64]">{formatLogTimestamp(track.playedAt)}</span>
                <span className="w-[200px] flex-none truncate text-[#8b968f]">{track.artist}</span>
                <span className="truncate">{track.track}</span>
              </div>
            ))}
          </div>
        ) : null}

        {posts.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-dashed border-[#16211c] pt-6">
            <div className="text-[#3ee089]">
              jt@onebeer <span className="text-[#5c6b64]">~</span> % <span className="text-[#e8ece9]">cat writing/latest.md</span>
            </div>
            {posts.slice(0, 2).map((post, i) => (
              <div key={post.id} style={{ marginTop: i > 0 ? 10 : 0 }}>
                <div className="text-[16px] text-[#f2efe9]"># {post.title}</div>
                <div className="text-[#8b968f]">{post.excerpt || post.subject || "—"}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-2 border-t border-dashed border-[#16211c] pt-6 text-[#3ee089]">
          <span>jt@onebeer</span>
          <span className="text-[#5c6b64]">~</span>
          <span>%</span>
          <span className="a-blink inline-block h-[17px] w-[9px] translate-y-[1px] bg-[#c9d1c9]" style={{ animationDuration: "1s" }} />
        </div>
      </div>
    </div>
  );
}
