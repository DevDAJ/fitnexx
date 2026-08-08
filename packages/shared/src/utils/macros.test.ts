import { test, expect } from "bun:test";
import { parseMacroScanResult } from "./macros";

test("parses a JSON string response", () => {
  const result = parseMacroScanResult(
    '{"foodName":"Chicken Salad","protein":35,"carbs":12,"fat":9,"calories":280}',
  );
  expect(result.foodName).toBe("Chicken Salad");
  expect(result.protein).toBe("35");
  expect(result.calories).toBe("280");
});

test("parses a nested object and defaults missing macros", () => {
  const result = parseMacroScanResult({ data: { foodName: "Oatmeal", fibre: "4" } });
  expect(result.foodName).toBe("Oatmeal");
  expect(result.fibre).toBe("4");
  expect(result.fat).toBe("-");
});

test("falls back to raw string when not JSON", () => {
  const result = parseMacroScanResult("not json");
  expect(result.foodName).toBe("");
  expect(result.protein).toBe("-");
  expect(result.rawResult).toBe("not json");
});
