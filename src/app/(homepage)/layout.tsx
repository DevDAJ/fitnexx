import { HomepageNavbar, SiteFooter } from "@/components/homepage";
import type { LayoutPropsType } from "@/types/layoutProps";

export default function HomepageLayout({ children }: LayoutPropsType) {
  return (
    <div className="flex min-h-full flex-col">
      <HomepageNavbar />
      {children}
      <SiteFooter />
    </div>
  );
}
