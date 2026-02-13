import { getLabData } from "@/components/lab/data";
import { LiveNowPill } from "@/components/lab/live-now-pill";
import { TaproomMarqueeCard } from "@/components/lab/taproom-marquee-card";
import { OnTapSection } from "@/components/lab/on-tap-section";
import { LatestWritingSection } from "@/components/lab/latest-writing-section";
import { LatestFilmsSection } from "@/components/lab/latest-films-section";

export const revalidate = 120;

export default async function LabPage() {
  const data = await getLabData();

  return (
    <div className="space-y-8 pb-8">
      <LiveNowPill liveTrack={data.liveTrack} lastFilm={data.lastFilm} thinking={data.thinking} />

      <section
        className="rounded-2xl border border-[#cdbfa6] bg-[linear-gradient(to_bottom,rgba(252,247,238,0.98),rgba(247,240,229,0.98))] p-4 sm:p-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.45), transparent 35%), repeating-linear-gradient(0deg, rgba(110,90,70,0.03) 0px, rgba(110,90,70,0.03) 1px, transparent 1px, transparent 18px)"
        }}
      >
        <header className="mb-6 border-b border-[#cdbfa6] pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f1f1f]">Lab Edition</p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#1f1a16] sm:text-5xl">one beer bulletin</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5e5348]">Editorial surface for live signals, sharp notes, and film/music pulse checks.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <TaproomMarqueeCard status={data.status} />
            <LatestWritingSection writing={data.writing} />
          </div>
          <aside className="space-y-6">
            <OnTapSection items={data.onTap} />
            <LatestFilmsSection films={data.films} />
          </aside>
        </div>
      </section>
    </div>
  );
}
