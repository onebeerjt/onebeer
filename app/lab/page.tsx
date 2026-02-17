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
    <div className="pb-12 pt-2 sm:pb-16">
      <section className="lab-paper mx-auto w-full max-w-[1120px] rounded-2xl border border-[#ccbda4] bg-[rgba(252,248,240,0.95)] px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <header className="border-b border-[#ccbda4] pb-5 sm:pb-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e1d4bf] pb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f1f1f]">Lab Edition</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">Issue {issueNo}</p>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">{todayLabel}</p>
            <h1 className="font-serif text-5xl leading-[0.96] text-[#1f1a16] sm:text-6xl lg:text-7xl">one beer bulletin</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#5e5348] sm:text-base">
              Clean editorial prototype for live signals, sharp notes, and a film-forward archive experience.
            </p>
          </div>
        </header>

        <div className="mt-6 sm:mt-8">
          <LiveNowPill liveTrack={data.liveTrack} lastFilm={data.lastFilm} thinking={data.thinking} />
        </div>

        <div className="mt-6 grid gap-7 lg:mt-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-7 lg:col-span-7">
            <LatestWritingSection writing={data.writing} />
            <OnTapSection items={data.onTap} />
          </div>
          <aside className="lg:col-span-5">
            <TaproomMarqueeCard status={data.status} history={data.statusHistory} />
          </aside>
        </div>

        <div className="mt-8 border-t border-[#ccbda4] pt-6 sm:mt-10 sm:pt-8">
          <LatestFilmsSection films={data.films} />
        </div>
      </section>
    </div>
  );
}
