import { OpenRouter } from "@openrouter/sdk";
import { NextResponse } from "next/server";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MAX_BYTES = 12 * 1024 * 1024;
const MACRO_VISION_MODEL = "@preset/fitnexx-macro-vision";

async function fileToDataUrl(file: File): Promise<string> {
  const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const mime = file.type || "image/jpeg";
  return `data:${mime};base64,${b64}`;
}

function assistantTextContent(
  content: string | Array<unknown> | null | undefined,
): string | null {
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return null;
  }
  const parts = content
    .filter(
      (p): p is { type: string; text?: string } =>
        typeof p === "object" &&
        p !== null &&
        "type" in p &&
        (p as { type: string }).type === "text",
    )
    .map((p) => p.text ?? "")
    .join("");
  return parts.length ? parts : null;
}

function tryParseJsonPayload(raw: string): unknown {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/u, "")
    .trim();
  try {
    return JSON.parse(stripped) as unknown;
  } catch {
    console.error("Failed to parse JSON payload", stripped);
    return null;
  }
}

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

    const apiKey =
      typeof process.env.OPENROUTER_API_KEY === "string"
        ? process.env.OPENROUTER_API_KEY.trim()
        : "";

    if (apiKey) {
      const dataUrl = await fileToDataUrl(file);
      const result = await client.chat.send(
        {
          chatRequest: {
            model: MACRO_VISION_MODEL,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Analyze this food or meal image and return macro nutrition as JSON only, following your instructions.",
                  },
                  {
                    type: "image_url",
                    imageUrl: { url: dataUrl },
                  },
                ],
              },
            ],
          },
        },
        { timeoutMs: 120_000 },
      );

      const raw = assistantTextContent(result.choices[0]?.message?.content);
      return NextResponse.json(raw);
    }
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
