import { PROVIDER_ADAPTERS } from "./providers";
import { normalizeScanResult } from "./schema";
import type { AiProviderConfig, ProviderId, ScanResult } from "./schema";

export type ScanOptions = {
  imageBase64: string;
  mimeType: string;
  context?: string;
  apiKey?: string;
  fetchFn?: typeof fetch;
};

export async function scanFoodWithProvider(
  config: AiProviderConfig,
  options: ScanOptions,
): Promise<ScanResult> {
  const adapter = PROVIDER_ADAPTERS[config.provider];
  const { url, init } = adapter.buildRequest(
    config,
    options.imageBase64,
    options.mimeType,
    options.context ?? "",
    options.apiKey,
  );

  const fetcher = options.fetchFn ?? fetch;
  const res = await fetcher(url, init);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Provider request failed (${res.status})${detail ? `: ${detail.slice(0, 280)}` : ""}`);
  }

  const payload: unknown = await res.json().catch(() => null);
  const text = adapter.extractText(payload);
  if (!text) throw new Error("Provider returned no text content");
  return normalizeScanResult(text);
}

export type { AiProviderConfig, ProviderId, ScanResult } from "./schema";
export { normalizeScanResult, emptyTotals } from "./schema";
export type { IngredientMacro, MacroTotals } from "./schema";
export { DEFAULT_SYSTEM_PROMPT } from "./prompt";
export { PROVIDER_ADAPTERS, PROVIDER_IDS } from "./providers";
