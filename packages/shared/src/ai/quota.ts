export const FREE_SCANS_PER_DAY = 3;

export type ScanQuota = {
  base: number;
  used: number;
  adsWatched: number;
  remaining: number;
};

export function computeScanQuota(used: number, adsWatched: number): ScanQuota {
  const remaining = FREE_SCANS_PER_DAY + adsWatched - used;
  return {
    base: FREE_SCANS_PER_DAY,
    used,
    adsWatched,
    remaining: Math.max(0, remaining),
  };
}
