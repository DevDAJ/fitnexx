"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/app/dashboard/ChartCard";
import { MeasurementSelector } from "@/components/app/dashboard/MeasurementSelector";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_MUSCLES } from "@/constants/performanceConstants";
import { usePerformanceCharts } from "@/hooks/usePerformanceCharts";
import cn from "@/utils/cn";

function SegmentedTabs<T extends string>({
  value,
  onValueChange,
  options,
}: {
  value: T;
  onValueChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div
      className="mt-3 flex rounded-md border border-border bg-muted/40 p-0.5"
      role="tablist"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={cn(
            "flex-1 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onValueChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function PerformanceCharts({
  rangeStart,
  rangeEnd,
}: {
  rangeStart: Date;
  rangeEnd: Date;
}) {
  const {
    metric,
    setMetric,
    muscleFilter,
    setMuscleFilter,
    chartExerciseId,
    setChartExerciseId,
    comparisonBasis,
    setComparisonBasis,
    metricLabel,
    lineChartCfg,
    deltaChartCfg,
    filteredExercises,
    muscleChartSparse,
    exerciseChartSparse,
    comparisonChartSparse,
    comparisonSubtitle,
    xTickFmt,
  } = usePerformanceCharts(rangeStart, rangeEnd);
  return (
    <>
      {" "}
      <MeasurementSelector
        metric={metric}
        setMetric={setMetric}
        muscleFilter={muscleFilter}
        setMuscleFilter={setMuscleFilter}
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Muscle group"
          description={
            muscleFilter === ALL_MUSCLES
              ? `${metricLabel} · all groups`
              : `${metricLabel} · selected group`
          }
        >
          {muscleChartSparse.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-sm">
              No data found
            </div>
          ) : (
            <ChartContainer
              config={lineChartCfg}
              className="h-full w-full shrink-0"
            >
              <LineChart
                data={muscleChartSparse}
                accessibilityLayer
                margin={{ left: 4, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={16}
                  fontSize={10}
                  tickFormatter={xTickFmt}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  width={42}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  fontSize={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </ChartCard>
        <ChartCard
          title="Exercise"
          description={metricLabel}
          headerExtra={
            <div className="mt-3 flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs">Exercise</Label>
              <Select
                value={chartExerciseId}
                onValueChange={setChartExerciseId}
              >
                <SelectTrigger className="h-9 w-full" size="sm">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent align="start">
                  {filteredExercises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          {exerciseChartSparse.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-sm">
              No data found
            </div>
          ) : (
            <ChartContainer
              config={lineChartCfg}
              className="h-full w-full shrink-0"
            >
              <LineChart
                data={exerciseChartSparse}
                accessibilityLayer
                margin={{ left: 4, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={16}
                  fontSize={10}
                  tickFormatter={xTickFmt}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  width={42}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  fontSize={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </ChartCard>
        <ChartCard
          title="Change over time"
          description={comparisonSubtitle}
          className="col-span-2 xl:col-span-1"
          headerExtra={
            <SegmentedTabs
              value={comparisonBasis}
              onValueChange={setComparisonBasis}
              options={[
                { value: "muscle", label: "Muscle group" },
                { value: "exercise", label: "Exercise" },
              ]}
            />
          }
        >
          {comparisonChartSparse.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[220px] flex-1 items-center justify-center text-sm">
              No data found
            </div>
          ) : (
            <ChartContainer
              config={deltaChartCfg}
              className="h-full w-full shrink-0"
            >
              <LineChart
                data={comparisonChartSparse}
                accessibilityLayer
                margin={{ left: 4, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <ReferenceLine y={0} stroke="#ccc" strokeWidth={1} />
                <XAxis
                  dataKey="date"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={16}
                  fontSize={10}
                  tickFormatter={xTickFmt}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  width={48}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  fontSize={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="linear"
                  dataKey="delta"
                  stroke="var(--color-delta)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </ChartCard>
      </div>
    </>
  );
}
