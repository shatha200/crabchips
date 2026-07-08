import { motion } from "framer-motion";
import { Instagram, MessageCircle, MapPin, Star, Flame, Utensils } from "lucide-react";
import { CONTACT } from "@/lib/site-data";
import { Stars } from "./Stars";
import hero from "@/assets/hero.jpg";
import { useEffect, useState } from "react";

function Count({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{v.toFixed(decimals)}{suffix}</span>;
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#06263B]">
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img src={hero} alt="Crab & Chips" className="h-full w-full object-cover opacity-70" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#06263B]/70 via-[#06263B]/60 to-[#06263B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06263B]/80 via-transparent to-[#06263B]/40" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
        >
          <Stars rating={CONTACT.rating} size={15} />
          <span className="text-xs text-white/80">
            {CONTACT.rating}/5 · {CONTACT.reviewCount} avis Google
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-6 max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-white text-glow sm:text-7xl md:text-8xl"
        >
          La Mer,<br/>
          <span className="text-[#7CBDEB]">Servie Généreuse.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Fruits de mer frais, grillades au feu, pasta et pizzas généreuses — une maison marine
          où la Kerkennaise rencontre le feu et l'huile d'olive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn-primary">
            <MessageCircle size={18} /> Commander sur WhatsApp
          </a>
          <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="btn-outline">
            <MapPin size={18} /> Itinéraire
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="grid h-12 w-12 place-items-center rounded-xl border border-white/30 text-white transition hover:bg-white/10"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4 text-center"
        >
          <div>
            <Star className="mx-auto text-[#7CBDEB]" size={22} strokeWidth={2.2} />
            <div className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">
              <Count to={CONTACT.reviewCount} />+
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/60">Avis</div>
          </div>
          <div>
            <Flame className="mx-auto text-[#7CBDEB]" size={22} strokeWidth={2.2} />
            <div className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">
              <Count to={CONTACT.rating} decimals={1} />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/60">Note Google</div>
          </div>
          <div>
            <Utensils className="mx-auto text-[#7CBDEB]" size={22} strokeWidth={2.2} />
            <div className="mt-2 font-display text-sm font-black uppercase leading-tight text-white sm:text-base">
              Fruits de Mer<br/>Grillades &amp; Pasta
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-white/60">Notre cuisine</div>
          </div>
        </motion.div>
      </div>

      {/* Wave transition */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-32 pointer-events-none">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="waveGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0A6EBD" stopOpacity="0"/>
              <stop offset="60%" stopColor="#0A6EBD" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path
            d="M0,90 C240,140 480,20 720,60 C960,100 1200,140 1440,80 L1440,160 L0,160 Z"
            fill="url(#waveGrad)"
          />
        </svg>
      </div>
    </section>
  );
}
