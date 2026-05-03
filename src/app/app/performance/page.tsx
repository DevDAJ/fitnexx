import { Header } from "@/components/app/Header";
import { PerformanceDashboard } from "@/components/app/performance/PerformancePage";

export default function PerformancePage() {
  return (
    <div className="flex-1 flex flex-col gap-8 p-4 sm:px-6">
      <Header
        title="Performance"
        description="Track lifts over time locally in your browser — data never leaves your device."
      />
      <PerformanceDashboard />
    </div>
  );
}
