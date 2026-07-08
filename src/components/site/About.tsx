import { motion } from "framer-motion";
import about from "@/assets/about.jpg";

const CHIPS = ["Fruits de Mer", "Grillades au Feu de Bois", "Pasta et Pizza", "Traiteur et Sur Place"];

export function About() {
  return (
    <section id="about" className="relative bg-[#06263B] py-20 sm:py-28 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7CBDEB]">
            Notre Histoire
          </div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-tight sm:text-5xl">
            À Propos de<br/><span className="text-[#7CBDEB]">Crab &amp; Chips</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/80">
            Crab &amp; Chips, c'est une maison marine où la pêche du jour rencontre le feu.
            Plateaux généreux de fruits de mer, grillades à l'huile d'olive, spécialités
            Kerkennaises et pasta &amp; pizzas signées — nous mettons la mer dans l'assiette,
            avec justesse et passion.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-2 rounded-3xl bg-[#0A6EBD] opacity-30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#0A6EBD] shadow-[0_0_60px_-10px_rgba(10,110,189,0.6)]">
            <img src={about} alt="Crab & Chips" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
