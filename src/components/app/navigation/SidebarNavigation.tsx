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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../../shared/mode-toggle";

const mainNav = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/performance", label: "Performance", icon: Activity },
  { href: "/app/macros", label: "Macros", icon: UtensilsCrossed },
  { href: "/app/metrics", label: "Metrics", icon: BarChart3 },
] as const;

function pathMatches(pathname: string, href: string, end?: boolean) {
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (end) return p === h;
  return p === h || p.startsWith(`${h}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh w-(--sidebar-width) shrink-0 border-e border-sidebar-border md:flex"
    >
      <SidebarHeader className="px-4 py-3">
        <div className="flex justify-between">
          <Link
            href="/app"
            className="text-md font-semibold tracking-tight text-sidebar-foreground hover:text-sidebar-accent-foreground"
          >
            Fitnexx
          </Link>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/app"
                        ? pathMatches(pathname, item.href, true)
                        : pathMatches(pathname, item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathMatches(pathname, "/app/settings")}
            >
              <Link href="/app/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
