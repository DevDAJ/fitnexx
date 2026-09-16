export const colors = {
  background: "#080b10",
  surface: "#0d121a",
  card: "#131a24",
  surfaceRaised: "#192231",
  border: "#243043",
  borderStrong: "#344258",
  text: "#f4f7fb",
  textStrong: "#ffffff",
  textMuted: "#b6c0ce",
  textSubtle: "#8491a3",
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  primaryMuted: "#172a48",
  amber: "#fbbf24",
  purple: "#8b5cf6",
  positive: "#34d399",
  negative: "#fb7185",
  warning: "#fbbf24",
} as const;

export type Colors = typeof colors;
