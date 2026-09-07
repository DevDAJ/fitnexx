import { describe, expect, test } from "bun:test";
import { parseImport } from "./backupSchema";

const validData = {
  fitnexx_workouts: [],
  fitnexx_templates: [],
  fitnexx_weight_unit: "kg",
  fitnexx_schedule: null,
  fitnexx_meals: [],
  fitnexx_meal_templates: [],
  fitnexx_body_metrics: [],
  fitnexx_gyms: [],
  fitnexx_metrics_reminder: null,
  fitnexx_daily_calorie_goal: null,
  fitnexx_water: {},
  fitnexx_habit_reminders: {
    training: { enabled: false, hour: 8, minute: 0 },
    mealLog: { enabled: false, hour: 20, minute: 0 },
  },
  fitnexx_pro: false,
};

describe("parseImport", () => {
  test("accepts a valid backup", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: "x",
      data: validData,
    });
    expect(parseImport(raw)).toEqual(validData);
  });

  test("rejects non-JSON", () => {
    expect(() => parseImport("not json")).toThrow();
  });

  test("rejects wrong version", () => {
    const raw = JSON.stringify({ version: 2, data: validData });
    expect(() => parseImport(raw)).toThrow();
  });

  test("rejects missing fields", () => {
    const { fitnexx_water: _omit, ...partial } = validData;
    const raw = JSON.stringify({ version: 1, data: partial });
    expect(() => parseImport(raw)).toThrow("fitnexx_water");
  });

  test("rejects wrong-typed field", () => {
    const bad = { ...validData, fitnexx_weight_unit: "stones" };
    const raw = JSON.stringify({ version: 1, data: bad });
    expect(() => parseImport(raw)).toThrow("fitnexx_weight_unit");
  });
});
