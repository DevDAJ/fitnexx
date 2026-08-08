type MacroFieldKey = "protein" | "fibre" | "carbohydrates" | "fat" | "calories";

function findMacroValue(value: unknown, key: string): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "object" || item === null) continue;
      const found = findMacroValue(item, key);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  if (typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (childKey.toLowerCase() === key.toLowerCase()) {
        return findMacroValue(childValue, key);
      }
    }
    for (const childValue of Object.values(value)) {
      if (typeof childValue !== "object" || childValue === null) continue;
      const found = findMacroValue(childValue, key);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export type ParsedMacroScan = {
  foodName: string;
  protein: string;
  fibre: string;
  carbohydrates: string;
  fat: string;
  calories: string;
  rawResult: string;
};

export function parseMacroScanResult(result: unknown): ParsedMacroScan {
  let parsed = result;
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result) as unknown;
    } catch {
      /* not JSON, use raw string */
    }
  }

  const defaults: ParsedMacroScan = {
    foodName: "",
    protein: "-",
    fibre: "-",
    carbohydrates: "-",
    fat: "-",
    calories: "-",
    rawResult: typeof result === "string" ? result : JSON.stringify(result),
  };

  if (typeof parsed !== "object" || parsed === null) return defaults;

  const pick = (key: string, fallback: string) => {
    const value = findMacroValue(parsed, key);
    return value !== undefined && value !== "" ? value : fallback;
  };

  return {
    foodName: pick("foodName", pick("name", defaults.foodName)),
    protein: pick("protein", defaults.protein),
    fibre: pick("fibre", defaults.fibre),
    carbohydrates: pick("carbohydrates", defaults.carbohydrates),
    fat: pick("fat", defaults.fat),
    calories: pick("calories", defaults.calories),
    rawResult: defaults.rawResult,
  };
}
