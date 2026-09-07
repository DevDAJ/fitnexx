import { describe, expect, test } from "bun:test";
import type { Workout } from "../types";
import { detectSessionVolumePr } from "./prDetection";

const base = (id: string, totalVolume: number, date: string): Workout => ({
  id,
  date,
  title: "w",
  exercises: [],
  duration: 0,
  totalVolume,
});

describe("detectSessionVolumePr", () => {
  test("returns true when beating the best prior session", () => {
    const prior = [
      base("w1", 1000, "2026-01-01"),
      base("w2", 6000, "2026-01-05"),
    ];
    expect(detectSessionVolumePr(prior, base("w3", 6500, "2026-01-08"))).toBe(
      true,
    );
  });

  test("returns false when not beating the best prior session", () => {
    const prior = [
      base("w1", 1000, "2026-01-01"),
      base("w2", 6000, "2026-01-05"),
    ];
    expect(detectSessionVolumePr(prior, base("w3", 6000, "2026-01-08"))).toBe(
      false,
    );
  });

  test("returns false for an empty session volume", () => {
    expect(
      detectSessionVolumePr(
        [base("w1", 5000, "2026-01-01")],
        base("w2", 0, "2026-01-08"),
      ),
    ).toBe(false);
  });
});
