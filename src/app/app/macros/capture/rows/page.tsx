"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/app/Header";
import { CaptureRowsList } from "@/components/app/macros/MacrosFoodCapture";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";

export default function MacrosCaptureRowsPage() {
  const router = useRouter();
  const { rows, updateCaptureRow } = useMacrosCaptureStore();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:px-6">
      <Header
        title="Captured foods"
        description="Review mobile captures and edit parsed nutrition values before continuing."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={() => router.push("/app/macros") }>
          Back to Macros
        </Button>
        {rows.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {rows.length} captured {rows.length === 1 ? "food" : "foods"}
          </p>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No captured foods yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Capture a meal photo from the Macros page to review it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <CaptureRowsList rows={rows} onUpdateRow={updateCaptureRow} />
      )}
    </div>
  );
}
