import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { CONTACT, waMessage } from "@/lib/site-data";
import { motion, AnimatePresence } from "framer-motion";

const KEY = "cc_fab_bubble_dismissed";

export function FloatingCta() {
  const [bubble, setBubble] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(KEY);
    if (dismissed) return;
    const onScroll = () => {
      if (window.scrollY > 300) {
        setBubble(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const dismiss = () => {
    setBubble(false);
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, "1");
  };
  return (
    <div className="fixed bottom-5 right-4 z-40 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl bg-white p-4 pr-8 text-sm text-[#06263B] shadow-2xl"
          >
            <button
              onClick={dismiss}
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-[#06263B]/60 hover:bg-slate-100"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
            La pêche du jour vient d'arriver — envie de goûter&nbsp;?
            <span className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href={waMessage("Bonjour Crab & Chips, je souhaite passer commande.")}
        target="_blank"
        rel="noreferrer"
        className="btn-primary relative pulse-ring shadow-2xl"
      >
        <Send size={18} />
        <span className="hidden sm:inline">Envie de Mer</span>
        <span className="sm:hidden">Commander</span>
      </a>
    </div>
  );
}
