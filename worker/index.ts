/**
 * TEMPORARY MINIMAL RESTORE - will replace with full V3
 */
export interface Env { ASSETS: Fetcher; GEMINI_API_KEY: string; }
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    if (url.pathname === "/api/gary" && request.method === "POST") {
      return new Response(JSON.stringify({ error: "Gary is being updated. Please try again in a minute." }), { status: 503, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } });
    }
    return env.ASSETS.fetch(request);
  },
};
