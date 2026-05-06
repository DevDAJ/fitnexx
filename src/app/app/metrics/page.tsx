import { Header } from "@/components/app/Header";
import { MetricsDashboard } from "@/components/app/metrics/MetricsDashboard";

export default function MetricsPage() {
  return (
    <div className="flex-1 flex flex-col gap-8 p-4 sm:px-6">
      <Header
        title="Metrics"
        description="Track composition, basal metabolic rate, and goals locally in your browser."
      />
      <MetricsDashboard />
    </div>
  );
}
