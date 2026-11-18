/** NDJSON events streamed from /api/ai-chat to the browser. Shared, browser-safe. */
export type ChatStreamEvent =
  | { t: "delta"; v: string }
  | { t: "done"; messageId: string | null }
  | { t: "error"; code: "rate_limit" | "credits" | "unauthorized" | "bad_request" | "ai_failed" | "save_failed" };

export const MAX_MESSAGE_CHARS = 4000;
export const MAX_CONTEXT_CHARS = 20000;
/** Per-user limits enforced server-side from stored messages. */
export const RATE_LIMIT_PER_MINUTE = 6;
export const RATE_LIMIT_PER_DAY = 150;
