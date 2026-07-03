import type { ChatMessage } from "./prompt";

const BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-flash";
const TIMEOUT_MS = 30_000;

export function getModel(): string {
  return process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
}

export function hasApiKey(): boolean {
  return !!process.env.DEEPSEEK_API_KEY?.trim();
}

/** Public, secret-free base URL (for diagnostics). */
export function getBaseUrl(): string {
  return BASE_URL;
}

/**
 * Safe server-side debug logger for the AI report flow.
 * NEVER pass the API key or any secret here. Values are logged verbatim.
 */
export function aiDebugLog(event: string, fields: Record<string, unknown> = {}): void {
  // Single-line, structured, secret-free. Visible in the server console.
  console.info(`[ai-report] ${event}`, fields);
}

export type DeepSeekErrorCode =
  | "MISSING_KEY"
  | "TIMEOUT"
  | "HTTP_ERROR"
  | "RATE_LIMITED"
  | "NO_CONTENT";

export class DeepSeekError extends Error {
  code: DeepSeekErrorCode;
  status?: number;
  constructor(code: DeepSeekErrorCode, message: string, status?: number) {
    super(message);
    this.name = "DeepSeekError";
    this.code = code;
    this.status = status;
  }
}

export interface DeepSeekResult {
  content: string;
  status: number;
  finishReason?: string;
}

/**
 * Server-side only. Calls DeepSeek chat/completions and returns the raw JSON
 * string content plus safe metadata (HTTP status, finish_reason).
 * Never logs the API key. Throws DeepSeekError on failure so the caller can
 * fall back deterministically.
 */
export async function callDeepSeek(messages: ChatMessage[]): Promise<DeepSeekResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const model = getModel();

  // Never logs the key itself — only whether one is present.
  aiDebugLog("deepseek.request", {
    hasDeepSeekApiKey: !!apiKey,
    model,
    baseUrl: BASE_URL,
    requestSent: !!apiKey,
  });

  if (!apiKey) {
    throw new DeepSeekError("MISSING_KEY", "DEEPSEEK_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 1600,
        stream: false,
      }),
      signal: controller.signal,
    });

    aiDebugLog("deepseek.response", { httpStatus: res.status, ok: res.ok });

    if (res.status === 429) {
      throw new DeepSeekError("RATE_LIMITED", "DeepSeek rate limit reached.", 429);
    }
    if (!res.ok) {
      throw new DeepSeekError(
        "HTTP_ERROR",
        `DeepSeek returned HTTP ${res.status}.`,
        res.status
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
    };
    const choice = data?.choices?.[0];
    const content = choice?.message?.content;
    const finishReason = choice?.finish_reason;

    aiDebugLog("deepseek.content", {
      finishReason: finishReason ?? null,
      hasContent: !!content && typeof content === "string",
      contentLength: typeof content === "string" ? content.length : 0,
    });

    if (!content || typeof content !== "string") {
      throw new DeepSeekError("NO_CONTENT", "DeepSeek returned no content.", res.status);
    }
    return { content, status: res.status, finishReason };
  } catch (error) {
    if (error instanceof DeepSeekError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new DeepSeekError("TIMEOUT", "DeepSeek request timed out.");
    }
    // Do not surface raw error details (may contain sensitive request info).
    throw new DeepSeekError(
      "HTTP_ERROR",
      error instanceof Error ? error.message : "DeepSeek request failed."
    );
  } finally {
    clearTimeout(timer);
  }
}
