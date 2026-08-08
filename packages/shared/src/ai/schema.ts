import { parseMacroScanResult } from "../utils/macros";

export type ProviderId = "openai-compatible" | "anthropic" | "gemini" | "ollama";

export type AiProviderConfig = {
  provider: ProviderId;
  baseUrl: string;
  model: string;
  systemPrompt: string;
};

export type IngredientMacro = {
  name: string;
  weightGrams: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fibre: number;
  calories: number;
};

export type MacroTotals = {
  protein: number;
  carbohydrates: number;
  fat: number;
  fibre: number;
  calories: number;
};

export type ScanResult = {
  foodName: string;
  ingredients: IngredientMacro[];
  total: MacroTotals;
};

export function emptyTotals(): MacroTotals {
  return { protein: 0, carbohydrates: 0, fat: 0, fibre: 0, calories: 0 };
}

function toNum(value: unknown): number {
  const n =
    typeof value === "string"
      ? Number.parseFloat(value)
      : typeof value === "number"
        ? value
        : Number.NaN;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function findField(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const entry of Object.entries(obj)) {
    if (keys.some((k) => entry[0].toLowerCase() === k.toLowerCase())) {
      return entry[1];
    }
  }
  return undefined;
}

function normalizeTotals(value: unknown): MacroTotals {
  if (typeof value !== "object" || value === null) return emptyTotals();
  const obj = value as Record<string, unknown>;
  return {
    protein: toNum(findField(obj, ["protein"])),
    carbohydrates: toNum(findField(obj, ["carbohydrates", "carbs", "carb"])),
    fat: toNum(findField(obj, ["fat"])),
    fibre: toNum(findField(obj, ["fibre", "fiber"])),
    calories: toNum(findField(obj, ["calories", "kcal"])),
  };
}

function sumTotals(ingredients: IngredientMacro[]): MacroTotals {
  return ingredients.reduce<MacroTotals>(
    (acc, i) => ({
      protein: acc.protein + i.protein,
      carbohydrates: acc.carbohydrates + i.carbohydrates,
      fat: acc.fat + i.fat,
      fibre: acc.fibre + i.fibre,
      calories: acc.calories + i.calories,
    }),
    emptyTotals(),
  );
}

function normalizeIngredient(value: unknown): IngredientMacro | null {
  if (typeof value !== "object" || value === null) return null;
  const obj = value as Record<string, unknown>;
  const name = findField(obj, ["name", "ingredient"]);
  if (typeof name !== "string" || name.trim() === "") return null;
  return {
    name: name.trim(),
    weightGrams: toNum(findField(obj, ["weightGrams", "weight_grams", "grams", "weight"])),
    protein: toNum(findField(obj, ["protein"])),
    carbohydrates: toNum(findField(obj, ["carbohydrates", "carbs", "carb"])),
    fat: toNum(findField(obj, ["fat"])),
    fibre: toNum(findField(obj, ["fibre", "fiber"])),
    calories: toNum(findField(obj, ["calories", "kcal"])),
  };
}

export function normalizeScanResult(raw: unknown): ScanResult {
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      /* use raw string fallback below */
    }
  }
  if (typeof parsed !== "object" || parsed === null) {
    return { foodName: "", ingredients: [], total: emptyTotals() };
  }

  const obj = parsed as Record<string, unknown>;
  const flat = parseMacroScanResult(obj);

  const ingredients = Array.isArray(obj.ingredients)
    ? obj.ingredients.map(normalizeIngredient).filter((i): i is IngredientMacro => i !== null)
    : [];

  const total =
    obj.total !== undefined && obj.total !== null
      ? normalizeTotals(obj.total)
      : ingredients.length > 0
        ? sumTotals(ingredients)
        : {
            protein: toNum(flat.protein),
            carbohydrates: toNum(flat.carbohydrates),
            fat: toNum(flat.fat),
            fibre: toNum(flat.fibre),
            calories: toNum(flat.calories),
          };

  const foodName =
    typeof findField(obj, ["foodName", "name", "dish"]) === "string"
      ? (findField(obj, ["foodName", "name", "dish"]) as string)
      : flat.foodName;

  return { foodName, ingredients, total };
}
