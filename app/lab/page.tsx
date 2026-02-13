import { getLabData } from "@/components/lab/data";
import { LiveNowPill } from "@/components/lab/live-now-pill";
import { TaproomMarqueeCard } from "@/components/lab/taproom-marquee-card";
import { OnTapSection } from "@/components/lab/on-tap-section";
import { LatestWritingSection } from "@/components/lab/latest-writing-section";
import { LatestFilmsSection } from "@/components/lab/latest-films-section";

export const revalidate = 120;

export default async function LabPage() {
  const data = await getLabData();
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(now);
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const issueNo = `${now.getFullYear().toString().slice(-2)}-${String(dayOfYear).padStart(3, "0")}`;

  return (
    <div className="space-y-8 pb-10">
      <LiveNowPill liveTrack={data.liveTrack} lastFilm={data.lastFilm} thinking={data.thinking} />

      <section className="lab-paper mx-auto w-full max-w-[980px] rounded-xl border border-[#ccbda4] bg-[rgba(252,248,240,0.95)] p-5 sm:p-10">
        <header className="mb-10 border-b border-[#ccbda4] pb-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#e1d4bf] pb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f1f1f]">Lab Edition</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">Issue {issueNo}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="mt-1 font-serif text-5xl leading-[0.95] text-[#1f1a16] sm:text-7xl">one beer bulletin</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5e5348]">
                Editorial surface for live signals, sharp notes, and film/music pulse checks.
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">{todayLabel}</p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <TaproomMarqueeCard status={data.status} history={data.statusHistory} />
            <LatestWritingSection writing={data.writing} />
          </div>
          <aside className="space-y-8">
            <OnTapSection items={data.onTap} />
            <LatestFilmsSection films={data.films} />
          </aside>
        </div>
      </section>
    </div>
  );
}
