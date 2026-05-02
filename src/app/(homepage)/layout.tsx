import { HomepageNavbar, SiteFooter } from "@/components/homepage";

export default function HomepageLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <HomepageNavbar />
      {children}
      <SiteFooter />
    </div>
  );
}
