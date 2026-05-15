"use client";

import {
  ImagePlusIcon,
  Loader2Icon,
  SwitchCameraIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type MacroCaptureRow,
  useMacrosCaptureStore,
} from "@/stores/macrosCaptureStore";
import cn from "@/utils/cn";

function useViewportIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isMobile;
}

type MacroFieldKey = "protein" | "fibre" | "carbohydrates" | "fat" | "calories";

function findMacroValue(value: unknown, key: string): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number" || typeof value === "string") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findMacroValue(item, key);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }

  if (typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (childKey.toLowerCase() === key.toLowerCase()) {
        return findMacroValue(childValue, key);
      }
    }
    for (const childValue of Object.values(value)) {
      const found = findMacroValue(childValue, key);
      if (found !== undefined) {
        return found;
      }
    }
  }

  return undefined;
}

function parseScanResult(result: unknown) {
  const defaultFields = {
    protein: "-",
    fibre: "-",
    carbohydrates: "-",
    fat: "-",
    calories: "-",
    rawResult: typeof result === "string" ? result : JSON.stringify(result),
  };

  let parsed = result;
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result);
    } catch {
      return defaultFields;
    }
  }

  if (typeof parsed !== "object" || parsed === null) {
    return defaultFields;
  }

  const fields: {
    protein: string;
    fibre: string;
    carbohydrates: string;
    fat: string;
    calories: string;
    rawResult: string;
  } = {
    ...defaultFields,
    rawResult: typeof result === "string" ? result : JSON.stringify(result),
  };

  (
    ["protein", "fibre", "carbohydrates", "fat", "calories"] as MacroFieldKey[]
  ).forEach((key) => {
    const value = findMacroValue(parsed, key);
    if (value !== undefined && value !== null && value !== "") {
      fields[key] = String(value);
    }
  });

  return fields;
}

export function createCaptureRow(
  imageUrl: string,
  fileName: string,
  scanResult: unknown,
  context: string,
): MacroCaptureRow {
  const parsed = parseScanResult(scanResult);
  const defaultName = context.trim() || fileName || "Scanned food";
  const now = new Date();
  const timeEaten = now.toTimeString().slice(0, 5);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    imageUrl,
    fileName,
    foodName: defaultName,
    timeEaten,
    mealClass: "snack",
    protein: parsed.protein,
    fibre: parsed.fibre,
    carbohydrates: parsed.carbohydrates,
    fat: parsed.fat,
    calories: parsed.calories,
    rawResult: parsed.rawResult,
  };
}

async function foodScanMultipart(
  file: File,
  context?: string,
): Promise<{ status: number; body: unknown }> {
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
    body = (await res.json()) as unknown;
  } catch {
    body = { ok: false, error: "Response was not JSON" };
  }
  return { status: res.status, body };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not serialize file."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function videoFrameToJpegFile(video: HTMLVideoElement): Promise<File | null> {
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!(w && h)) {
    return Promise.resolve(null);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.resolve(null);
  }
  ctx.drawImage(video, 0, 0, w, h);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        resolve(
          new File([blob], `food-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          }),
        );
      },
      "image/jpeg",
      0.92,
    );
  });
}

function MacrosFoodSkeleton() {
  return (
    <div
      className="rounded-xl bg-muted/60 ring-1 ring-border/70 animate-pulse min-h-[14rem]"
      aria-hidden
    />
  );
}

export function MacrosFoodCapture() {
  const isMobileViewport = useViewportIsMobile();
  const router = useRouter();
  const {
    busy,
    selectedFile,
    selectedPreviewUrl,
    context,
    rows,
    setBusy,
    setSelectedFile,
    setSelectedPreviewUrl,
    setContext,
    addCaptureRow,
    updateCaptureRow,
    removeCaptureRow,
    resetCapture,
  } = useMacrosCaptureStore();

  const runScan = React.useCallback(
    async (file: File | undefined | null, contextValue?: string) => {
      if (!(file instanceof File && file.type.startsWith("image/"))) {
        return;
      }
      setBusy(true);

      try {
        const { status, body } = await foodScanMultipart(file, contextValue);
        const err =
          body &&
          typeof body === "object" &&
          !Array.isArray(body) &&
          "error" in body &&
          typeof (body as { error?: unknown }).error === "string"
            ? (body as { error: string }).error
            : null;
        if (!(status >= 200 && status < 300)) {
          return;
        } else if (err) {
          return;
        } else {
          const imageUrl = selectedPreviewUrl ?? (await fileToDataUrl(file));
          addCaptureRow(
            createCaptureRow(
              imageUrl,
              file.name || `food-capture-${Date.now()}.jpg`,
              body,
              contextValue ?? "",
            ),
          );
        }
      } catch {
        return;
      } finally {
        setBusy(false);
      }
    },
    [addCaptureRow, setBusy, selectedPreviewUrl],
  );
  ``;

  const openCapturedFoods = React.useCallback(() => {
    router.push("/app/macros/capture/rows");
  }, [router]);

  const saveCaptureForReview = React.useCallback(
    async (file: File | undefined | null) => {
      if (!(file instanceof File && file.type.startsWith("image/"))) {
        return;
      }

      try {
        const previewUrl = await fileToDataUrl(file);
        setSelectedFile(file);
        setSelectedPreviewUrl(previewUrl);
        setContext("");
        router.push("/app/macros/capture");
      } catch {
        return;
      }
    },
    [router, setContext, setSelectedFile, setSelectedPreviewUrl],
  );

  if (isMobileViewport === undefined) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <MacrosFoodSkeleton />
      </div>
    );
  }

  if (isMobileViewport) {
    return (
      <MacrosMobileCameraExperience
        busy={busy}
        rowsCount={rows.length}
        onCapture={saveCaptureForReview}
        onViewRows={openCapturedFoods}
      />
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
      <MacrosDesktopDropZone
        busy={busy}
        selectedFile={selectedFile}
        selectedPreviewUrl={selectedPreviewUrl}
        context={context}
        onContextChange={setContext}
        onSelectFile={async (file) => {
          if (!file || !file.type.startsWith("image/")) {
            return;
          }
          setSelectedFile(file);
          try {
            setSelectedPreviewUrl(await fileToDataUrl(file));
          } catch {
            setSelectedPreviewUrl(null);
          }
        }}
        onClear={resetCapture}
        onSend={() => runScan(selectedFile, context)}
      />
      <CaptureRowsList
        rows={rows}
        onUpdateRow={updateCaptureRow}
        onRemoveRow={removeCaptureRow}
      />
    </div>
  );
}

export function CaptureRowsList({
  rows,
  onUpdateRow,
  onRemoveRow,
}: {
  rows: MacroCaptureRow[];
  onUpdateRow: (
    id: string,
    updater: (row: MacroCaptureRow) => MacroCaptureRow,
  ) => void;
  onRemoveRow: (id: string) => void;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Captured foods</CardTitle>
        <CardDescription>
          Edit the parsed values and food metadata before logging.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-[5rem_minmax(0,1fr)]"
          >
            <img
              src={row.imageUrl}
              alt={row.fileName || "Captured food"}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="grid gap-3">
              <div className="grid gap-2 sm:grid-cols-3 sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor={`food-name-${row.id}`}>Food name</Label>
                  <Input
                    id={`food-name-${row.id}`}
                    value={row.foodName}
                    onChange={(event) =>
                      onUpdateRow(row.id, (prev) => ({
                        ...prev,
                        foodName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`time-eaten-${row.id}`}>Time eaten</Label>
                  <Input
                    id={`time-eaten-${row.id}`}
                    type="time"
                    value={row.timeEaten}
                    onChange={(event) =>
                      onUpdateRow(row.id, (prev) => ({
                        ...prev,
                        timeEaten: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`meal-class-${row.id}`}>Class</Label>
                  <select
                    id={`meal-class-${row.id}`}
                    value={row.mealClass}
                    onChange={(event) =>
                      onUpdateRow(row.id, (prev) => ({
                        ...prev,
                        mealClass: event.target
                          .value as MacroCaptureRow["mealClass"],
                      }))
                    }
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    label: "Protein",
                    value: row.protein,
                    field: "protein" as const,
                  },
                  { label: "Fibre", value: row.fibre, field: "fibre" as const },
                  {
                    label: "Carbs",
                    value: row.carbohydrates,
                    field: "carbohydrates" as const,
                  },
                  { label: "Fat", value: row.fat, field: "fat" as const },
                  {
                    label: "Calories",
                    value: row.calories,
                    field: "calories" as const,
                  },
                ].map((field) => (
                  <div key={field.field} className="space-y-2">
                    <Label htmlFor={`${field.field}-${row.id}`}>
                      {field.label}
                    </Label>
                    <Input
                      id={`${field.field}-${row.id}`}
                      value={field.value}
                      onChange={(event) =>
                        onUpdateRow(row.id, (prev) => ({
                          ...prev,
                          [field.field]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t border-border pt-3 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${row.foodName.trim() || "food item"}`}
                onClick={() => onRemoveRow(row.id)}
              >
                <Trash2Icon className="mr-2 size-4" aria-hidden />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MacrosDesktopDropZone({
  busy,
  selectedFile,
  selectedPreviewUrl,
  context,
  onContextChange,
  onSelectFile,
  onClear,
  onSend,
}: {
  busy: boolean;
  selectedFile: File | null;
  selectedPreviewUrl: string | null;
  context: string;
  onContextChange: (value: string) => void;
  onSelectFile: (file: File | undefined | null) => Promise<void>;
  onClear: () => void;
  onSend: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const onBrowse = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onDragOverFile = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const hasFile = [...e.dataTransfer.types].includes("Files");
    if (hasFile) {
      setDragOver(true);
    }
  }, []);

  const onLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const onDropFiles = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      void onSelectFile(e.dataTransfer.files?.[0]);
    },
    [onSelectFile],
  );

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void onSelectFile(e.target.files?.[0]);
      e.target.value = "";
    },
    [onSelectFile],
  );

  const onSendClick = React.useCallback(() => {
    onSend();
  }, [onSend]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Food photo</CardTitle>
          <CardDescription>
            Drag or browse an image, then add extra context before sending it to
            OCR.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <button
              type="button"
              disabled={busy}
              onDragEnter={onDragOverFile}
              onDragLeave={onLeave}
              onDragOver={onDragOverFile}
              onDrop={onDropFiles}
              onClick={onBrowse}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-12 text-center transition-colors outline-none",
                dragOver &&
                  !busy &&
                  "border-primary bg-primary/[0.04] ring-2 ring-primary/35",
                busy && "pointer-events-none opacity-60 cursor-not-allowed",
              )}
            >
              {busy ? (
                <Loader2Icon className="size-14 text-muted-foreground animate-spin" />
              ) : (
                <UploadCloudIcon className="size-14 text-muted-foreground" />
              )}
              <span className="font-medium text-base">
                {busy ? "Processing…" : "Drag an image here or click to browse"}
              </span>
              <span className="max-w-md text-muted-foreground text-sm">
                JPEG, PNG, WebP · up to 12&nbsp;MB. Optional upstream: set{" "}
                <code className="text-xs">FOOD_SCAN_UPSTREAM_URL</code>{" "}
                server-side.
              </span>
              <Button asChild size="sm" variant="secondary">
                <span>{selectedFile ? "Replace image" : "Browse files"}</span>
              </Button>
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onInputChange}
          />

          {selectedPreviewUrl && (
            <div className="rounded-xl border border-border bg-muted p-3">
              <p className="text-sm text-foreground/80">Selected file</p>
              <img
                src={selectedPreviewUrl}
                alt="Selected food capture preview"
                className="mt-3 h-44 w-full rounded-lg object-contain"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="macros-context" className="text-sm font-medium">
              Additional context (optional)
            </label>
            <textarea
              id="macros-context"
              value={context}
              onChange={(event) => onContextChange(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="Describe what you captured, the meal type, or any note for OCR."
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedFile ? (
                <span>{selectedFile.name}</span>
              ) : (
                <span>No image selected yet.</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFile && (
                <Button type="button" variant="secondary" onClick={onClear}>
                  Clear
                </Button>
              )}
              <Button
                type="button"
                onClick={onSendClick}
                disabled={busy || !selectedFile}
              >
                Send to OCR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MacrosMobileCameraExperience({
  busy,
  rowsCount,
  onCapture,
  onViewRows,
}: {
  busy: boolean;
  rowsCount: number;
  onCapture: (file: File | undefined | null) => Promise<void>;
  onViewRows: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const galleryInputRef = React.useRef<HTMLInputElement>(null);

  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [facingMode, setFacingMode] = React.useState<"environment" | "user">(
    "environment",
  );

  React.useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera not supported in this browser.");
        return;
      }
      const prev = streamRef.current;
      if (prev) {
        streamRef.current = null;
        for (const t of prev.getTracks()) {
          t.stop();
        }
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject = null;
        }
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: facingMode } },
        });
        if (cancelled) {
          for (const t of stream.getTracks()) {
            t.stop();
          }
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraError(null);
      } catch {
        if (!cancelled) {
          setCameraError(
            "Camera permission denied or unavailable — use gallery button.",
          );
        }
      }
    }
    void boot();
    return () => {
      cancelled = true;
      const s = streamRef.current;
      streamRef.current = null;
      if (s) {
        for (const t of s.getTracks()) {
          t.stop();
        }
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject = null;
      }
    };
  }, [facingMode]);

  const toggleFacingCamera = React.useCallback(() => {
    if (busy) {
      return;
    }
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  }, [busy]);

  const onShutter = React.useCallback(async () => {
    const el = videoRef.current;
    if (!el || busy) {
      return;
    }
    const file = await videoFrameToJpegFile(el);
    await onCapture(file);
  }, [busy, onCapture]);

  const onGalleryPick = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.files?.[0];
      void onCapture(next);
      e.target.value = "";
    },
    [onCapture],
  );

  const openGallery = React.useCallback(() => {
    galleryInputRef.current?.click();
  }, []);

  return (
    <div className="-mx-4 flex min-h-0 min-w-0 flex-1 flex-col gap-4 pb-28 sm:-mx-6">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-none bg-black sm:rounded-xl md:rounded-xl md:rounded-b-xl">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full bg-black object-cover"
          muted
          playsInline
          autoPlay
        />

        {(cameraError || busy) && (
          <div className="absolute inset-x-0 top-4 flex justify-center px-4">
            {busy ? (
              <span className="rounded-full bg-background/90 px-4 py-1.5 text-sm shadow backdrop-blur">
                Sending…
              </span>
            ) : cameraError ? (
              <span className="rounded-lg bg-background/92 px-3 py-2 text-center text-muted-foreground text-sm shadow backdrop-blur">
                {cameraError}
              </span>
            ) : null}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/65 to-transparent pb-8 pt-20">
          <div className="pointer-events-auto">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              className="h-[4.75rem] w-[4.75rem] shrink-0 rounded-full border-4 border-background bg-background p-2 shadow-xl"
              onClick={() => void onShutter()}
              aria-label="Capture meal photo"
            >
              <span className="size-full rounded-full border-4 border-muted-foreground/45 bg-muted-foreground/25" />
            </Button>
          </div>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onGalleryPick}
        />

        <div className="pointer-events-none absolute left-4 bottom-[calc(env(safe-area-inset-bottom,0)+5.75rem)] z-40">
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            className="pointer-events-auto rounded-full shadow-lg"
            aria-label="Switch between front and back camera"
            onClick={toggleFacingCamera}
            disabled={
              busy ||
              typeof navigator === "undefined" ||
              !navigator.mediaDevices?.getUserMedia
            }
          >
            <SwitchCameraIcon className="size-7" aria-hidden />
          </Button>
        </div>

        <div className="pointer-events-none absolute right-4 bottom-[calc(env(safe-area-inset-bottom,0)+5.75rem)] z-40">
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            className="pointer-events-auto rounded-full shadow-lg"
            aria-label="Upload image from gallery"
            onClick={openGallery}
            disabled={busy}
          >
            <ImagePlusIcon className="size-7" aria-hidden />
          </Button>
        </div>
      </div>

      {rowsCount > 0 && (
        <div className="mx-4 flex justify-end sm:mx-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onViewRows}
            disabled={busy}
          >
            View captured foods ({rowsCount})
          </Button>
        </div>
      )}
    </div>
  );
}
