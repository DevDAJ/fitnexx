import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function DatePickerButton({
  date,
  onChange,
  datesWithData,
}: {
  date: Date;
  onChange: (d: Date) => void;
  datesWithData?: readonly Date[];
}) {
  const hasHighlight = Boolean(datesWithData?.length);

  return (
    <div className="flex flex-col gap-1 min-w-32">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 justify-start gap-2"
          >
            <CalendarIcon className="size-4 opacity-70" aria-hidden />
            {format(date, "MMM dd, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d)}
            modifiers={
              hasHighlight
                ? { hasData: [...(datesWithData ?? [])] }
                : undefined
            }
            modifiersClassNames={
              hasHighlight
                ? {
                    hasData:
                      "[&_button:not([data-selected-single=true])]:bg-primary/12 [&_button:not([data-selected-single=true])]:font-medium [&_button[data-selected-single=true]]:underline decoration-primary-foreground/80 decoration-2 underline-offset-2",
                  }
                : undefined
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
