# Elazar OS – Personal Portfolio & Apps Hub

**Live site:** [https://elazaros-app.elazar-greisman.workers.dev/](https://elazaros-app.elazar-greisman.workers.dev/)

Personal portfolio for Elazar Greisman (Professional resume, Shidduch profile, Apps hub, etc.).

---

## Deploy to Cloudflare (same URL)

This project deploys as a **Cloudflare Worker with static assets** and stays on:

`https://elazaros-app.elazar-greisman.workers.dev`

### Automatic deploys

Every push to the `main` branch automatically builds and deploys via GitHub Actions.

### Manual deploy (from your computer)

```bash
npm install
npx wrangler login   # only needed once
npm run deploy
```

---

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Hash-based routing
- Cloudflare Workers (static assets)

## Notes

- Replit has been completely removed from the workflow.
- The site is now a pure static frontend.
