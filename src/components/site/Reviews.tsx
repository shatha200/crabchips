import { motion } from "framer-motion";
import { REVIEWS, CONTACT } from "@/lib/site-data";
import { Stars, StarsDark } from "./Stars";

function maskName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1) + "***";
  return parts[0] + " " + parts.slice(1).map((p) => p[0] + ".").join(" ");
}

export function Reviews() {
  return (
    <section id="reviews" className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A6EBD]">
            Avis Clients
          </div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase text-[#06263B] sm:text-5xl">
            Ils en parlent
          </h2>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5">
            <Stars rating={CONTACT.rating} size={18} />
            <span className="font-display text-lg font-black text-[#06263B]">{CONTACT.rating}</span>
            <span className="text-sm text-slate-500">/ 5 · {CONTACT.reviewCount} avis Google</span>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${i % 2 === 1 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-xl rounded-3xl p-6 shadow-sm ${
                  i % 2 === 1
                    ? "rounded-br-md bg-[#0A6EBD] text-white"
                    : "rounded-bl-md border border-slate-200 bg-slate-50 text-[#06263B]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-display font-black">{r.name}</div>
                    <div className={`text-xs ${i % 2 === 1 ? "text-white/70" : "text-slate-500"}`}>
                      {r.meta}
                    </div>
                  </div>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${i % 2 === 1 ? "text-white/95" : "text-slate-700"}`}>
                  {r.text}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  {[
                    ["Cuisine", r.food],
                    ["Service", r.service],
                    ["Ambiance", r.ambiance],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex flex-col gap-1">
                      <span className={i % 2 === 1 ? "text-white/70" : "text-slate-500"}>{k}</span>
                      {i % 2 === 1 ? <Stars rating={v as number} size={12} /> : <StarsDark rating={v as number} size={12} />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
