import { AppMobileNav, AppSidebar } from "@/components/app/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { LayoutPropsType } from "@/types/layoutProps";

export default function AppRouteLayout({ children }: LayoutPropsType) {
  return (
    <SidebarProvider>
      <div className="relative min-h-svh w-full">
        <div className="flex min-h-svh w-full">
          <AppSidebar />
          <SidebarInset className="min-w-0 flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
            {children}
          </SidebarInset>
        </div>
        <AppMobileNav />
      </div>
    </SidebarProvider>
  );
}
