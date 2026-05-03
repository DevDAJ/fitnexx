import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import cn from "@/utils/cn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { selectTriggerVariants } from "../ui/select";

export type ComboboxOption = { id: string; label: string };

export function ComboPicker({
  options,
  valueId,
  onSelect,
  placeholder,
  ariaLabel,
  className,
}: {
  options: ComboboxOption[];
  valueId: string;
  onSelect: (id: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.id === valueId)?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            selectTriggerVariants({ size: "default" }),
            "h-9 w-full min-w-0 text-start font-normal md:max-w-[280px]",
            className,
          )}
        >
          <span className="line-clamp-1 flex min-w-0 flex-1 items-center text-start">
            {selected}
          </span>
          <ChevronDownIcon
            className="pointer-events-none size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 md:w-[300px]"
        align="start"
      >
        <Command loop>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={`${opt.label}-${opt.id}`}
                  onSelect={() => {
                    onSelect(opt.id);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
