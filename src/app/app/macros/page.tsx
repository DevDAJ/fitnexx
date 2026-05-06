import { Header } from "@/components/app/Header";
import { MacrosFoodCapture } from "@/components/app/macros/MacrosFoodCapture";

export default function MacrosPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:px-6">
      <Header
        title="Macros"
        description="Snap or upload nutrition labels — images go to OCR for macro parsing (see server env FOOD_SCAN_UPSTREAM_URL)."
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <MacrosFoodCapture />
      </div>
    </div>
  );
}
