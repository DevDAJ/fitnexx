"use client";
import { endOfDay, parse, startOfDay, subDays } from "date-fns";
import * as React from "react";
import { PerformanceCharts } from "@/components/app/dashboard/PerformanceCharts";
import { RangeSelector } from "@/components/app/dashboard/RangeSelector";
import { Header } from "@/components/app/Header";
import { usePerformanceStore } from "@/stores/performanceStore";

export default function Home() {
  const sets = usePerformanceStore((s) => s.sets);
  const datesWithData = React.useMemo(() => {
    const keys = new Set(sets.map((x) => x.date));
    return [...keys].map((d) => parse(d, "yyyy-MM-dd", new Date()));
  }, [sets]);

  const [rangeEnd, setRangeEnd] = React.useState(() => endOfDay(new Date()));
  const [rangeStart, setRangeStart] = React.useState(() =>
    startOfDay(subDays(new Date(), 6)),
  );

  return (
    <div className="flex-1 flex flex-col gap-8 p-4 sm:px-6">
      <Header
        title="Dashboard"
        description="Track lifts over time locally in your browser"
      />
      <RangeSelector
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        datesWithData={datesWithData}
      />
      <PerformanceCharts rangeStart={rangeStart} rangeEnd={rangeEnd} />
    </div>
  );
}
