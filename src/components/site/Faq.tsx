import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CONTACT } from "@/lib/site-data";

const QA = [
  {
    q: "Peut-on commander par WhatsApp ?",
    a: () => (
      <>
        Oui. Écrivez-nous directement sur{" "}
        <a className="text-[#0A6EBD] underline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
          WhatsApp
        </a>{" "}
        pour passer commande ou réserver.
      </>
    ),
  },
  {
    q: "Crab & Chips est-il présent sur les réseaux sociaux ?",
    a: () => (
      <>
        Oui, retrouvez-nous sur{" "}
        <a className="text-[#0A6EBD] underline" href={CONTACT.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        .
      </>
    ),
  },
  {
    q: "Que propose la carte ?",
    a: () => <>Fruits de mer, grillades, pasta et pizzas — voir la carte complète dans la section Menu.</>,
  },
  {
    q: "Le restaurant propose-t-il un parking ?",
    a: () => <>Oui, un parking gratuit est disponible sur place selon les avis clients.</>,
  },
  {
    q: "Quels sont les modes de service disponibles ?",
    a: () => <>Retrait sans contact, livraison, service au volant, à emporter et sur place.</>,
  },
  {
    q: "Où se trouve Crab & Chips ?",
    a: () => (
      <>
        Adresse exacte en cours de confirmation. Un lien{" "}
        <a className="text-[#0A6EBD] underline" href={CONTACT.maps} target="_blank" rel="noreferrer">
          Google Maps
        </a>{" "}
        réel est disponible pour s'y rendre.
      </>
    ),
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A6EBD]">FAQ</div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase text-[#06263B] sm:text-5xl">
            Questions Fréquentes
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {QA.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-display font-black text-[#06263B]">{item.q}</span>
                <ChevronDown
                  className={`shrink-0 text-[#0A6EBD] transition-transform ${open === i ? "rotate-180" : ""}`}
                  size={20}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.a()}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
