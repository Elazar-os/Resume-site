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
  OPEN_AI_API?: string;
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

function openrouterKey(env: Env): string | undefined {
  return env.OPENROUTER_API_KEY || env.OPEN_AI_API;
}

function availableRoutes(env: Env, requested?: string): ModelRoute[] {
  const key = (requested || "auto").trim().toLowerCase();
  const gemini = !!env.GEMINI_API_KEY;
  const groq = !!env.GROQ_API_KEY;
  const openai = !!env.OPENAI_API_KEY;
  const openrouter = !!openrouterKey(env);

  const all: ModelRoute[] = [];
  if (groq) {
    all.push({ provider: "groq", model: "llama-3.1-8b-instant" });
    all.push({ provider: "groq", model: "llama-3.3-70b-versatile" });
  }
  if (openrouter) {
    all.push({ provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free" });
    all.push({ provider: "openrouter", model: "qwen/qwen3-8b:free" });
  }
  if (gemini) {
    all.push({ provider: "gemini", model: "gemini-3.1-flash-lite" });
    all.push({ provider: "gemini", model: "gemini-3.5-flash-lite" });
    all.push({ provider: "gemini", model: "gemini-2.5-flash-lite" });
  }
  if (openai) all.push({ provider: "openai", model: "gpt-4o-mini" });

  if (key === "fast") {
    return all.filter((r) => r.provider === "groq" || r.provider === "openrouter" || r.model.includes("flash-lite") || r.model.includes("8b"));
  }
  if (key === "lite") {
    return all.filter((r) => r.provider === "gemini" || r.provider === "groq" || r.provider === "openrouter");
  }
  if (key === "quality") {
    const q: ModelRoute[] = [];
    if (gemini) q.push({ provider: "gemini", model: "gemini-3.8-flash" });
    if (openrouter) q.push({ provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free" });
    q.push(...all);
    return q;
  }
  if (key.startsWith("gemini-")) return [{ provider: "gemini", model: key }];
  if (key.startsWith("llama-3.1-8b") || key.startsWith("llama-3.3-70b-versatile")) return [{ provider: "groq", model: key }];
  if (key.startsWith("gpt-") && !key.includes("/")) return [{ provider: "openai", model: key }];
  if (key.includes("/") || key.endsWith(":free")) return [{ provider: "openrouter", model: key }];
  return all;
}
