"use client";

import {
  AlertCircleIcon,
  SwitchCameraIcon,
  ImagePlusIcon,
  Loader2Icon,
  UploadCloudIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

async function foodScanMultipart(
  file: File,
): Promise<{ status: number; body: unknown }> {
  const fd = new FormData();
  fd.append("image", file, file.name);

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

  const [busy, setBusy] = React.useState(false);
  const [scanError, setScanError] = React.useState<string | null>(null);
  const [lastResult, setLastResult] = React.useState<unknown>(null);

  const runScan = React.useCallback(async (file: File | undefined | null) => {
    if (!(file instanceof File && file.type.startsWith("image/"))) {
      setScanError("Pick an image file.");
      return;
    }

    setScanError(null);
    setLastResult(null);

    setBusy(true);
    try {
      const { status, body } = await foodScanMultipart(file);
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
      }
    } catch {
      setScanError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }, []);

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
        scanError={scanError}
        lastResult={lastResult}
        runScan={runScan}
      />
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <MacrosDesktopDropZone
        busy={busy}
        scanError={scanError}
        lastResult={lastResult}
        runScan={runScan}
      />
    </div>
  );
}

function MacrosDesktopDropZone({
  busy,
  scanError,
  lastResult,
  runScan,
}: {
  busy: boolean;
  scanError: string | null;
  lastResult: unknown;
  runScan: (file: File | undefined | null) => Promise<void>;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const onBrowse = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const consumeFiles = React.useCallback(
    (list: FileList | null | undefined) => {
      const next = list?.[0];
      void runScan(next);
    },
    [runScan],
  );

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
      consumeFiles(e.dataTransfer.files);
    },
    [consumeFiles],
  );

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      consumeFiles(e.target.files);
      e.target.value = "";
    },
    [consumeFiles],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Food photo</CardTitle>
          <CardDescription>
            Drop nutrition labels or meal photos — sent to OCR via{" "}
            <code className="text-xs">POST /api/food-scan</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
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
            <Button type="button" size="sm" variant="secondary" disabled={busy}>
              Browse files
            </Button>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onInputChange}
          />
        </CardContent>

        {(scanError || lastResult !== null) && (
          <CardFooter className="flex flex-col gap-3 items-start">
            {scanError && (
              <p className="flex items-start gap-2 text-destructive text-sm leading-relaxed">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                <span>{scanError}</span>
              </p>
            )}
            {lastResult !== null && (
              <div className="w-full space-y-1">
                <p className="font-medium text-foreground text-sm">
                  Latest response
                </p>
                <pre className="max-h-48 overflow-auto rounded-lg bg-muted/60 p-3 text-xs whitespace-pre-wrap break-words">
                  {typeof lastResult === "string"
                    ? lastResult
                    : JSON.stringify(lastResult, null, 2)}
                </pre>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function MacrosMobileCameraExperience({
  busy,
  scanError,
  lastResult,
  runScan,
}: {
  busy: boolean;
  scanError: string | null;
  lastResult: unknown;
  runScan: (file: File | undefined | null) => Promise<void>;
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
    await runScan(file);
  }, [busy, runScan]);

  const onGalleryPick = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.files?.[0];
      void runScan(next);
      e.target.value = "";
    },
    [runScan],
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
              (typeof navigator === "undefined" ||
                !navigator.mediaDevices?.getUserMedia)
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

      {(scanError || lastResult !== null) && (
        <Card size="sm" className="mx-4 overflow-hidden rounded-xl sm:mx-0">
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-medium">Scan result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            {scanError && (
              <p className="flex items-start gap-2 text-destructive text-sm leading-relaxed">
                <AlertCircleIcon
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <span>{scanError}</span>
              </p>
            )}
            {lastResult !== null && (
              <pre className="max-h-40 overflow-auto rounded-lg bg-muted/60 p-3 text-[0.6875rem] whitespace-pre-wrap break-words leading-snug">
                {typeof lastResult === "string"
                  ? lastResult
                  : JSON.stringify(lastResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
