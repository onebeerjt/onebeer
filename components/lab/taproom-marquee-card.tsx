import Link from "next/link";
import type { LabStatus } from "@/components/lab/types";

type TaproomMarqueeCardProps = {
  status: LabStatus;
  history: LabStatus[];
};

function isImminentEvent(status: LabStatus) {
  if (status.type !== "event" || !status.startsAtIso) return false;
  const now = Date.now();
  const target = new Date(status.startsAtIso).getTime();
  if (Number.isNaN(target)) return false;
  const diff = target - now;
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

function calendarHref(status: LabStatus) {
  if (!status.time || !status.startsAtIso) return null;
  const params = new URLSearchParams({
    title: status.title,
    subtitle: status.subtitle ?? "",
    location: status.location ?? "",
    start: status.startsAtIso
  });
  return `/api/lab/calendar?${params.toString()}`;
}

export function TaproomMarqueeCard({ status, history }: TaproomMarqueeCardProps) {
  const hasPulse = isImminentEvent(status);
  const addCalendar = calendarHref(status);

  return (
    <section className="rounded-xl border border-[#ccbda4] bg-[rgba(255,253,248,0.85)] p-5 motion-safe:animate-[lab-fade-in_0.5s_ease-out]">
      <div className="mb-4 flex items-center justify-between border-b border-[#e1d4bf] pb-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6a5f55]">Taproom marquee</p>
        <p className="text-sm">
          {status.emoji ?? "🍺"} <span className="text-[#6a5f55]">{status.type}</span>
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-3xl leading-tight text-[#1f1a16] sm:text-4xl">{status.title}</h2>
        {status.subtitle ? <p className="text-sm text-[#4d443b]">{status.subtitle}</p> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#3f372f]">
        {hasPulse ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d7c6ab] bg-[#fff7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7c221e]">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#b71f1f]" aria-hidden />
            Live soon
          </span>
        ) : null}
        {status.time ? <span>{status.time}</span> : null}
        {status.location ? <span>• {status.location}</span> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {status.ctaLabel && status.ctaUrl ? (
          <Link
            href={status.ctaUrl}
            className="rounded-md border border-[#c7b79e] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#2c251f] transition-colors hover:bg-[#f1e7d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f1f]"
          >
            {status.ctaLabel}
          </Link>
        ) : null}
        {addCalendar ? (
          <a
            href={addCalendar}
            className="text-xs font-mono uppercase tracking-[0.14em] text-[#6a5f55] underline decoration-[#b9aa90] underline-offset-4 hover:text-[#8f1f1f]"
          >
            Add to calendar
          </a>
        ) : null}
      </div>

      {history.length > 0 ? (
        <details className="mt-4 rounded-md border border-[#dfd2be] bg-[#fffcf6] p-2">
          <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">
            History (last 5)
          </summary>
          <ul className="mt-2 space-y-2">
            {history.slice(0, 5).map((entry, index) => (
              <li key={`${entry.title}-${index}`} className="border-t border-[#eadfcd] pt-2 first:border-t-0 first:pt-0">
                <p className="text-sm text-[#2e2721]">
                  <span className="mr-1">{entry.emoji ?? "•"}</span>
                  <span className="font-semibold">{entry.title}</span>
                </p>
                {entry.subtitle ? <p className="text-xs text-[#665a4e]">{entry.subtitle}</p> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
