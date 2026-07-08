const WORDS = ["FRUITS DE MER", "GRILLADES", "PASTA", "PIZZA", "KERKENNAISE"];

export function Marquee() {
  const line = WORDS.join(" • ") + " • ";
  return (
    <div className="relative overflow-hidden bg-[#06263B] py-6" style={{ transform: "skewY(-1.5deg)" }}>
      <div className="flex whitespace-nowrap marquee-track" style={{ transform: "skewY(1.5deg)" }}>
        <div className="flex shrink-0 items-center gap-8 pr-8 font-display text-3xl font-black uppercase tracking-widest text-white sm:text-4xl md:text-5xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={i % 2 === 0 ? "text-white" : "text-[#0A6EBD]"}>
              {line}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 pr-8 font-display text-3xl font-black uppercase tracking-widest text-white sm:text-4xl md:text-5xl" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={i % 2 === 0 ? "text-white" : "text-[#0A6EBD]"}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
