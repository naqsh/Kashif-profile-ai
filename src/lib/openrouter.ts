import OpenAI from "openai";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

export type RunStatus = "success" | "failure" | "degraded";

export function getOpenRouterBaseUrl(): string {
  return process.env.OPENROUTER_BASE_URL?.trim() || DEFAULT_BASE_URL;
}

export function getOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY?.trim() || undefined;
}

export function getPrimaryModel(): string {
  return (
    process.env.LLM_PRIMARY_MODEL?.trim() ||
    // Keep in sync with the documented default in .env.example.
    "nvidia/nemotron-3-ultra-550b-a55b:free"
  );
}

export function parseFallbackModels(primaryModel: string): string[] {
  const raw = process.env.LLM_OPENROUTER_MODELS?.trim();
  if (!raw) {
    return [primaryModel];
  }

  const models = raw
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  if (models.length === 0) {
    return [primaryModel];
  }

  if (!models.includes(primaryModel)) {
    return [primaryModel, ...models];
  }

  return models;
}

export function createOpenRouterClient(): OpenAI {
  const apiKey = getOpenRouterApiKey() || "";

  return new OpenAI({
    apiKey,
    baseURL: getOpenRouterBaseUrl(),
    defaultHeaders: {
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Kashif Jilani - AI Digital Twin",
    },
    dangerouslyAllowBrowser: false,
  });
}

export function maskApiKeyLabel(key: string): string {
  if (key.length <= 16) {
    return "••••••••";
  }
  return `${key.slice(0, 12)}…${key.slice(-3)}`;
}

/**
 * Derives run status for a *successful* stream: `degraded` when a fallback
 * model answered instead of the primary. The failure path is handled inline by
 * the route, so this helper only distinguishes success vs. degraded.
 */
export function resolveRunStatus(
  actualModel: string | undefined,
  primaryModel: string,
): RunStatus {
  if (!actualModel) {
    return "success";
  }

  if (actualModel.toLowerCase() === primaryModel.toLowerCase()) {
    return "success";
  }

  return "degraded";
}
