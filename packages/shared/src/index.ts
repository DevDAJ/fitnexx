export { setPersistenceStorage } from "./stores/persistence";
export type { PersistenceStorage } from "./stores/persistence";
export { usePerformanceStore } from "./stores/performanceStore";
export { useGymStore } from "./stores/gymStore";
export { useMacrosCaptureStore } from "./stores/macrosCaptureStore";
export type { MacroCaptureRow } from "./stores/macrosCaptureStore";
export { useMetricsStore } from "./stores/metricsStore";
export { useProgrammingStore } from "./stores/programmingStore";

export type {
  MetricMode, WeightUnit, MuscleGroup, Exercise, WorkoutSet, PerformanceState,
} from "./types/performanceTypes";

export type {
  BodyMetricEntry, ActivityLevel, MetricsState,
} from "./types/metricsTypes";

export type {
  TemplateExercise, WorkoutTemplate, WorkoutSession, ProgrammingState,
} from "./types/programmingTypes";

export {
  PERFORMANCE_STORAGE_KEY, ALL_MUSCLES,
} from "./constants/performanceConstants";

export {
  GYM_STORAGE_KEY, SEEDED_EQUIPMENT, seededGymState,
} from "./constants/gymConstants";
export type { EquipmentCategory, Equipment, GymState } from "./constants/gymConstants";

export {
  METRICS_STORAGE_KEY,
  ACTIVITY_TDEE_MULTIPLIERS,
  KCAL_PER_KG_BODY_MASS,
} from "./constants/metricsConstants";

export { PROGRAMMING_STORAGE_KEY } from "./constants/programmingConstants";

export { mergePartialPerformanceState } from "./utils/performanceUtils";
export { mergePartialMetricsState } from "./utils/metricsUtils";
export { randomId } from "./utils/id";
export { parseMacroScanResult } from "./utils/macros";

export { useAiSettingsStore } from "./stores/aiSettingsStore";

export { scanFoodWithProvider, normalizeScanResult, emptyTotals } from "./ai";
export type { AiProviderConfig, ProviderId, ScanResult, IngredientMacro, MacroTotals } from "./ai";
export { DEFAULT_SYSTEM_PROMPT } from "./ai";
export { PROVIDER_ADAPTERS, PROVIDER_IDS } from "./ai";
export { WORKOUT_SUGGESTION_PROMPT, buildWorkoutContext, normalizeWorkoutSuggestion } from "./ai/workout";
export type { WorkoutSuggestion, WorkoutSuggestionExercise, WorkoutContextInput } from "./ai/workout";
export { FREE_SCANS_PER_DAY, computeScanQuota } from "./ai/quota";
export type { ScanQuota } from "./ai/quota";
