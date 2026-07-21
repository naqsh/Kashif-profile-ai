"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  X,
  Trash2,
  Sparkles,
  Mic,
  MicOff,
} from "lucide-react";
import { toast } from "sonner";
import { consumeChatStream } from "@/lib/chat-stream";
import { DigitalTwinObservability } from "@/components/digital-twin-observability";
import { ChatMarkdown } from "@/components/chat-markdown";
import { DigitalTwinStarterPrompts } from "@/components/digital-twin-starter-prompts";
import { useAnalytics } from "@/lib/analytics";
import {
  DIGITAL_TWIN_OPEN_EVENT,
  markDigitalTwinDismissed,
  shouldAutoOpenDigitalTwin,
} from "@/lib/digital-twin-events";
import type { QuotaSnapshot, QuestionLimitError, RunMetadata } from "@/lib/usage-tracking";
import {
  fetchQuotaSnapshot,
  formatQuotaBanner,
  isQuotaExceeded,
  quotaExceededMessage,
  resetVisitQuotaOnServer,
} from "@/lib/usage-tracking";
import { PROFILE_DATA } from "@/lib/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEFAULT_WELCOME_MESSAGE =
  "Hello! I'm Kashif's AI Digital Twin. I can answer concise, grounded questions about my career, projects, and GitHub work. What would you like to know?";

const getDefaultMessages = (): Message[] => [
  {
    id: "welcome",
    role: "assistant",
    content: DEFAULT_WELCOME_MESSAGE,
    timestamp: new Date(),
  },
];

const AIChat = () => {
  const { trackChatInteraction } = useAnalytics();
  const [isOpen, setIsOpen] = useState(() => shouldAutoOpenDigitalTwin());
  const [messages, setMessages] = useState<Message[]>(getDefaultMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [runMetadata, setRunMetadata] = useState<RunMetadata | null>(null);
  const [accountRefreshToken, setAccountRefreshToken] = useState(0);
  const [quotaSnapshot, setQuotaSnapshot] = useState<QuotaSnapshot | null>(null);
  const [quotaBlockedReason, setQuotaBlockedReason] = useState<"visit" | "day" | null>(
    null,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const closeChat = useCallback(() => {
    markDigitalTwinDismissed();
    setIsOpen(false);
  }, []);

  // Modal behaviour: close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChat();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeChat]);

  const refreshQuota = useCallback(async () => {
    const snapshot = await fetchQuotaSnapshot();
    if (!snapshot) return;

    setQuotaSnapshot(snapshot);
    if (isQuotaExceeded(snapshot)) {
      setQuotaBlockedReason(
        snapshot.visitLimit > 0 && snapshot.visitUsed >= snapshot.visitLimit
          ? "visit"
          : "day",
      );
    } else {
      setQuotaBlockedReason(null);
    }
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    void refreshQuota();
  }, [refreshQuota]);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
      return;
    }
    openChat();
  }, [isOpen, closeChat, openChat]);

  const shouldFetchQuotaOnMount = useRef(
    typeof window !== "undefined" ? shouldAutoOpenDigitalTwin() : false,
  );

  useEffect(() => {
    if (!shouldFetchQuotaOnMount.current) {
      return;
    }

    shouldFetchQuotaOnMount.current = false;

    let cancelled = false;

    void (async () => {
      const snapshot = await fetchQuotaSnapshot();
      if (cancelled || !snapshot) {
        return;
      }

      setQuotaSnapshot(snapshot);
      if (isQuotaExceeded(snapshot)) {
        setQuotaBlockedReason(
          snapshot.visitLimit > 0 && snapshot.visitUsed >= snapshot.visitLimit
            ? "visit"
            : "day",
        );
      } else {
        setQuotaBlockedReason(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleOpen = () => openChat();

    window.addEventListener(DIGITAL_TWIN_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(DIGITAL_TWIN_OPEN_EVENT, handleOpen);
  }, [openChat]);

  const streamAssistantResponse = useCallback(
    async (
      history: Array<{ role: "user" | "assistant"; content: string }>,
      assistantMessageId: string,
    ) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: history }),
      });

      if (response.status === 429) {
        const errorBody = (await response.json()) as QuestionLimitError;
        setQuotaSnapshot({
          visitUsed: errorBody.visitUsed,
          visitLimit: errorBody.visitLimit,
          dayUsed: errorBody.dayUsed,
          dayLimit: errorBody.dayLimit,
        });
        setQuotaBlockedReason(errorBody.reason);
        const limitError = new Error("question_limit_reached") as Error & {
          reason: "visit" | "day";
        };
        limitError.reason = errorBody.reason;
        throw limitError;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch assistant response");
      }

      const { content, metadata, quota } = await consumeChatStream(
        response.body,
        (streamedContent) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: streamedContent } : msg,
            ),
          );
        },
      );

      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content } : msg)),
      );

      if (metadata) {
        setRunMetadata(metadata);
        if (metadata.status !== "failure") {
          setAccountRefreshToken((token) => token + 1);
        }
      }

      if (quota) {
        setQuotaSnapshot(quota);
        if (isQuotaExceeded(quota)) {
          setQuotaBlockedReason(
            quota.visitLimit > 0 && quota.visitUsed >= quota.visitLimit
              ? "visit"
              : "day",
          );
        }
      } else {
        void refreshQuota();
      }

      return { content, metadata };
    },
    [refreshQuota],
  );

  const sendMessage = useCallback(
    async (messageText: string, source: "input" | "starter" = "input") => {
      const trimmed = messageText.trim();
      if (!trimmed || isLoading) return;

      if (quotaSnapshot && isQuotaExceeded(quotaSnapshot)) {
        setQuotaBlockedReason(
          quotaSnapshot.visitLimit > 0 &&
            quotaSnapshot.visitUsed >= quotaSnapshot.visitLimit
            ? "visit"
            : "day",
        );
        return;
      }

      trackChatInteraction("message_sent", {
        messageLength: trimmed.length,
        source,
      });

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const history = [
          ...messages
            // Drop the synthetic welcome bubble (and any empty placeholders)
            // so it isn't billed as input tokens or mistaken for a real turn.
            .filter((msg) => msg.id !== "welcome" && msg.content.trim() !== "")
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          {
            role: "user" as const,
            content: trimmed,
          },
        ];

        const assistantMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const { content } = await streamAssistantResponse(history, assistantMessage.id);
        trackChatInteraction("response_received", {
          responseLength: content.length,
        });
      } catch (error) {
        if (error instanceof Error && error.message === "question_limit_reached") {
          const reason =
            (error as Error & { reason?: "visit" | "day" }).reason ?? "visit";

          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant" && !last.content) {
              next.pop();
            }
            const maybeUser = next[next.length - 1];
            if (maybeUser?.role === "user" && maybeUser.content === trimmed) {
              next.pop();
            }
            return [
              ...next,
              {
                id: `${Date.now()}-limit`,
                role: "assistant" as const,
                content: quotaExceededMessage(reason),
                timestamp: new Date(),
              },
            ];
          });

          setQuotaBlockedReason(reason);
          trackChatInteraction("question_limit_reached", { reason });
          return;
        }

        setRunMetadata({
          latencyMs: 0,
          tokens: 0,
          costUsd: 0,
          model: "unavailable",
          status: "failure",
        });
        trackChatInteraction("error", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-error`,
            role: "assistant",
            content:
              "I hit an error while processing that. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, quotaSnapshot, streamAssistantResponse, trackChatInteraction],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input, "input");
  };

  const handleStarterPrompt = useCallback(
    (prompt: string) => {
      trackChatInteraction("starter_prompt_click", { prompt });
      void sendMessage(prompt, "starter");
    },
    [sendMessage, trackChatInteraction],
  );

  const handleClearHistory = useCallback(async () => {
    setMessages(getDefaultMessages());
    setInput("");
    setRunMetadata(null);
    setIsLoading(false);
    setQuotaBlockedReason(null);
    trackChatInteraction("clear_history");

    const snapshot = await resetVisitQuotaOnServer();
    if (snapshot) {
      setQuotaSnapshot(snapshot);
    }
  }, [trackChatInteraction]);

  const handleVoiceInput = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast("Voice input is not supported in your browser.");
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      toast("Voice input is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      trackChatInteraction("voice_input_start");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setInput(transcript);
      setIsListening(false);
      trackChatInteraction("voice_input_success", { transcriptLength: transcript.length });
      inputRef.current?.focus();
    };

    recognition.onerror = () => {
      setIsListening(false);
      trackChatInteraction("voice_input_error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [trackChatInteraction]);

  const showStarterPrompts =
    messages.length === 1 && !isLoading && !quotaBlockedReason;
  const quotaBanner = quotaSnapshot ? formatQuotaBanner(quotaSnapshot) : null;
  const inputDisabled = isLoading || Boolean(quotaBlockedReason);

  return (
    <>
      <motion.button
        id="ai-twin-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? "Close AI Twin chat" : "Open AI Twin chat"}
        aria-expanded={isOpen}
        aria-controls="ai-twin-panel"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_0_34px_rgba(14,165,233,0.55)] transition-colors duration-300 hover:bg-sky-400 mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)]"
      >
        {!isOpen ? (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-sky-500 opacity-35"
            aria-hidden="true"
          />
        ) : null}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <MessageSquare className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="ai-twin-panel"
            role="dialog"
            aria-modal="true"
            aria-label="AI Digital Twin"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 top-16 bottom-[5.5rem] z-40 flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:inset-x-auto sm:top-auto sm:bottom-26 sm:right-6 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[calc(100vw-2rem)] sm:max-w-[620px]"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                  {PROFILE_DATA.initials}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Kashif Jilani</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-sky-400" />
                    AI Digital Twin · Always online
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearHistory}
                aria-label="Clear chat history"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" ? (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-sky-500 text-white"
                          : "rounded-tl-sm border border-border/70 bg-muted/30 text-foreground"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <ChatMarkdown
                          content={message.content}
                          isStreaming={isLoading && index === messages.length - 1}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      )}
                    </div>

                    {message.role === "user" ? (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                        <User className="h-4 w-4" />
                      </div>
                    ) : null}
                  </motion.div>
                ))}

                {showStarterPrompts ? (
                  <DigitalTwinStarterPrompts
                    onSelect={handleStarterPrompt}
                    disabled={inputDisabled}
                  />
                ) : null}

                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border/70 px-4 py-3">
              <DigitalTwinObservability runMetadata={runMetadata} refreshToken={accountRefreshToken} />
              {quotaBanner ? (
                <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                  {quotaBanner}
                </p>
              ) : null}
              {quotaBlockedReason ? (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  {quotaExceededMessage(quotaBlockedReason)}
                </p>
              ) : null}
              <form onSubmit={handleSubmit} className="mt-2 flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder="Ask me anything about my work..."
                  rows={1}
                  maxLength={600}
                  disabled={inputDisabled}
                  className="max-h-28 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={inputDisabled || isListening}
                  aria-label={isListening ? "Listening..." : "Voice input"}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || inputDisabled}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                AI Digital Twin · Responses may not reflect real-time views
              </p>
              <div className="mt-1.5 hidden sm:flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                <span>💬 Smart conversations</span>
                <span>🎤 Voice input</span>
                <span>📊 Analytics enabled</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
