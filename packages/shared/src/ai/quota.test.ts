import { test, expect } from "bun:test";
import { computeScanQuota, FREE_SCANS_PER_DAY } from "./quota";

test("quota starts at free tier and never goes below zero", () => {
  expect(FREE_SCANS_PER_DAY).toBe(3);
  expect(computeScanQuota(0, 0)).toEqual({ base: 3, used: 0, adsWatched: 0, remaining: 3 });
  expect(computeScanQuota(5, 0).remaining).toBe(0);
});

test("each watched ad adds one scan", () => {
  const q = computeScanQuota(3, 2);
  expect(q.remaining).toBe(2);
  expect(computeScanQuota(3, 1).remaining).toBe(1);
});
