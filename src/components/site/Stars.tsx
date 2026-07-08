import { Star } from "lucide-react";

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-white/25" fill="currentColor" strokeWidth={0} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[#0A6EBD]" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StarsDark({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-slate-200" fill="currentColor" strokeWidth={0} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[#0A6EBD]" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
