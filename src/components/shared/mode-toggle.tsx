"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import cn from "@/utils/cn";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn("bg-muted/50 h-8 w-75 rounded-lg", className)}
        aria-hidden
      />
    );
  }

  const isLight = theme !== "dark";
  const isDark = theme === "dark";

  return (
    <fieldset
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setTheme(isLight ? "dark" : "light");
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        setTheme(isLight ? "dark" : "light");
      }}
      className={cn(
        "bg-muted/50 m-0 inline-flex min-w-0 items-center rounded-lg border-0 p-0.5 ring-1 ring-border/80 hover:cursor-pointer",
        className,
      )}
    >
      <legend className="sr-only">Theme</legend>
      <Button
        type="button"
        variant={isLight ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "size-7",
          isDark && "hover:bg-orange-400! hover:text-orange-950",
          isLight &&
            "bg-orange-300 text-orange-950 drop-shadow-sm hover:bg-orange-400 hover:text-orange-950",
        )}
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        aria-pressed={isLight}
      >
        <Sun className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={isDark ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "size-7",
          isLight && "hover:bg-indigo-400 hover:text-indigo-950",
          isDark &&
            "bg-indigo-300 text-indigo-950 drop-shadow-sm hover:bg-indigo-400 hover:text-indigo-950",
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        aria-pressed={isDark}
      >
        <Moon className="size-3.5" />
      </Button>
    </fieldset>
  );
}
