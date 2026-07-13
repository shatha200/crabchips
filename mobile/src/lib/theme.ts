// Design tokens for the app. Two palettes (light/dark) built around the
// required brand colors: warm orange primary, green success, red error.

export const brand = {
  orange: "#FF6B35",
  orangeDark: "#E85A2A",
  orangeLight: "#FFE1D3",
  green: "#2E7D5B",
  greenLight: "#E3F2ED",
  red: "#D64545",
  redLight: "#FBE4E4",
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
  shadow: "rgba(31, 32, 35, 0.08)",
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
  shadow: "rgba(0, 0, 0, 0.4)",
};

export type AppTheme = typeof lightTheme;

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 22, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyBold: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  price: { fontSize: 16, fontWeight: "700" as const },
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
