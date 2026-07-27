# Elazar OS – Personal Portfolio & Apps Hub

**Live site:** [https://elazaros-app.elazar-greisman.workers.dev/](https://elazaros-app.elazar-greisman.workers.dev/)

Personal portfolio for Elazar Greisman (Professional resume, Shidduch profile, Apps hub, etc.).

---

## Deploy to Cloudflare (same URL)

This project is configured to deploy as a **Cloudflare Worker with static assets** so it stays on:

`https://elazaros-app.elazar-greisman.workers.dev`

### One-time setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Log in to Cloudflare (if you haven’t already):
   ```bash
   npx wrangler login
   ```

### Deploy

```bash
npm run deploy
```

This runs `vite build` and then `wrangler deploy`.  
Because the Worker name is set to `elazaros-app`, it will update the existing deployment on the same URL.

---

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Hash-based routing (works perfectly on static hosts)
- Deployed via Cloudflare Workers static assets

## Notes

- Replit has been completely removed from the workflow.
- The site is now a pure static frontend.
