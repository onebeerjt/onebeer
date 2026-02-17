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
      <section className="lab-paper mx-auto w-full max-w-[1140px] rounded-2xl border border-[#ccbda4] bg-[rgba(252,248,240,0.95)] px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <header className="border-b border-[#ccbda4] pb-4 sm:pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f1f1f]">Lab Edition</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">Issue {issueNo}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[#e1d4bf] pt-3">
            <h1 className="font-serif text-3xl leading-none text-[#1f1a16] sm:text-4xl">Bulletin Desk</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">{todayLabel}</p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-7">
            <LiveNowPill liveTrack={data.liveTrack} lastFilm={data.lastFilm} thinking={data.thinking} />
            <TaproomMarqueeCard status={data.status} history={data.statusHistory} />
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-xl border border-[#ccbda4] bg-[rgba(255,253,248,0.82)] p-4 sm:p-5">
              <LatestFilmsSection films={data.films} />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <LatestWritingSection writing={data.writing} />
          </div>

          <div className="lg:col-span-4">
            <OnTapSection items={data.onTap} />
          </div>
        </div>
      </section>
    </div>
  );
}
