import { describe, expect, it, vi } from "vitest";
import { consumeChatStream } from "@/lib/chat-stream";
import type { RunMetadata } from "@/lib/usage-tracking";

function streamFrom(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

const metadata: RunMetadata = {
  latencyMs: 12,
  tokens: 42,
  costUsd: 0.001,
  model: "openai/gpt-oss-120b",
  status: "success",
};

describe("consumeChatStream", () => {
  it("throws when there is no body", async () => {
    await expect(consumeChatStream(null)).rejects.toThrow("No response body");
  });

  it("accumulates content deltas and invokes the callback with the running text", async () => {
    const onContent = vi.fn();
    const stream = streamFrom([
      `data: ${JSON.stringify({ content: "Hello" })}\n\n`,
      `data: ${JSON.stringify({ content: ", world" })}\n\n`,
      "data: [DONE]\n\n",
    ]);

    const result = await consumeChatStream(stream, onContent);

    expect(result.content).toBe("Hello, world");
    expect(onContent).toHaveBeenNthCalledWith(1, "Hello");
    expect(onContent).toHaveBeenNthCalledWith(2, "Hello, world");
  });

  it("captures run metadata and quota from a run_metadata event", async () => {
    const quota = { visitUsed: 1, visitLimit: 5, dayUsed: 1, dayLimit: 20 };
    const stream = streamFrom([
      `data: ${JSON.stringify({ content: "Hi" })}\n\n`,
      `data: ${JSON.stringify({ type: "run_metadata", metadata, quota })}\n\n`,
      "data: [DONE]\n\n",
    ]);

    const result = await consumeChatStream(stream);

    expect(result.content).toBe("Hi");
    expect(result.metadata).toEqual(metadata);
    expect(result.quota).toEqual(quota);
  });

  it("handles SSE frames split across chunk boundaries", async () => {
    const frame = `data: ${JSON.stringify({ content: "split" })}\n\n`;
    const mid = Math.floor(frame.length / 2);
    const stream = streamFrom([frame.slice(0, mid), frame.slice(mid), "data: [DONE]\n\n"]);

    const result = await consumeChatStream(stream);

    expect(result.content).toBe("split");
  });

  it("ignores malformed JSON payloads", async () => {
    const stream = streamFrom([
      "data: {not valid json}\n\n",
      `data: ${JSON.stringify({ content: "ok" })}\n\n`,
      "data: [DONE]\n\n",
    ]);

    const result = await consumeChatStream(stream);

    expect(result.content).toBe("ok");
  });
});
