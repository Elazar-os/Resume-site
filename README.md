# Elazar OS – Personal Portfolio & Apps Hub

Personal portfolio site for **Elazar Greisman**.

**Live site:** [https://elazaros-app.elazar-greisman.workers.dev/](https://elazaros-app.elazar-greisman.workers.dev/)

---

## Features

- Professional resume & experience
- Personal / Shidduch profile
- Photo selector
- Apps hub (KOD Menu + other projects)
- Contact page
- Resume PDF download

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Wouter (hash-based routing – works great on static hosts)
- Framer Motion
- Cloudflare Pages / Workers ready

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/public`.

---

## Deploy to Cloudflare Pages (Recommended – from GitHub)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select the `Elazar-os/Resume-site` repository
3. Configure build settings:
   - **Framework preset:** Vite (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/public`
   - **Root directory:** `/` (leave empty)
4. Click **Save and Deploy**

Cloudflare will automatically rebuild and deploy every time you push to `main`.

You can then attach your custom domain or keep the `*.pages.dev` URL.

---

## Deploy as GitHub Pages (optional preview)

1. Go to the repo → **Settings** → **Pages**
2. Source: **GitHub Actions** (recommended) or Deploy from branch
3. If using branch method: choose `main` and `/ (root)` or the built folder after a GitHub Action builds it.

For a simple static deploy you can also use a GitHub Action that runs `npm run build` and publishes `dist/public`.

---

## Project Structure

```
client/          → React frontend (Vite root)
server/          → Lightweight Express (mostly for local/dev)
shared/          → Shared types
attached_assets/ → Images & assets
dist/public/     → Production build output
```

## Notes

- Replit has been fully removed from the workflow.
- The site uses hash-based routing so it works perfectly on pure static hosts (Cloudflare Pages, GitHub Pages, Netlify, etc.).
