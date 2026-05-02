"use client";

import {
  Activity,
  BarChart3,
  Home,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/utils";

function pathMatches(pathname: string, href: string, end?: boolean) {
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (end) return p === h;
  return p === h || p.startsWith(`${h}/`);
}

type EdgeItem = {
  href: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
};

const leftItems: EdgeItem[] = [
  { href: "/app", label: "Home", icon: Home, end: true },
  { href: "/app/performance", label: "Performance", icon: Activity },
];

const rightItems: EdgeItem[] = [
  { href: "/app/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

function EdgeNavLink({ item }: { item: EdgeItem }) {
  const pathname = usePathname();
  const active = pathMatches(pathname, item.href, item.end);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[0.65rem] font-medium text-muted-foreground transition-colors",
        active && "text-primary",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="truncate text-xs">{item.label}</span>
    </Link>
  );
}

export function AppMobileNav() {
  const pathname = usePathname();
  const macrosActive = pathMatches(pathname, "/app/macros");

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    >
      <div className="border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-4px_oklch(0_0_0/0.08)] backdrop-blur-md dark:shadow-[0_-4px_24px_-4px_oklch(0_0_0/0.35)]">
        <div className="relative flex h-17 items-end justify-between gap-1 px-2 pb-2 pt-1">
          {leftItems.map((item) => (
            <EdgeNavLink key={item.href} item={item} />
          ))}
          <div className="relative flex flex-col w-7 shrink-0 justify-center items-center gap-2 flex-1">
            <Link
              href="/app/macros"
              className={cn(
                "flex size-14 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-md ring-1 ring-border/60 transition-[box-shadow,transform] hover:shadow-lg active:scale-95",
                macrosActive &&
                  "ring-2 ring-sidebar-ring ring-offset-2 ring-offset-primary",
              )}
              aria-current={macrosActive ? "page" : undefined}
            >
              <UtensilsCrossed className="size-6" aria-hidden />
              <span className="sr-only">Macros</span>
            </Link>
            <span
              className={cn(
                "pb-1 text-xs font-medium text-muted-foreground",
                macrosActive && "text-primary",
              )}
            >
              Macros
            </span>
          </div>
          {rightItems.map((item) => (
            <EdgeNavLink key={item.href} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
}
