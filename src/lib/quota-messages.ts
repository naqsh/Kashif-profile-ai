/**
 * Single source of truth for user-facing quota messaging, shared by the
 * server-side quota module and the client usage-tracking helpers so the copy
 * cannot drift between them.
 */
export function quotaExceededMessage(reason: "visit" | "day"): string {
  if (reason === "visit") {
    return "You've reached the question limit for this visit. Clear chat to start a new visit, or try again tomorrow if you've also hit the daily limit.";
  }
  return "You've reached today's question limit. Please try again tomorrow, or clear chat if you still have visit allowance.";
}
