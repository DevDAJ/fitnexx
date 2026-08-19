import { Asset } from "expo-asset";
import { initLlama, releaseAllLlama } from "llama.rn";
import type { LlamaContext } from "llama.rn";
import { WORKOUT_SUGGESTION_PROMPT } from "@fitnexx/shared";

const MODEL_ASSET = require("../assets/models/qwen2.5-0.5b-instruct-q4_k_m.gguf");

let context: LlamaContext | null = null;

export function isModelLoaded(): boolean {
  return context !== null;
}

export async function loadModel(onProgress?: (progress: number) => void): Promise<LlamaContext> {
  if (context) return context;

  const asset = Asset.fromModule(MODEL_ASSET);
  await asset.downloadAsync();
  if (!asset.localUri) {
    throw new Error("Bundled model could not be resolved");
  }

  context = await initLlama(
    {
      model: asset.localUri,
      n_ctx: 2048,
      n_gpu_layers: 99,
      use_mlock: true,
    },
    onProgress,
  );
  return context;
}

export async function generateWorkoutSuggestion(
  contextText: string,
  onToken?: (token: string) => void,
): Promise<string> {
  const llama = await loadModel();
  const result = await llama.completion(
    {
      messages: [
        { role: "system", content: WORKOUT_SUGGESTION_PROMPT },
        { role: "user", content: contextText },
      ],
      temperature: 0.3,
      n_predict: 640,
      // ponytail: no response_format grammar; a 0.5B model emits empty valid JSON
      // under strict gbnf. The prompt instructs JSON-only and normalize() parses it.
    },
    onToken ? (data) => onToken(data.token) : undefined,
  );
  return result.text ?? "";
}

export async function unloadModel(): Promise<void> {
  if (context) {
    await releaseAllLlama();
    context = null;
  }
}
