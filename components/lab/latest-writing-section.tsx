import Link from "next/link";
import type { LabWritingItem } from "@/components/lab/types";

type LatestWritingSectionProps = {
  writing: LabWritingItem[];
};

function formatDate(value?: string | null) {
  if (!value) return "Unscheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unscheduled";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(date);
}

export function LatestWritingSection({ writing }: LatestWritingSectionProps) {
  const lead = writing[0];
  const rest = writing.slice(1);

  return (
    <section className="space-y-3 motion-safe:animate-[lab-fade-in_0.58s_ease-out]">
      <div className="border-b border-[#ccbda4] pb-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8f1f1f]">Latest Writing</p>
      </div>

      {!lead ? (
        <div className="rounded-lg border border-dashed border-[#cdbfa6] p-4 text-sm text-[#5d5349]">No writing entries yet.</div>
      ) : (
        <article className="space-y-2 border-b border-[#e8dcc8] pb-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7f7468]">{formatDate(lead.publishedAt)}</p>
          <Link href={`/blog/${lead.slug}`} className="font-serif text-4xl leading-tight text-[#1f1a16] hover:text-[#8f1f1f]">
            {lead.title}
          </Link>
          {lead.excerpt ? <p className="max-w-prose text-sm leading-relaxed text-[#4f443b]">{lead.excerpt}</p> : null}
        </article>
      )}

      {rest.length > 0 ? (
        <ul className="space-y-2">
          {rest.map((post) => (
            <li key={post.id} className="border-b border-[#ece2cf] pb-2 last:border-b-0">
              <Link href={`/blog/${post.slug}`} className="text-base font-semibold text-[#1f1a16] hover:text-[#8f1f1f] hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
