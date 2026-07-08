import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";

export function Loading() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06263B]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={logo}
            alt="Crab & Chips"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-32 w-32 rounded-full object-cover shadow-[0_0_60px_rgba(10,110,189,0.6)]"
          />
          <motion.div
            className="absolute inset-0 bg-[#0A6EBD]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
