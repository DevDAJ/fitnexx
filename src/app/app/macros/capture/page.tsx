"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, AlertCircleIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CaptureRowsList, createCaptureRow } from "@/components/app/macros/MacrosFoodCapture";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";

async function postFoodScan(file: File, context?: string) {
  const fd = new FormData();
  fd.append("image", file, file.name);
  if (typeof context === "string" && context.trim().length > 0) {
    fd.append("context", context.trim());
  }

  const res = await fetch("/api/food-scan", {
    method: "POST",
    body: fd,
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = { ok: false, error: "Response was not JSON" };
  }

  return { status: res.status, body };
}

export default function MacrosCaptureReviewPage() {
  const router = useRouter();
  const {
    selectedFile,
    selectedPreviewUrl,
    context,
    rows,
    setContext,
    busy,
    scanError,
    lastResult,
    setBusy,
    setScanError,
    setLastResult,
    addCaptureRow,
    updateCaptureRow,
    removeCaptureRow,
    resetCapture,
  } = useMacrosCaptureStore();

  const onCancel = React.useCallback(() => {
    resetCapture();
    router.push("/app/macros");
  }, [resetCapture, router]);

  const onSend = React.useCallback(async () => {
    if (!selectedFile) {
      setScanError("No image available to send.");
      return;
    }

    setBusy(true);
    setScanError(null);
    setLastResult(null);

    try {
      const { status, body } = await postFoodScan(selectedFile, context);
      setLastResult(body);

      const err =
        body &&
        typeof body === "object" &&
        !Array.isArray(body) &&
        "error" in body &&
        typeof (body as { error?: unknown }).error === "string"
          ? (body as { error: string }).error
          : null;

      if (!(status >= 200 && status < 300)) {
        setScanError(err || `Request failed (${status}).`);
      } else if (err) {
        setScanError(err);
      } else {
        addCaptureRow(
          createCaptureRow(
            selectedPreviewUrl ?? "",
            selectedFile.name || `food-capture-${Date.now()}.jpg`,
            body,
            context || "",
          ),
        );
      }
    } catch {
      setScanError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }, [context, resetCapture, selectedFile, setBusy, setLastResult, setScanError]);

  if (!selectedPreviewUrl) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted p-6 text-center">
        <p className="text-base font-medium">No captured image found.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Go back and capture a meal photo first.
        </p>
        <Button type="button" onClick={onCancel}>
          Back to Macros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 p-4 sm:px-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Add capture context</CardTitle>
              <CardDescription>
                Review your photo and add optional details before sending it to
                the backend.
              </CardDescription>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
              <ArrowLeftIcon className="mr-2 size-4" /> Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl border border-border bg-muted p-3">
            <img
              src={selectedPreviewUrl}
              alt="Food capture preview"
              className="h-64 w-full rounded-xl object-contain"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="capture-context" className="text-sm font-medium">
              Additional context (optional)
            </label>
            <textarea
              id="capture-context"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="Describe what food or meal this is, any brand, portion note, or special instruction."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSend} disabled={busy}>
              {busy ? "Sending…" : "Send to OCR"}
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
          </div>

          {scanError && (
            <p className="flex items-start gap-2 text-destructive text-sm leading-relaxed">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              <span>{scanError}</span>
            </p>
          )}

          {lastResult !== null && (
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="font-medium text-foreground text-sm">OCR response</p>
              <pre className="max-h-56 overflow-auto rounded-lg bg-muted/60 p-3 text-xs whitespace-pre-wrap break-words">
                {typeof lastResult === "string"
                  ? lastResult
                  : JSON.stringify(lastResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
      <CaptureRowsList
        rows={rows}
        onUpdateRow={updateCaptureRow}
        onRemoveRow={removeCaptureRow}
      />
    </div>
  );
}
