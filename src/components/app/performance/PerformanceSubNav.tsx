"use client";

import { Activity, Dumbbell, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "@/utils/cn";

const tabs: {
  href: string;
  label: string;
  icon: typeof Activity;
  exact?: boolean;
}[] = [
  { href: "/app/performance", label: "Log", icon: Activity, exact: true },
  { href: "/app/performance/gym", label: "Gym", icon: Dumbbell },
  { href: "/app/performance/programming", label: "Programming", icon: NotebookPen },
];

export function PerformanceSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-lg bg-muted/50 p-1" aria-label="Performance sections">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
