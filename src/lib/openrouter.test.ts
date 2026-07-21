import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  getPrimaryModel,
  maskApiKeyLabel,
  parseFallbackModels,
  resolveRunStatus,
} from "@/lib/openrouter";

describe("getPrimaryModel", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the env value when set", () => {
    vi.stubEnv("LLM_PRIMARY_MODEL", "vendor/custom-model");
    expect(getPrimaryModel()).toBe("vendor/custom-model");
  });

  it("falls back to the documented default", () => {
    vi.stubEnv("LLM_PRIMARY_MODEL", "");
    expect(getPrimaryModel()).toBe("nvidia/nemotron-3-ultra-550b-a55b:free");
  });
});

describe("parseFallbackModels", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns just the primary when no list is configured", () => {
    vi.stubEnv("LLM_OPENROUTER_MODELS", "");
    expect(parseFallbackModels("a/b")).toEqual(["a/b"]);
  });

  it("prepends the primary model when it is missing from the list", () => {
    vi.stubEnv("LLM_OPENROUTER_MODELS", "x/y, z/w");
    expect(parseFallbackModels("a/b")).toEqual(["a/b", "x/y", "z/w"]);
  });

  it("keeps the list as-is when the primary is already included", () => {
    vi.stubEnv("LLM_OPENROUTER_MODELS", "a/b, x/y");
    expect(parseFallbackModels("a/b")).toEqual(["a/b", "x/y"]);
  });
});

describe("resolveRunStatus", () => {
  it("returns success when no actual model is reported", () => {
    expect(resolveRunStatus(undefined, "a/b")).toBe("success");
  });

  it("returns success when the primary model answered (case-insensitive)", () => {
    expect(resolveRunStatus("A/B", "a/b")).toBe("success");
  });

  it("returns degraded when a fallback model answered", () => {
    expect(resolveRunStatus("x/y", "a/b")).toBe("degraded");
  });
});

describe("maskApiKeyLabel", () => {
  it("fully masks short keys", () => {
    expect(maskApiKeyLabel("short")).toBe("••••••••");
  });

  it("shows a prefix and suffix for long keys", () => {
    expect(maskApiKeyLabel("sk-or-v1-abcdefghijklmnop")).toBe("sk-or-v1-abc…nop");
  });
});
