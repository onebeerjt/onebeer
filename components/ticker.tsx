function TickerRow({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex flex-none items-center">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-6 pr-6">
          <span>{item}</span>
          <span className="text-holo-pink">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="ticker mt-3 flex items-stretch overflow-hidden border-2 border-ink bg-ink font-pixel text-[11px] uppercase text-paper">
      <span className="holo-bg relative z-10 flex flex-none items-center gap-2 border-r-2 border-ink px-3 text-ink">
        <span className="blink" aria-hidden>
          ●
        </span>
        Live
      </span>
      <div className="flex-1 overflow-hidden py-2">
        <div className="ticker-track flex w-max">
          <TickerRow items={items} />
          <TickerRow items={items} hidden />
        </div>
      </div>
    </div>
  );
}
