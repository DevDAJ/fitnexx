import { expect, test } from "bun:test";
import { computeStreak } from "./streak";

test("counts consecutive days ending today", () => {
  const now = new Date("2026-09-05T10:00:00");
  const dates = ["2026-09-03", "2026-09-04", "2026-09-05"];
  const s = computeStreak(dates, now);
  expect(s.days).toBe(3);
  expect(s.activeToday).toBe(true);
});

test("streak survives until yesterday does not break", () => {
  const now = new Date("2026-09-05T10:00:00");
  const dates = ["2026-09-03", "2026-09-04"];
  const s = computeStreak(dates, now);
  expect(s.days).toBe(2);
  expect(s.activeToday).toBe(false);
});

test("a gap resets the streak", () => {
  const now = new Date("2026-09-05T10:00:00");
  const dates = ["2026-09-02", "2026-09-04", "2026-09-05"];
  const s = computeStreak(dates, now);
  expect(s.days).toBe(2);
});

test("no workouts means zero", () => {
  const now = new Date("2026-09-05T10:00:00");
  const s = computeStreak([], now);
  expect(s.days).toBe(0);
});
