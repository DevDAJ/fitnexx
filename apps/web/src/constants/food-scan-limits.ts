/** Daily OCR-based food scans per Fitnexx plan */
export const foodScansPerDay = {
  free: 4,
  proMax: Infinity,
} as const;

export function formatScanLimit(limit: number): string {
  return limit === Infinity ? "Unlimited" : String(limit);
}
