import { describe, expect, test } from "bun:test";
import { FOOD_LABELS, foodInfoAt, macrosForServing } from "./foodDb";

describe("foodDb label table", () => {
  test("matches the model's 101 Food-101 classes", () => {
    expect(FOOD_LABELS.length).toBe(101);
  });

  test("labels are unique", () => {
    expect(new Set(FOOD_LABELS).size).toBe(FOOD_LABELS.length);
  });

  test("index maps back to the same label (model output order alignment)", () => {
    FOOD_LABELS.forEach((label, i) => {
      expect(foodInfoAt(i)?.label).toBe(label);
    });
  });

  test("unknown index returns undefined", () => {
    expect(foodInfoAt(101)).toBeUndefined();
    expect(foodInfoAt(-1)).toBeUndefined();
  });
});

describe("macro table sanity", () => {
  test("every label has plausible per-100g values", () => {
    for (const label of FOOD_LABELS) {
      const info = foodInfoAt(FOOD_LABELS.indexOf(label));
      expect(info).toBeDefined();
      if (!info) continue;
      expect(info.defaultServingG).toBeGreaterThan(0);
      expect(info.kcalPer100).toBeGreaterThan(0);
      expect(info.kcalPer100).toBeLessThanOrEqual(600);
      expect(info.proteinPer100).toBeGreaterThanOrEqual(0);
      expect(info.carbsPer100).toBeGreaterThanOrEqual(0);
      expect(info.fatPer100).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("macrosForServing", () => {
  test("100g equals the per-100g row", () => {
    for (const label of FOOD_LABELS) {
      const info = foodInfoAt(FOOD_LABELS.indexOf(label));
      const at100 = macrosForServing(label, 100);
      if (!info) return;
      expect(at100.calories).toBe(info.kcalPer100);
      expect(at100.protein).toBe(info.proteinPer100);
      expect(at100.carbs).toBe(info.carbsPer100);
      expect(at100.fat).toBe(info.fatPer100);
    }
  });

  test("50g gives exactly half", () => {
    const half = macrosForServing("pizza", 50);
    expect(half.calories).toBe(Math.round((270 * 50) / 100));
    expect(half.protein).toBe(Math.round((12 * 50) / 100));
    expect(half.carbs).toBe(Math.round((33 * 50) / 100));
    expect(half.fat).toBe(Math.round((10 * 50) / 100));
  });
});
