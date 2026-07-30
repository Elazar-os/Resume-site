/**
 * Minimal Worker entry point for static assets serving.
 * Cloudflare Workers will serve files from the assets directory (./dist/public)
 * and only invoke this Worker for requests that don't match any static file.
 * The SPA not_found_handling in wrangler.jsonc handles client-side routing.
 */
export default {
  async fetch() {
    return new Response("Not found", { status: 404 });
  },
};
