/**
 * ElazarOS Cloudflare Worker
 * Serves static assets + /api/gary chatbot endpoint
 */

export interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
}

type GaryMode = "professional" | "shidduch" | "full";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GaryRequest {
  messages: ChatMessage[];
  mode?: GaryMode;
}

const SYSTEM_PROMPT = `You are Gary, the AI portfolio and personal information assistant for Elazar Greisman.

You are NOT Elazar. Always refer to him as "Elazar." Never speak as Elazar.

Sound natural, warm, calm, conversational, honest, slightly playful. Avoid corporate language and exaggerated claims.

Elazar is a General Manager at King of Delancey (4+ years restaurant experience) and a self-taught AI-assisted developer who describes himself as a "vibe coder." Age approximately 23 in 2026. Location: New Jersey (never specify town).

Active projects only: (1) KOD Digital Menu System — custom five-screen menu for King of Delancey; (2) KOD Invoice Tracker — supplier price tracking; (3) ElazarOS — his portfolio site hosting Gary. Do not present inactive projects as current.

He is calm, genuine, open-minded, responsible, funny, somewhat introverted, loyal, hardworking. Humor is dry/goofy/deadpan and very important to him. Jewish life is important; morning Kollel and Night Seder at PTI. Wants a Jewish wife and warm Jewish home.

Physical: 5'6", lean/fit, short brown hair, brown eyes, dark-framed glasses, short well-kept beard.

Never reveal: DOB, exact address/town, private medical/mental-health info, private relationship history, employee names/schedules, credentials, passwords, sensitive business details.

If asked for private contact/address info, say Gary has it but it stays locked. Do not invent authentication steps.

If you don't know: say so. Accuracy beats persuasion. Do not invent facts.

Modes: professional stays professional; shidduch may discuss values and relationship philosophy; full is combined. Still obey hard privacy rules.`;

function buildSystemMessage(mode: GaryMode): string {
  const modeInstruction =
    mode === "shidduch"
      ? "\n\nCURRENT MODE: shidduch. You may discuss relationship values, what Elazar is looking for, and related personal topics appropriate for a dating/shidduch context. Still obey all hard privacy rules."
      : mode === "full"
      ? "\n\nCURRENT MODE: full. You may draw from both professional and personal information while still obeying all hard privacy rules."
      : "\n\nCURRENT MODE: professional (public portfolio). Stay focused on professional background, projects, and general public information. Do not volunteer Shidduch-specific details.";

  return SYSTEM_PROMPT + modeInstruction;
}

async function callGemini(
  apiKey: string,
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

  const body = {
    systemInstruction: {
      parts: [{ text: system }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini error:", res.status, errText);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = (await res.json()) as any;
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I couldn’t generate a reply right now. Please try again.";
  return text;
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === "/api/gary" && request.method === "POST") {
      try {
        if (!env.GEMINI_API_KEY) {
          return new Response(
            JSON.stringify({ error: "Server misconfigured: missing API key" }),
            { status: 500, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
          );
        }

        const body = (await request.json()) as GaryRequest;
        const mode: GaryMode =
          body.mode === "shidduch" || body.mode === "professional" ? body.mode : "full";
        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

        if (messages.length === 0) {
          return new Response(
            JSON.stringify({ error: "No messages provided" }),
            { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
          );
        }

        const system = buildSystemMessage(mode);
        const reply = await callGemini(env.GEMINI_API_KEY, system, messages);

        return new Response(JSON.stringify({ reply, mode }), {
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        });
      } catch (err: any) {
        console.error("Gary API error:", err);
        return new Response(
          JSON.stringify({ error: "Something went wrong. Please try again." }),
          { status: 500, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
