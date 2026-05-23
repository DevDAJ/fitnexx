"use client";

import { ChevronRight } from "lucide-react";

type SettingsRowProps = {
  title: string;
  description: string;
  mobileActionLabel: string;
  onMobileClick: () => void;
  mobileTrailing?: "chevron" | "control";
  children: React.ReactNode;
};

export function SettingsRow({
  title,
  description,
  mobileActionLabel,
  onMobileClick,
  mobileTrailing = "chevron",
  children,
}: SettingsRowProps) {
  return (
    <div className="relative flex items-center justify-between gap-4 py-4 max-md:active:bg-muted/50">
      <button
        type="button"
        aria-label={mobileActionLabel}
        onClick={onMobileClick}
        className="absolute inset-0 z-0 rounded-sm md:hidden"
      />
      <div className="pointer-events-none min-w-0 space-y-0.5">
        <p className="font-medium text-foreground leading-snug">{title}</p>
        <p className="text-muted-foreground text-sm leading-snug">
          {description}
        </p>
      </div>
      <div className="relative z-10 shrink-0">
        {mobileTrailing === "chevron" ? (
          <>
            <ChevronRight
              aria-hidden
              className="size-4 text-muted-foreground md:hidden"
            />
            <div className="hidden md:block">{children}</div>
          </>
        ) : (
          <div className="max-md:pointer-events-none">{children}</div>
        )}
      </div>
    </div>
  );
}
