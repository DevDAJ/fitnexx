export const colors = {
  background: "#0a0a0a",
  surface: "#111111",
  card: "#161616",
  border: "#222222",
  borderStrong: "#2a2a2a",
  text: "#e5e5e5",
  textStrong: "#ffffff",
  textMuted: "#888888",
  textSubtle: "#666666",
  primary: "#3b82f6",
  primaryHover: "#2f6fe0",
  amber: "#fbbf24",
  purple: "#8b5cf6",
  positive: "#22c55e",
  negative: "#ef4444",
  warning: "#f59e0b",
} as const;

export type Colors = typeof colors;
