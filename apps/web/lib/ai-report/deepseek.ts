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

/**
 * Server-side only. Calls DeepSeek chat/completions and returns the raw JSON
 * string content. Never logs the API key. Throws DeepSeekError on failure so
 * the caller can fall back deterministically.
 */
export async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
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
        model: getModel(),
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1600,
        stream: false,
      }),
      signal: controller.signal,
    });

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
      choices?: { message?: { content?: string } }[];
    };
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new DeepSeekError("NO_CONTENT", "DeepSeek returned no content.");
    }
    return content;
  } catch (error) {
    if (error instanceof DeepSeekError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new DeepSeekError("TIMEOUT", "DeepSeek request timed out.");
    }
    throw new DeepSeekError(
      "HTTP_ERROR",
      error instanceof Error ? error.message : "DeepSeek request failed."
    );
  } finally {
    clearTimeout(timer);
  }
}
