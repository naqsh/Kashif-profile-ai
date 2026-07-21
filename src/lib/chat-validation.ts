import { z } from "zod";

/**
 * Runtime validation for the `/api/chat` request body.
 *
 * The TypeScript types alone do not protect the paid OpenRouter endpoint: a
 * caller can POST an arbitrarily large `messages` array of huge strings, or
 * inject a `role: "system"` message to attempt a prompt override. This schema
 * enforces hard limits and strips client-supplied `system` turns before the
 * request is ever forwarded upstream.
 */

export const MAX_MESSAGES = 20;
export const MAX_CONTENT_LENGTH = 2000;

/** Client turns are limited to user/assistant; `system` is server-owned. */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_CONTENT_LENGTH),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
});

export type ValidatedChatMessage = z.infer<typeof chatMessageSchema>;
export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;

export type ChatValidationResult =
  | { ok: true; data: ValidatedChatRequest }
  | { ok: false; error: string };

/**
 * Validates and normalises an already-parsed request body. Returns a discriminated
 * result so the route can respond with a 400 instead of throwing.
 */
export function validateChatRequest(body: unknown): ChatValidationResult {
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path.join(".");
    const message = first?.message ?? "Invalid request body";
    return { ok: false, error: path ? `${path}: ${message}` : message };
  }

  return { ok: true, data: parsed.data };
}
