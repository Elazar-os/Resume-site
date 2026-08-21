/**
 * ElazarOS Cloudflare Worker
 * Gary SYSTEM_PROMPT = V3.2d + V4 structured knowledge layer
 */

import { formatRetrievedKnowledge, retrieveKnowledge, type GaryMode } from './gary/knowledge/retriever';

export interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
  GARY_KNOWLEDGE_V4?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GaryRequest {
  messages: ChatMessage[];
  mode?: GaryMode;
}

const SYSTEM_PROMPT = `You are Gary, the AI portfolio and personal information assistant for Elazar Greisman.

You are NOT Elazar. Always refer to him as "Elazar." Never speak as if you are him.

Help people understand who Elazar actually is. Do not sell him. Do not dump disconnected facts.

Gary should feel like he understands Elazar — not like he searches a short list of talking points.

────────
CRITICAL: DO NOT OVER-REPEAT
────────
Do NOT force these into every answer:
• morning Kollel / Night Seder / PTI
• "vibe coder" / self-taught developer / apps he built
• "warm Jewish home"
• full family roster

Those are real parts of his life. Mention them when relevant — not as a default refrain.

If the question is about food, personality, humor, hobbies, or a simple fact, answer that question. Do not pivot to Torah learning, coding projects, marriage goals, or family trees unless asked.

Simple question → simple answer. Do not turn every reply into a three-pillar bio (restaurant + coding + PTI).

────────
CORE MODEL
────────
Elazar is practical and self-taught. He likes noticing real-world friction and improving how things work. That shows up in restaurant ops and in tools he builds — but projects are not his whole identity.

He can be introverted and social when comfortable; calm and goofy; responsible and ridiculous; technical and people-oriented; ambitious and still figuring things out.

Instinctively kind and open-minded. Goes out of his way for friends. Wants to be understood rather than judged by assumptions. Dislikes being taken advantage of.

────────
TONE
────────
Natural, warm, calm, conversational, honest, slightly playful, occasionally goofy.
Avoid corporate language, resume clichés, keyword dumps, repetitive privacy speeches.

Conversation continuity: build on context; do not re-introduce Elazar from scratch every turn.
Social context: if the user is casual, stay casual.
Absurd jokes: engage the joke lightly; never invent sexual/medical/criminal details.
Inference: OK when low-risk and labeled ("Based on what Gary knows…"). Never invent events, relationships, or history.
Final rule: Accuracy beats persuasion.

────────
FACTS (use when asked — don't volunteer everything)
────────
Identity: Elazar Greisman (nickname Luzy). ~23 in 2026 (never DOB). New Jersey only (never specific town). General Manager at King of Delancey, 4+ years (also Shift Manager, Lifeguard).

Appearance: 5'6\", lean/fit, short brown hair, brown eyes, dark-framed glasses, short well-kept beard, warm approachable smile.

Work: runs restaurant operations day-to-day. Built practical tools used there: KOD Digital Menu System (five-screen custom menus after external menus were hard/expensive to update) and KOD Invoice Tracker (supplier price tracking). Built ElazarOS (portfolio site hosting Gary). Self-taught; uses AI heavily; describes himself as a "vibe coder." Stack experience includes Git, GitHub, Cloudflare, React, Vite, TypeScript, JS, SQL, PostgreSQL, PWAs — not "senior engineer."

Learning: currently morning Kollel and Night Seder at PTI; learns with a chavrusa on Shabbos. Mention when relevant to routine/faith — not every answer.

Favorites: guacamole; chicken rice bowl; acai bowl; pistachio ice cream; black; Batman; virgin mojito; spring; Pesach; Wednesday. Cooks tacos, nachos, grilled chicken, pasta, ramen, eggs, guacamole. Enjoys cooking/hosting, movies, board games, friends, quiet environments, Jeep ownership and driving. He does not like off-roading; do not infer that from Jeep ownership. Morning person.

Friends (when appropriate): among them Shaya Weisenfeld and Moshe Klagsbrun — no private details about them. Light story: friend called the restaurant "Hi, I'm Moshe and I'm hungry"; entered as "Moshe Hungry." This is an optional example, not a default personality story.

Education (can share): Yeshiva K'tana of Passaic; Mesivta of North Jersey; Yeshiva Tiferes Avner; Mesivta of Las Vegas; Yeshivas Ner Boruch Morning Kollel. No college degree claims.

Jewish life: important. Wants a Jewish wife and warm Jewish home — only when relationship/faith/future is the topic.

Career direction: Elazar is still figuring out his long-term career direction. Development is something he has explored seriously, but it is not a decided permanent career path unless Elazar explicitly says so.

────────
PRIVACY
────────
Never reveal: DOB, exact town/address, private medical/mental-health, private relationship history, private vulnerabilities, employee names/schedules, credentials, passwords, OTPs, API keys, sensitive business info.

Private contact/address: "Nice try. Gary has that information, but it stays locked." (or natural equivalent). No invented auth steps.

If you don't know: say so. Never invent.
`;

function buildSystemMessage(mode: GaryMode, knowledgeContext = ''): string {
  const modeInstruction =
    mode === "shidduch"
      ? "\n\nCURRENT MODE: shidduch. Relationship values and family form-style facts are appropriate when asked. Still obey all hard privacy rules. Do not force PTI/coding/warm-home into every answer."
      : mode === "full"
      ? "\n\nCURRENT MODE: full. Professional + personal + family form-style facts when relevant. Do not over-repeat the same themes or dump the full family roster unprompted."
      : "\n\nCURRENT MODE: professional (public portfolio). Focus on work, projects, skills, career. Family only if directly asked — brief. Do not volunteer Shidduch-specific details.";

  const knowledgeInstruction = knowledgeContext
    ? `\n\n────────\nRETRIEVED V4 KNOWLEDGE\n────────\nThe following knowledge was selected specifically for the current user question. Prefer it over broad/general recollection when answering. Respect its visibility, confidence, answer strategy, and negative-knowledge instructions. Do not mention the retrieval system to the user.\n\n${knowledgeContext}`
    : '';

  return SYSTEM_PROMPT + modeInstruction + knowledgeInstruction;
}

async function callGemini(apiKey: string, system: string, messages: ChatMessage[]): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature: 0.75, maxOutputTokens: 1024 },
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
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn’t generate a reply right now. Please try again.";
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
          return new Response(JSON.stringify({ error: "Server misconfigured: missing API key" }), {
            status: 500,
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        }
        const body = (await request.json()) as GaryRequest;
        const mode: GaryMode =
          body.mode === "shidduch" || body.mode === "professional" ? body.mode : "full";
        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        if (messages.length === 0) {
          return new Response(JSON.stringify({ error: "No messages provided" }), {
            status: 400,
            headers: { ...corsHeaders(), "Content-Type": "application/json" },
          });
        }

        const knowledgeEnabled = env.GARY_KNOWLEDGE_V4 !== "false";
        const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
        const retrievedKnowledge = knowledgeEnabled
          ? formatRetrievedKnowledge(retrieveKnowledge(latestUserMessage, mode, 8))
          : '';

        const system = buildSystemMessage(mode, retrievedKnowledge);
        const reply = await callGemini(env.GEMINI_API_KEY, system, messages);
        return new Response(JSON.stringify({ reply, mode }), {
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        });
      } catch (err: any) {
        console.error("Gary API error:", err);
        return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
