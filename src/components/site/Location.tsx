import { useState } from "react";
import { MessageCircle, Instagram, MapPin, Send } from "lucide-react";
import { CONTACT, SERVICES, waMessage } from "@/lib/site-data";

export function Location() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Livraison");
  const [order, setOrder] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour Crab & Chips,%0A%0ANom : ${name}%0ATéléphone : ${phone}%0AType : ${type}%0A%0ACommande :%0A${order}`;
    window.open(`${CONTACT.whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <section id="location" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A6EBD]">
            Nous Trouver
          </div>
          <h2 className="mt-3 font-display text-4xl font-black uppercase text-[#06263B] sm:text-5xl">
            Localisation &amp; Contact
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0A6EBD] hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#0A6EBD]/10 text-[#0A6EBD]">
                  <MessageCircle size={22} />
                </div>
                <div className="mt-4 text-xs uppercase tracking-widest text-slate-500">WhatsApp</div>
                <div className="mt-1 font-display font-black text-[#06263B]">
                  {CONTACT.whatsappNumber}
                </div>
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0A6EBD] hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#0A6EBD]/10 text-[#0A6EBD]">
                  <Instagram size={22} />
                </div>
                <div className="mt-4 text-xs uppercase tracking-widest text-slate-500">Instagram</div>
                <div className="mt-1 font-display font-black text-[#06263B]">@crab.and.chips</div>
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs uppercase tracking-widest text-slate-500">Services</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#0A6EBD]/25 bg-[#0A6EBD]/5 px-3 py-1.5 text-xs font-semibold text-[#06263B]"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                Adresse à confirmer — utilisez la carte ci-dessous pour l'itinéraire.
              </div>
            </div>

            <a
              href={CONTACT.maps}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[#0A6EBD] hover:shadow-lg"
            >
              <iframe
                title="Crab & Chips"
                src={CONTACT.mapsEmbed}
                loading="lazy"
                className="h-64 w-full border-0"
              />
            </a>
          </div>

          {/* Right column: form */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
            <h3 className="font-display text-2xl font-black uppercase text-[#06263B]">
              Composez votre commande
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Remplissez le formulaire, votre message s'ouvre directement dans WhatsApp.
            </p>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:border-[#0A6EBD] focus:outline-none"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone"
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:border-[#0A6EBD] focus:outline-none"
                />
              </div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:border-[#0A6EBD] focus:outline-none"
              >
                <option>Livraison</option>
                <option>À emporter</option>
                <option>Sur place</option>
                <option>Service au volant</option>
                <option>Retrait sans contact</option>
              </select>
              <textarea
                required
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Détaillez votre commande (plats, quantités, remarques)"
                rows={5}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm focus:border-[#0A6EBD] focus:outline-none"
              />
              <button type="submit" className="btn-primary self-start">
                <Send size={18} /> Envoyer sur WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
