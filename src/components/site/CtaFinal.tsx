import { motion } from "framer-motion";
import { MessageCircle, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/site-data";
import bg from "@/assets/cta-bg.jpg";

export function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-[#06263B]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06263B]/70 via-[#0A6EBD]/30 to-[#06263B]/95" />

      {/* Ripple sweep */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: "100%", opacity: [0, 0.4, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-2xl"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl font-black uppercase leading-tight text-white text-glow sm:text-6xl md:text-7xl"
        >
          Venez goûter<br/>la mer.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-white/80"
        >
          Fraîcheur, générosité, feu et huile d'olive — la table est prête.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn-primary">
            <MessageCircle size={18} /> Commander maintenant
          </a>
          <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="btn-outline">
            <MapPin size={18} /> Itinéraire
          </a>
        </motion.div>
      </div>
    </section>
  );
}
