import { Reveal } from "@/components/reveal";

export function ChapterCard({
  id,
  number,
  title,
  note
}: {
  id: string;
  number: string;
  title: string;
  note: string;
}) {
  return (
    <section id={id} className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
      <Reveal>
        <p className="font-chapter text-[clamp(64px,12vw,168px)] uppercase leading-[0.85] tracking-[0.02em] text-marquee">
          Chapter {number}
        </p>
      </Reveal>
      <Reveal delay={350}>
        <p className="mt-7 font-criterion text-[clamp(28px,4.4vw,56px)] italic leading-tight text-bone">&ldquo;{title}&rdquo;</p>
      </Reveal>
      <Reveal delay={700}>
        <p className="mt-6 text-[11px] uppercase tracking-[0.42em] text-smoke">{note}</p>
      </Reveal>
    </section>
  );
}
