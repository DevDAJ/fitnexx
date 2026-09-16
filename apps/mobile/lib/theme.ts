export const colors = {
  background: "#080b10",
  surface: "#0d121a",
  surfaceRaised: "#131a24",
  surfacePressed: "#192231",
  border: "#243043",
  borderStrong: "#344258",
  text: "#f4f7fb",
  textSecondary: "#b6c0ce",
  textMuted: "#8491a3",
  brand: "#3b82f6",
  brandPressed: "#2563eb",
  brandMuted: "#172a48",
  onBrand: "#07111f",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#fb7185",
  dangerSolid: "#e11d48",
  overlay: "rgba(2, 6, 12, 0.76)",
  shadow: "#000000",
  transparent: "transparent",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 20,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
} as const;

export const theme = { colors, spacing, radii, fontSizes } as const;
