import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowDownAZ, ArrowUpAZ, MessageCircle } from "lucide-react";
import { MENU, CONTACT, waMessage } from "@/lib/site-data";

export function MenuSection() {
  const [tab, setTab] = useState(MENU[0].id);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none");

  const items = useMemo(() => {
    const cat = MENU.find((c) => c.id === tab)!;
    let list = cat.items.filter((it) =>
      it.name.toLowerCase().includes(q.trim().toLowerCase())
    );
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [tab, q, sort]);

  return (
    <section id="menu" className="relative bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A6EBD]">
            Notre Carte
          </div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase text-[#06263B] sm:text-5xl">
            Menu Complet
          </h2>
        </div>

        {/* Sticky search + filters */}
        <div className="sticky top-16 z-20 mt-10 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un plat"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-[#06263B] placeholder:text-slate-400 focus:border-[#0A6EBD] focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSort(sort === "asc" ? "none" : "asc")}
                className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition ${
                  sort === "asc"
                    ? "border-[#0A6EBD] bg-[#0A6EBD] text-white"
                    : "border-slate-200 bg-white text-[#06263B] hover:border-[#0A6EBD]"
                }`}
              >
                <ArrowDownAZ size={16} /> Prix croissant
              </button>
              <button
                onClick={() => setSort(sort === "desc" ? "none" : "desc")}
                className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition ${
                  sort === "desc"
                    ? "border-[#0A6EBD] bg-[#0A6EBD] text-white"
                    : "border-slate-200 bg-white text-[#06263B] hover:border-[#0A6EBD]"
                }`}
              >
                <ArrowUpAZ size={16} /> Prix décroissant
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:overflow-visible">
          {MENU.map((c) => (
            <button
              key={c.id}
              onClick={() => setTab(c.id)}
              className={`shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                tab === c.id
                  ? "border-[#0A6EBD] bg-[#0A6EBD] text-white shadow"
                  : "border-slate-200 bg-white text-[#06263B] hover:border-[#0A6EBD]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={tab + q + sort}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((it) => (
            <article
              key={it.name}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0A6EBD] hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-black text-[#06263B]">{it.name}</h3>
                  {it.ar && (
                    <div className="mt-1 text-sm text-slate-500" dir="rtl">
                      {it.ar}
                    </div>
                  )}
                </div>
                <div className="shrink-0 rounded-lg bg-[#0A6EBD] px-3 py-1.5 font-display text-sm font-black text-white">
                  {it.price.toFixed(3)} DT
                </div>
              </div>
              {it.desc && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{it.desc}</p>
              )}
              <a
                href={waMessage(`Bonjour, je souhaite commander : ${it.name} (${it.price.toFixed(3)} DT).`)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 self-start"
              >
                <MessageCircle size={16} /> Commander
              </a>
            </article>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucun plat ne correspond à votre recherche.
            </div>
          )}
        </motion.div>

        <div className="mt-10 text-center text-xs text-slate-400">
          Prix en Dinar Tunisien, service compris. Contact&nbsp;: {CONTACT.whatsappNumber}
        </div>
      </div>
    </section>
  );
}
