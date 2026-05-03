export type BodyMetricEntry = {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
};

export type MetricsState = {
  entries: BodyMetricEntry[];
  targetWeightKg: number | null;
  targetBodyFatPercent: number | null;
};
