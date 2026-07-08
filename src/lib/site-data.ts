export const CONTACT = {
  whatsapp: "https://wa.me/21624483600",
  whatsappNumber: "+216 24 483 600",
  maps: "https://maps.app.goo.gl/7EnNBAMpAB87TkTu5",
  mapsEmbed:
    "https://www.google.com/maps?q=Crab+%26+Chips+Tunisia&output=embed",
  instagram: "https://www.instagram.com/crab.and.chips/",
  instagramFollowers: null as number | null,
  rating: 4.7,
  reviewCount: 142,
};

export const waMessage = (msg: string) =>
  `${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

export type MenuItem = {
  name: string;
  ar?: string;
  desc?: string;
  price: number;
};

export type MenuCategory = { id: string; label: string; items: MenuItem[] };

export const MENU: MenuCategory[] = [
  {
    id: "entrees-chaudes",
    label: "Entrées Chaudes",
    items: [
      { name: "Brik thon", ar: "بريك تن", price: 6 },
      { name: "Brik fruits de mer", ar: "بريك بغلال البحر", price: 7.5 },
      { name: "Tchich fruits de mer", ar: "تشيش بغلال البحر", price: 12 },
      { name: "Bisque de crabes et de crevettes", ar: "بيسك سلطعون وجمبري", price: 12 },
      { name: "Chorba fruits de mer", price: 24 },
    ],
  },
  {
    id: "entrees-froides",
    label: "Entrées Froides et Salades",
    items: [
      { name: "Salade de crevettes sautées", ar: "سلطة جمبري", desc: "Mesclun de salade, crevettes sautées, fromage, betteraves, graines de chia", price: 26 },
      { name: "Salade César aux crevettes panées", ar: "سلطة سيزار بالجمبري", desc: "Mesclun de salade, crevettes panées, fromage, croûtons, sauce César", price: 28 },
      { name: "Carpaccio poulpe", ar: "كارباتشيو الأخطبوط", price: 32 },
      { name: "Salade Océana", ar: "سلطة غلال البحر", desc: "Sauce du chef, mesclun de salade, fruits de mer, persil, poivrons", price: 32 },
      { name: "Salade poulpe", ar: "سلطة الأخطبوط", desc: "Sauce du chef, mesclun de salade, poulpe, persil, poivrons", price: 45 },
    ],
  },
  {
    id: "box-tapas",
    label: "Box Tapas",
    items: [
      { name: "Box calamars panés", ar: "كالماري ذهبي", desc: "Calamars panés, riz parfumé, sauces, frites", price: 25 },
      { name: "Box fish and chips", ar: "فيليه سمك وشيبس", desc: "Bâtonnets de merlan, riz parfumé, sauces, frites", price: 28 },
      { name: "Box crevettes panées", ar: "جمبري مقرمش", desc: "Crevettes panées, riz parfumé, sauces, frites", price: 28 },
      { name: "Cocotte moules et frites", ar: "كوكوت بلح البحر", price: 32 },
    ],
  },
  {
    id: "grillades",
    label: "Grillades",
    items: [
      { name: "Poisson complet grillé", ar: "سمكة مشوية", price: 29 },
      { name: "Calamars grillés", ar: "كالمار مشوي", price: 38 },
      { name: "Crevettes royales grillées", ar: "جمبري جمبو مشوي", price: 47 },
      { name: "Grillades mixtes", ar: "مشاوي مشكلة", desc: "Calamars, poisson, moules et crevettes", price: 65 },
    ],
  },
  {
    id: "piano-chef",
    label: "Piano du Chef",
    items: [
      { name: "Gratin aux fruits de mer", ar: "جراتان بغلال البحر", price: 38 },
      { name: "Saumon à la crème", ar: "سلمون بالصلصة البيضاء", price: 45 },
      { name: "Crab and Chips", desc: "Crevettes, poisson, pinces de crabes et calamars panés", price: 65 },
      { name: "Symphonie Kerkennaise", ar: "غلال البحر مشوح بالثوم", desc: "Fruits de mer sautés à l'ail", price: 79 },
      { name: "Stal Chi5a Duo", ar: "سطل شيخة", desc: "Crevettes, crabes, moules, seiches façon seafood boil", price: 89 },
      { name: "Sinia BaHar Duo", ar: "صينية البحار", desc: "Dorades, crevettes grillées sautées et panées, calamars panés, crabes et riz basmati", price: 120 },
      { name: "Stal Chi5a Familiale", ar: "سطل شيخة عائلية", desc: "Crevettes, crabes, moules, seiches crémés", price: 159 },
      { name: "Sinia Rais Familiale", ar: "صينية الريس", desc: "Poissons panés, crevettes panées grillées et sautées, crabes et klaya Kerkennaise", price: 220 },
      { name: "Sinia Jazira Duo", ar: "صينية الجزيرة", desc: "Poisson, calamars et crevettes grillés", price: 149 },
      { name: "Sinia Crab & Chips", ar: "صينية رويال", desc: "Royal platter à la demande, poissons panés, crevettes panées grillées et sautées, crabes, langouste 0.5kg et plus, et klaya Kerkennaise", price: 400 },
    ],
  },
  {
    id: "pasta",
    label: "Pasta",
    items: [
      { name: "Pasta Marina", ar: "باستا بغلال البحر", desc: "Spaghetti, sauce tomate, fruits de mer", price: 38 },
      { name: "Paella Del Mare", ar: "بيلا بغلال البحر", desc: "Riz basmati, fruits de mer", price: 38 },
      { name: "Pasta Boutargue", desc: "Tagliatelles, seiche et boutargue", price: 43 },
      { name: "Pasta Rosa", ar: "باستا سلمون وجمبري", desc: "Pasta, sauce rosée, chair de crabe, saumon et crevettes", price: 47 },
    ],
  },
  {
    id: "pizzas-classiques",
    label: "Pizzas Classiques",
    items: [
      { name: "Margherita", desc: "Sauce tomate, mozzarella, tomates séchées, huile d'olive", price: 17 },
      { name: "Végétarienne", desc: "Sauce tomate, mozzarella, légumes sautés, roquette, champignons", price: 19 },
      { name: "Sicilienne", desc: "Sauce tomate, mozzarella, anchois, citron, tomates séchées, oignons", price: 20 },
      { name: "Pepperoni", desc: "Sauce tomate, mozzarella, pepperoni", price: 20 },
      { name: "Altuno", desc: "Sauce tomate, mozzarella, thon, câpre, oignons", price: 20 },
      { name: "Suprême", desc: "Sauce au choix, mozzarella, suprême poulet, champignon", price: 23 },
      { name: "Picante", desc: "Sauce tomate, poivrons, mozzarella, huile piquante, chorizo", price: 23 },
      { name: "5 Fromages", desc: "Sauce blanche, gruyère, fromage bleu, parmesan, mozzarella, pistaches, gouda", price: 28 },
      { name: "Bresaola", desc: "Sauce tomate, mozzarella, bresaola, tomates séchées", price: 28 },
      { name: "Mexicano", desc: "Sauce tomate, mozzarella, viande hachée, poivrons", price: 31 },
    ],
  },
  {
    id: "pizzas-specialites",
    label: "Pizzas Spécialités",
    items: [
      { name: "Crevetta", desc: "Sauce blanche, crevettes, champignons, gruyère", price: 29 },
      { name: "L'océan", desc: "Sauce tomate, mozzarella, seiche, calamars, crevettes, moules", price: 32 },
      { name: "Kerkennaise", desc: "Sauce maison, klaya aux fruits de mer", price: 42 },
      { name: "L'octopus", desc: "Sauce pesto, mozzarella, burrata, poulpe", price: 45 },
      { name: "Pizza Roulette Terre et Mer Familiale", desc: "Crevettes, pepperoni, mélange de 5 fromages, thon", price: 85 },
      { name: "Crab and Chips Familiale", desc: "Sauce tomate, fruits de mer, klaya Kerkennaise", price: 99 },
    ],
  },
  {
    id: "boissons",
    label: "Boissons et Desserts",
    items: [
      { name: "Eau minérale", price: 3 },
      { name: "Boisson gazeuse en canette", price: 3.5 },
      { name: "Jus", price: 5 },
      { name: "Parfait amande", price: 12 },
      { name: "Parfait citron", price: 12 },
      { name: "Sorbet citron", desc: "Deux boules de glace", price: 7 },
    ],
  },
];

export const REVIEWS = [
  {
    name: "Amir Abdelmalek",
    meta: "1 avis · avis modifié il y a 9 mois",
    text: "Expérience vraiment délicieuse, l'une des meilleures expériences de fruits de mer vécues. Goût merveilleux et élégant. Remerciements au personnel pour leurs belles manières. Un parking gratuit est disponible sur place.",
    food: 5, service: 5, ambiance: 5,
  },
  {
    name: "Triter Oussema",
    meta: "6 avis · il y a 6 mois",
    text: "L'une des meilleures adresses de fruits de mer à Tunis, l'un des meilleurs services clients.",
    food: 5, service: 5, ambiance: 5,
  },
  {
    name: "Fedy B. Yedder",
    meta: "3 avis · 5 photos · il y a 8 mois",
    text: "Excellente qualité et excellent service, cela en vaut la peine. Dégusté sur place.",
    food: 5, service: 5, ambiance: 5,
  },
];

export const SERVICES = [
  "Retrait sans contact",
  "Livraison",
  "Service au volant",
  "À emporter",
  "Sur place",
  "Parking gratuit",
];
