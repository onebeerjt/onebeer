import Link from "next/link";
import type { LabOnTapItem } from "@/components/lab/types";

type OnTapSectionProps = {
  items: LabOnTapItem[];
};

export function OnTapSection({ items }: OnTapSectionProps) {
  return (
    <section className="space-y-3">
      <div className="border-b border-[#cdbfa6] pb-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8f1f1f]">On Tap</p>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${item.tag}-${item.title}`} className="border-b border-[#e2d7c2] pb-3 last:border-b-0">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6a5f55]">{item.tag}</p>
            <Link href={item.url} className="font-serif text-xl text-[#1f1a16] hover:text-[#8f1f1f] hover:underline">
              {item.title}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-[#4f443b]">{item.commentary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
