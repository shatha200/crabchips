// Design tokens for the app.
//
// Identity: Crab & Chips is a Tunisian seafood-and-grill spot — this isn't a
// generic food-app palette, it's built around that. Brand colors below are
// mandated by the client brief (warm orange primary, dark gray text, green
// success, red error) and are never altered. The one deliberate addition is
// `teal` — a deep sea-glass accent used sparingly for ratings, section
// eyebrows, and the scalloped "shell edge" signature motif — a nod to
// seafood-by-the-sea that stays out of the way of the mandated palette's
// actual jobs (CTAs stay orange, success stays green, errors stay red).

export const brand = {
  orange: "#FF6B35",
  orangeDark: "#E85A2A",
  orangeLight: "#FFE1D3",
  green: "#2E7D5B",
  greenLight: "#E3F2ED",
  red: "#D64545",
  redLight: "#FBE4E4",
  teal: "#0E7C86",
  tealLight: "#DFF0EF",
};

export const lightTheme = {
  mode: "light" as const,
  background: "#FFFFFF",
  surface: "#F7F7F8",
  card: "#FFFFFF",
  border: "#EDEDEF",
  textPrimary: "#1F2023", // dark gray
  textSecondary: "#6B6D75",
  primary: brand.orange,
  primaryPressed: brand.orangeDark,
  onPrimary: "#FFFFFF",
  success: brand.green,
  successBg: brand.greenLight,
  error: brand.red,
  errorBg: brand.redLight,
  accent: brand.teal,
  accentBg: brand.tealLight,
  shadow: "rgba(31, 32, 35, 0.10)",
};

export const darkTheme = {
  mode: "dark" as const,
  background: "#131315",
  surface: "#1C1C1F",
  card: "#212226",
  border: "#2C2D31",
  textPrimary: "#F5F5F6",
  textSecondary: "#9A9CA3",
  primary: brand.orange,
  primaryPressed: "#FF8259",
  onPrimary: "#1A1A1A",
  success: "#4CAF87",
  successBg: "#173226",
  error: "#E77373",
  errorBg: "#341C1C",
  accent: "#4FBFC4",
  accentBg: "#173537",
  shadow: "rgba(0, 0, 0, 0.4)",
};

export type AppTheme = typeof lightTheme;

export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// Archivo (expanded/black weights) carries headings — bold, condensed,
// signage-like energy that suits a seafood-and-grill spot without tipping
// into the soft-serif-on-cream look most food apps default to. Manrope
// handles body/UI text where legibility at small sizes matters more than
// personality.
export const fonts = {
  display: "Archivo_800ExtraBold",
  displaySemiBold: "Archivo_700Bold",
  body: "Manrope_400Regular",
  bodyMedium: "Manrope_500Medium",
  bodySemiBold: "Manrope_600SemiBold",
  bodyBold: "Manrope_700Bold",
};

export const typography = {
  h1: { fontSize: 30, fontFamily: fonts.display, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontFamily: fonts.displaySemiBold, letterSpacing: -0.2 },
  h3: { fontSize: 17, fontFamily: fonts.bodyBold },
  body: { fontSize: 15, fontFamily: fonts.body },
  bodyBold: { fontSize: 15, fontFamily: fonts.bodySemiBold },
  caption: { fontSize: 13, fontFamily: fonts.body },
  price: { fontSize: 16, fontFamily: fonts.bodyBold },
  // Small uppercase label used above section titles (e.g. "À LA UNE" above
  // "Nos coups de cœur") — a structural device that gives sections a
  // consistent rhythm instead of plain unadorned headers.
  eyebrow: { fontSize: 12, fontFamily: fonts.bodyBold, letterSpacing: 1.2 },
};

// Elevation scale — three tiers instead of ad hoc shadow values scattered
// per component, so card "weight" is consistent across the app.
export const elevation = {
  low: { shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  medium: { shadowOpacity: 1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  high: { shadowOpacity: 1, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 6 },
};

export const motion = {
  fast: 150,
  base: 220,
  slow: 380,
};

// Order status → color + human label, used across customer + restaurant screens.
export const orderStatusMeta: Record<
  string,
  { label: string; color: keyof typeof brand | "textSecondary" }
> = {
  pending: { label: "En attente", color: "orange" },
  accepted: { label: "Acceptée", color: "orange" },
  preparing: { label: "En préparation", color: "orange" },
  ready: { label: "Prête", color: "green" },
  out_for_delivery: { label: "En livraison", color: "orange" },
  delivered: { label: "Livrée", color: "green" },
  rejected: { label: "Refusée", color: "red" },
  cancelled: { label: "Annulée", color: "red" },
};
