import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/site-data";
import d1a from "@/assets/dish1-after.jpg";
import d1b from "@/assets/dish1-before.jpg";
import d2a from "@/assets/dish2-after.jpg";
import d2b from "@/assets/dish2-before.jpg";
import d3a from "@/assets/dish3-after.jpg";
import d3b from "@/assets/dish3-before.jpg";

const DISHES = [
  { before: d1b, after: d1a, alt: "Plateau Crab & Chips" },
  { before: d2b, after: d2a, alt: "Grillades mixtes" },
  { before: d3b, after: d3a, alt: "Stal Chi5a Duo" },
];

function Compare({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pct, setPct] = useState(50);
  const [hintVisible, setHintVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl bg-[#06263B] shadow-xl"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        move(e.clientX);
        setHintVisible(false);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after} alt={`${alt} après`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <img
          src={before}
          alt={`${alt} avant`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${100 / (pct / 100 || 0.001)}%`, maxWidth: "none" }}
        />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
        Avant
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-[#0A6EBD] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[#0A6EBD] shadow-[0_0_15px_rgba(10,110,189,0.8)]"
        style={{ left: `${pct}%` }}
      >
        <div className="pointer-events-auto absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0A6EBD] text-white shadow-xl">
          <MoveHorizontal size={20} />
        </div>
      </div>

      {hintVisible && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur transition-opacity">
          Faites glisser pour comparer
        </div>
      )}

      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="btn-primary absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <MessageCircle size={18} /> Commander
      </a>
    </div>
  );
}

export function BestSellers() {
  return (
    <section id="best-sellers" className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A6EBD]">
            Nos Signatures
          </div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase text-[#06263B] sm:text-5xl">
            Plongez dans nos<br/>Meilleures Assiettes
          </h2>
          <p className="mt-4 text-slate-600">
            Glissez la poignée pour découvrir la différence — la mer, sublimée.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
            >
              <Compare {...d} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
