import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "@/components/site/Loading";
import { Navbar } from "@/components/site/Navbar";
import { FloatingCta } from "@/components/site/FloatingCta";
import { Hero } from "@/components/site/Hero";
import { BestSellers } from "@/components/site/BestSellers";
import { MenuSection } from "@/components/site/MenuSection";
import { Marquee } from "@/components/site/Marquee";
import { About } from "@/components/site/About";
import { Reviews } from "@/components/site/Reviews";
import { Faq } from "@/components/site/Faq";
import { Location } from "@/components/site/Location";
import { CtaFinal } from "@/components/site/CtaFinal";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crab & Chips — Fruits de mer, grillades, pasta & pizza en Tunisie" },
      {
        name: "description",
        content:
          "Crab & Chips, maison marine en Tunisie : fruits de mer frais, grillades au feu, pasta et pizzas généreuses. Commandez sur WhatsApp.",
      },
      { property: "og:title", content: "Crab & Chips — La mer, servie généreuse" },
      {
        property: "og:description",
        content:
          "Fruits de mer, grillades, pasta et pizzas — plateaux généreux et spécialités Kerkennaises.",
      },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Loading />
      <Navbar />
      <FloatingCta />
      <main>
        <Hero />
        <BestSellers />
        <MenuSection />
        <Marquee />
        <About />
        <Reviews />
        <Faq />
        <Location />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}
