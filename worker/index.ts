/**
 * ElazarOS Cloudflare Worker
 * Gary SYSTEM_PROMPT = V3.2d + multi-provider fallback
 */

export interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
  GROQ_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
}

type GaryMode = "professional" | "shidduch" | "full";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GaryRequest {
  messages: ChatMessage[];
  mode?: GaryMode;
  model?: string;
}

type ProviderName = "gemini" | "groq" | "openai" | "openrouter";

interface ModelRoute {
  provider: ProviderName;
  model: string;
}

function availableRoutes(env: Env, requested?: string): ModelRoute[] {
  const key = (requested || "auto").trim().toLowerCase();
  const gemini = !!env.GEMINI_API_KEY;
  const groq = !!env.GROQ_API_KEY;
  const openai = !!env.OPENAI_API_KEY;
  const openrouter = !!env.OPENROUTER_API_KEY;

  const all: ModelRoute[] = [];
  if (groq) {
    all.push({ provider: "groq", model: "llama-3.1-8b-instant" });
    all.push({ provider: "groq", model: "llama-3.3-70b-versatile" });
  }
  if (gemini) {
    all.push({ provider: "gemini", model: "gemini-3.1-flash-lite" });
    all.push({ provider: "gemini", model: "gemini-3.5-flash-lite" });
    all.push({ provider: "gemini", model: "gemini-2.5-flash-lite" });
  }
  if (openai) all.push({ provider: "openai", model: "gpt-4o-mini" });
  if (openrouter) {
    all.push({ provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct" });
    all.push({ provider: "openrouter", model: "openai/gpt-4o-mini" });
  }

  if (key === "fast") {
    return all.filter((r) => r.provider === "groq" || r.model.includes("flash-lite") || r.model.includes("8b"));
  }
  if (key === "lite") {
    return all.filter((r) => r.provider === "gemini" || r.provider === "groq");
  }
  if (key === "quality") {
    const q: ModelRoute[] = [];
    if (gemini) q.push({ provider: "gemini", model: "gemini-3.8-flash" });
    if (openai) q.push({ provider: "openai", model: "gpt-4o-mini" });
    if (groq) q.push({ provider: "groq", model: "llama-3.3-70b-versatile" });
    q.push(...all);
    return q;
  }
  if (key.startsWith("gemini-")) return [{ provider: "gemini", model: key }];
  if (key.startsWith("llama-") || key.startsWith("openai/gpt-oss")) return [{ provider: "groq", model: key }];
  if (key.startsWith("gpt-")) return [{ provider: "openai", model: key }];
  if (key.includes("/")) return [{ provider: "openrouter", model: key }];
  return all;
}
