import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { CONTACT } from "@/lib/site-data";

const LINKS = [
  { href: "#best-sellers", label: "Best Sellers" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "À Propos" },
  { href: "#reviews", label: "Avis" },
  { href: "#location", label: "Localisation" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#06263B]/85 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Crab & Chips" className="h-11 w-11 rounded-full object-cover" />
          <span className="hidden font-display text-lg font-black tracking-tight text-white sm:block">
            Crab &amp; Chips
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/85 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-primary hidden sm:inline-flex"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#06263B]/95 backdrop-blur md:hidden">
          <div className="flex flex-col p-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-white/90 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-2"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
