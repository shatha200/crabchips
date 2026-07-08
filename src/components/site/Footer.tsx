import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/site-data";
import logo from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="bg-[#06263B] py-12 text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <img src={logo} alt="Crab & Chips" className="h-14 w-14 rounded-full object-cover" />
        <div className="font-display text-2xl font-black uppercase text-white">Crab &amp; Chips</div>
        <div className="text-xs uppercase tracking-[0.3em] text-white/50">
          Fast Good · Fresh SeaFood
        </div>
        <div className="flex items-center gap-3">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#0A6EBD] hover:bg-[#0A6EBD]"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#0A6EBD] hover:bg-[#0A6EBD]"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noreferrer"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#0A6EBD] hover:bg-[#0A6EBD]"
            aria-label="Itinéraire"
          >
            <MapPin size={18} />
          </a>
        </div>
        <div className="max-w-md text-xs text-white/50">
          Adresse complète en cours de finalisation — utilisez le lien Google Maps pour vous y rendre.
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 Crab &amp; Chips, tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
