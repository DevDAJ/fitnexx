import { Header } from "@/components/app/Header";
import { PerformanceSubNav } from "@/components/app/performance/PerformanceSubNav";
import type { LayoutPropsType } from "@/types/layoutProps";

export default function PerformanceLayout({ children }: LayoutPropsType) {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 sm:px-6">
      <Header
        title="Performance"
        description="Track lifts over time locally in your browser — data never leaves your device."
      />
      <PerformanceSubNav />
      {children}
    </div>
  );
}
