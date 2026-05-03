import { endOfDay, startOfDay, subDays } from "date-fns";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerButton } from "../DatePickerButton";

export function RangeSelector({
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  datesWithData,
}: {
  rangeStart: Date;
  rangeEnd: Date;
  setRangeStart: (date: Date) => void;
  setRangeEnd: (date: Date) => void;
  datesWithData?: readonly Date[];
}) {
  const [isActive, setIsActive] = useState<("week" | "month" | "year") | null>(
    "week",
  );
  const presetWeek = useCallback(() => {
    setIsActive("week");
    const end = endOfDay(new Date());
    setRangeEnd(end);
    setRangeStart(startOfDay(subDays(end, 6)));
  }, [setRangeEnd, setRangeStart]);

  const presetMonth = useCallback(() => {
    setIsActive("month");
    const end = endOfDay(new Date());
    setRangeEnd(end);
    setRangeStart(startOfDay(subDays(end, 29)));
  }, [setRangeEnd, setRangeStart]);

  const presetYear = useCallback(() => {
    setIsActive("year");
    const end = endOfDay(new Date());
    setRangeEnd(end);
    setRangeStart(startOfDay(subDays(end, 364)));
  }, [setRangeEnd, setRangeStart]);

  const onSelectStartDate = useCallback(
    (d: Date) => {
      setIsActive(null);
      setRangeStart(startOfDay(d));
    },
    [setRangeStart],
  );
  const onSelectEndDate = useCallback(
    (d: Date) => {
      setIsActive(null);
      setRangeEnd(endOfDay(d));
    },
    [setRangeEnd],
  );

  return (
    <section className="flex flex-wrap items-end gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <DatePickerButton
          date={rangeStart}
          onChange={onSelectStartDate}
          datesWithData={datesWithData}
        />
        <span className="font-medium text-muted-foreground align-middle">
          to
        </span>
        <DatePickerButton
          date={rangeEnd}
          onChange={onSelectEndDate}
          datesWithData={datesWithData}
        />
      </div>
      <div className="mx-1 hidden h-8 w-px bg-border md:block" aria-hidden />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={isActive === "week" ? "default" : "outline"}
          onClick={presetWeek}
          className="rounded-md h-9"
        >
          Week
        </Button>
        <Button
          type="button"
          variant={isActive === "month" ? "default" : "outline"}
          onClick={presetMonth}
          className="rounded-md h-9"
        >
          Month
        </Button>
        <Button
          type="button"
          variant={isActive === "year" ? "default" : "outline"}
          onClick={presetYear}
          className="rounded-md h-9"
        >
          Year
        </Button>
      </div>
    </section>
  );
}
