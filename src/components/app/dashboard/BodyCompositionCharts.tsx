"use client";

import {
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/app/dashboard/ChartCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMetricsState } from "@/hooks/useMetricsState";

const chartConfig = {
  weightKg: { label: "Weight (kg)", color: "var(--chart-1)" },
  bodyFat: { label: "Body fat (%)", color: "var(--chart-2)" },
};

export function BodyCompositionCharts({
  rangeStart,
  rangeEnd,
}: {
  rangeStart: Date;
  rangeEnd: Date;
}) {
  const { state, ready } = useMetricsState();

  const chartData = React.useMemo(() => {
    const start = startOfDay(rangeStart);
    const end = endOfDay(rangeEnd);
    return state.entries
      .filter((e) =>
        isWithinInterval(parseISO(`${e.date}T12:00:00`), { start, end }),
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date,
        weightKg: e.weightKg,
        bodyFat: e.bodyFatPercent,
      }));
  }, [rangeEnd, rangeStart, state.entries]);

  const xTickFmt = (iso: string) => format(parseISO(iso), "MMM d");

  return (
    <ChartCard
      title="Body composition"
      description="Weight (kg) and body fat (%), same dates as dashboard range."
    >
      {!ready ? (
        <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-sm">
          Loading…
        </div>
      ) : chartData.length === 0 ? (
        <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-center text-sm">
          No body metrics logged in this range.&nbsp;
          <span className="text-foreground font-medium">
            Add entries on the Metrics page.
          </span>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[220px] w-full shrink-0"
        >
          <LineChart
            data={chartData}
            accessibilityLayer
            margin={{ left: 4, right: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
              minTickGap={16}
              tickFormatter={xTickFmt}
            />
            <YAxis
              yAxisId="weight"
              width={42}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={10}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v}`}
              label={{
                value: "kg",
                angle: -90,
                position: "insideLeft",
                offset: -4,
                style: { fill: "var(--muted-foreground)", fontSize: 10 },
              }}
            />
            <YAxis
              yAxisId="bf"
              orientation="right"
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={10}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="weightKg"
              stroke="var(--color-weightKg)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              yAxisId="bf"
              type="monotone"
              dataKey="bodyFat"
              stroke="var(--color-bodyFat)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}
