import { NextResponse } from "next/server";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: 'Expected multipart field "image" (image file).' },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "File must be an image (JPEG, PNG, WebP, etc.)." },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: `Image too large (max ${MAX_BYTES / (1024 * 1024)} MB).`,
        },
        { status: 413 },
      );
    }

    const upstream =
      typeof process.env.FOOD_SCAN_UPSTREAM_URL === "string"
        ? process.env.FOOD_SCAN_UPSTREAM_URL.trim()
        : "";

    if (upstream) {
      const forward = new FormData();
      forward.append("image", file, file.name || "capture.jpg");

      const res = await fetch(upstream, {
        method: "POST",
        body: forward,
        signal: AbortSignal.timeout(60_000),
      });

      const text = await res.text();
      let payload: unknown;
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        return NextResponse.json(
          {
            ok: false,
            error: "Upstream OCR returned non-JSON",
            upstreamStatus: res.status,
            upstreamBodySnippet: text.slice(0, 280),
          },
          { status: 502 },
        );
      }

      return NextResponse.json(payload, {
        status: res.ok ? res.status : 502,
      });
    }

    return NextResponse.json({
      ok: true,
      bytesReceived: file.size,
      filename: file.name || "unknown",
      mimeType: file.type,
      message:
        "Image accepted locally. Set FOOD_SCAN_UPSTREAM_URL to POST the same multipart field to your OCR pipeline.",
      macros: null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
