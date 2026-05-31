import { Show, SignIn } from "@clerk/nextjs";
import { AppMobileNav, AppSidebar } from "@/components/app/navigation";
import { DevDataSeeder } from "@/components/providers/DevDataSeeder";
import { ReferenceDataHydrator } from "@/components/providers/ReferenceDataHydrator";
import { ReferenceDataProvider } from "@/components/providers/ReferenceDataProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { LayoutPropsType } from "@/types/layoutProps";

export default function AppRouteLayout({ children }: LayoutPropsType) {
  return (
    <>
      <ReferenceDataProvider />
      <ReferenceDataHydrator />
      {process.env.NODE_ENV === 'development' && <DevDataSeeder />}
      <Show when="signed-out">
        {/* Path routing requires /app/[[...rest]]; this app uses nested /app/* routes instead. */}
        <div className="flex min-h-svh w-full flex-col items-center justify-center px-4 py-8">
          <SignIn
            routing="hash"
            fallbackRedirectUrl="/app"
            signUpFallbackRedirectUrl="/app"
          />
        </div>
      </Show>
      <Show when="signed-in">
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
      </Show>
    </>
  );
}
